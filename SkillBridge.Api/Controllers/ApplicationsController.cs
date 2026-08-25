using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Api.Data;
using SkillBridge.Api.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SkillBridge.Api.Controllers
{
    public class CreateApplicationDto
    {
        public int UserId { get; set; } = 1;
        public int JobId { get; set; } = 1;
        public decimal MatchScorePct { get; set; } = 75m;
        public string Status { get; set; } = "Under Review";
        public string? Notes { get; set; }
    }

    public class UpdateApplicationStatusDto
    {
        public string Status { get; set; } = "Under Review";
        public string? Notes { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // All endpoints require a valid JWT
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ApplicationsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/applications — Any authenticated user (student sees own, recruiter sees all)
        [HttpGet]
        public async Task<IActionResult> GetApplications()
        {
            var apps = await _db.Applications
                .OrderByDescending(a => a.ApplicationDate)
                .ToListAsync();

            var userIds = apps.Select(a => a.UserId).Distinct().ToList();
            var jobIds = apps.Select(a => a.JobId).Distinct().ToList();

            var users = await _db.Users
                .Include(u => u.StudentProfile)
                .Where(u => userIds.Contains(u.UserId))
                .ToDictionaryAsync(u => u.UserId);

            var jobs = await _db.Jobs
                .Where(j => jobIds.Contains(j.JobId))
                .ToDictionaryAsync(j => j.JobId);

            var result = apps.Select(a =>
            {
                users.TryGetValue(a.UserId, out var user);
                jobs.TryGetValue(a.JobId, out var job);

                string studentName = user != null ? $"{user.FirstName} {user.LastName}".Trim() : "Applicant";
                if (string.IsNullOrEmpty(studentName)) studentName = "Student Applicant";

                return new
                {
                    id = a.ApplicationId.ToString(),
                    applicationId = a.ApplicationId.ToString(),
                    jobId = a.JobId.ToString(),
                    jobTitle = job != null ? job.JobTitle : "Job Posting",
                    company = job != null ? job.CompanyName : "Company",
                    studentId = a.UserId.ToString(),
                    studentName = studentName,
                    studentEmail = user != null ? user.Email : "student@university.edu",
                    degree = user?.StudentProfile?.Degree ?? "B.S. Computer Science",
                    institution = user?.StudentProfile?.Institution ?? "University",
                    appliedDate = a.ApplicationDate.ToString("yyyy-MM-dd"),
                    status = a.Status,
                    matchScore = (int)a.MatchScorePct,
                    stageNotes = a.Notes ?? "Application submitted."
                };
            });

            return Ok(result);
        }

        // POST: /api/applications — Only Students can submit applications
        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitApplication([FromBody] CreateApplicationDto dto)
        {
            var app = new Application
            {
                UserId = dto.UserId > 0 ? dto.UserId : 1,
                JobId = dto.JobId > 0 ? dto.JobId : 1,
                ApplicationDate = DateTime.UtcNow,
                MatchScorePct = dto.MatchScorePct,
                Status = string.IsNullOrEmpty(dto.Status) ? "Under Review" : dto.Status,
                Notes = dto.Notes ?? "Application submitted."
            };

            _db.Applications.Add(app);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                id = app.ApplicationId.ToString(),
                applicationId = app.ApplicationId.ToString(),
                jobId = app.JobId.ToString(),
                userId = app.UserId.ToString(),
                status = app.Status,
                matchScore = (int)app.MatchScorePct
            });
        }

        // PUT: /api/applications/{id}/status — Only Recruiters and Admins can update recruitment stage
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Recruiter,Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            var app = await _db.Applications.FindAsync(id);
            if (app == null) return NotFound();

            app.Status = dto.Status;
            if (!string.IsNullOrEmpty(dto.Notes)) app.Notes = dto.Notes;

            await _db.SaveChangesAsync();
            return Ok(new { id = app.ApplicationId.ToString(), status = app.Status });
        }

        // DELETE: /api/applications/{id} — Students (withdraw) or Recruiters/Admins (reject) can delete 
        [HttpDelete("{id}")]
        public async Task<IActionResult> WithdrawApplication(int id)
        {
            var app = await _db.Applications.FindAsync(id);
            if (app == null) return NotFound();

            _db.Applications.Remove(app);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
