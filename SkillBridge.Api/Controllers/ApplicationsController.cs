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
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ApplicationsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/applications (Fetches all job applications from MySQL database)
        [HttpGet]
        public async Task<IActionResult> GetApplications()
        {
            var apps = await _db.Applications
                .OrderByDescending(a => a.ApplicationDate)
                .ToListAsync();

            // Join with Users, StudentProfiles, and Jobs for full details
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

                string studentName = user != null ? $"{user.FirstName} {user.LastName}".Trim() : "Priyam Student";
                if (string.IsNullOrEmpty(studentName)) studentName = "Student Applicant";

                return new
                {
                    id = a.ApplicationId.ToString(),
                    applicationId = a.ApplicationId.ToString(),
                    jobId = a.JobId.ToString(),
                    jobTitle = job != null ? job.JobTitle : "Backend Engineering Intern",
                    company = job != null ? job.CompanyName : "TechBridge Systems",
                    studentId = a.UserId.ToString(),
                    studentName = studentName,
                    studentEmail = user != null ? user.Email : "student@university.edu",
                    degree = user?.StudentProfile?.Degree ?? "B.S. Computer Science",
                    institution = user?.StudentProfile?.Institution ?? "State Institute of Technology",
                    appliedDate = a.ApplicationDate.ToString("yyyy-MM-dd"),
                    status = a.Status,
                    matchScore = (int)a.MatchScorePct,
                    stageNotes = a.Notes ?? "Application submitted and stored in MySQL."
                };
            });

            return Ok(result);
        }

        // POST: /api/applications (Stores student application directly in MySQL)
        [HttpPost]
        public async Task<IActionResult> SubmitApplication([FromBody] CreateApplicationDto dto)
        {
            var app = new Application
            {
                UserId = dto.UserId > 0 ? dto.UserId : 1,
                JobId = dto.JobId > 0 ? dto.JobId : 1,
                ApplicationDate = DateTime.UtcNow,
                MatchScorePct = dto.MatchScorePct,
                Status = string.IsNullOrEmpty(dto.Status) ? "Under Review" : dto.Status,
                Notes = dto.Notes ?? "Application submitted and saved to MySQL database."
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

        // PUT: /api/applications/{id}/status (Updates application recruitment status in MySQL)
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            var app = await _db.Applications.FindAsync(id);
            if (app == null) return NotFound();

            app.Status = dto.Status;
            if (!string.IsNullOrEmpty(dto.Notes)) app.Notes = dto.Notes;

            await _db.SaveChangesAsync();
            return Ok(new { id = app.ApplicationId.ToString(), status = app.Status });
        }

        // DELETE: /api/applications/{id} (Deletes application / Student Opt Out from MySQL)
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
