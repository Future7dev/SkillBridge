using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Api.Data;
using SkillBridge.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkillBridge.Api.Controllers
{
    public class CreateJobRequestDto
    {
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Location { get; set; } = "Remote / Hybrid";
        public string EmploymentType { get; set; } = "Internship";
        public string ExperienceLevel { get; set; } = "Entry-Level";
        public string Description { get; set; } = string.Empty;
        public int RecruiterId { get; set; } = 1;
        public List<CreateJobSkillDto> Skills { get; set; } = new List<CreateJobSkillDto>();
    }

    public class CreateJobSkillDto
    {
        public string SkillId { get; set; } = string.Empty;
        public string SkillName { get; set; } = string.Empty;
        public byte RequiredProficiency { get; set; } = 3;
        public decimal Weight { get; set; } = 15m;
        public string Importance { get; set; } = "Required";
    }

    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public JobsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/jobs (Fetches all job postings from MySQL Database)
        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _db.Jobs
                .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
                .OrderByDescending(j => j.PostedDate)
                .ToListAsync();

            var result = jobs.Select(j => new
            {
                id = j.JobId.ToString(),
                jobId = j.JobId.ToString(),
                title = j.JobTitle,
                jobTitle = j.JobTitle,
                company = j.CompanyName,
                companyName = j.CompanyName,
                location = j.Location,
                type = j.EmploymentType,
                employmentType = j.EmploymentType,
                experienceLevel = j.ExperienceLevel,
                description = j.Description,
                postedDate = j.PostedDate.ToString("yyyy-MM-dd"),
                status = j.Status,
                skillsRequired = j.JobSkills.Select(js => new
                {
                    skillId = js.Skill != null ? js.Skill.CanonicalCode : js.SkillId.ToString(),
                    skillName = js.Skill != null ? js.Skill.SkillName : $"Skill #{js.SkillId}",
                    requiredProficiency = (int)js.RequiredProficiency,
                    weight = (int)js.SkillWeight,
                    importance = js.IsRequired ? "Required" : "Preferred"
                }).ToList()
            });

            return Ok(result);
        }

        // GET: /api/jobs/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var j = await _db.Jobs
                .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
                .FirstOrDefaultAsync(job => job.JobId == id);
            
            if (j == null) return NotFound();

            var result = new
            {
                id = j.JobId.ToString(),
                jobId = j.JobId.ToString(),
                title = j.JobTitle,
                jobTitle = j.JobTitle,
                company = j.CompanyName,
                companyName = j.CompanyName,
                location = j.Location,
                type = j.EmploymentType,
                employmentType = j.EmploymentType,
                description = j.Description,
                postedDate = j.PostedDate.ToString("yyyy-MM-dd"),
                skillsRequired = j.JobSkills.Select(js => new
                {
                    skillId = js.Skill != null ? js.Skill.CanonicalCode : js.SkillId.ToString(),
                    skillName = js.Skill != null ? js.Skill.SkillName : $"Skill #{js.SkillId}",
                    requiredProficiency = (int)js.RequiredProficiency,
                    weight = (int)js.SkillWeight,
                    importance = js.IsRequired ? "Required" : "Preferred"
                }).ToList()
            };

            return Ok(result);
        }

        // POST: /api/jobs (Stores job posting in MySQL Database `jobs` and `job_skills` tables)
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobRequestDto dto)
        {
            var job = new Job
            {
                RecruiterId = dto.RecruiterId > 0 ? dto.RecruiterId : 1,
                JobTitle = dto.JobTitle,
                CompanyName = dto.CompanyName,
                Location = string.IsNullOrEmpty(dto.Location) ? "Remote / Hybrid" : dto.Location,
                EmploymentType = string.IsNullOrEmpty(dto.EmploymentType) ? "Internship" : dto.EmploymentType,
                ExperienceLevel = dto.ExperienceLevel,
                Description = dto.Description,
                PostedDate = DateTime.UtcNow,
                Status = "Active"
            };

            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();

            // Link skill requirements to job in MySQL
            if (dto.Skills != null && dto.Skills.Count > 0)
            {
                foreach (var sk in dto.Skills)
                {
                    var canonicalSkill = await _db.Skills
                        .FirstOrDefaultAsync(s => s.CanonicalCode == sk.SkillId || s.SkillName.ToLower() == sk.SkillName.ToLower());

                    int skillId = canonicalSkill?.SkillId ?? 1;

                    _db.JobSkills.Add(new JobSkill
                    {
                        JobId = job.JobId,
                        SkillId = skillId,
                        RequiredProficiency = sk.RequiredProficiency,
                        SkillWeight = sk.Weight,
                        IsRequired = sk.Importance == "Required",
                        RequirementImportance = sk.Importance == "Required" ? 1.5m : 1.0m
                    });
                }
                await _db.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetJob), new { id = job.JobId }, new
            {
                id = job.JobId.ToString(),
                jobId = job.JobId.ToString(),
                title = job.JobTitle,
                company = job.CompanyName,
                location = job.Location,
                type = job.EmploymentType,
                description = job.Description,
                postedDate = job.PostedDate.ToString("yyyy-MM-dd")
            });
        }

        // DELETE: /api/jobs/{id} (Deletes a job posting from MySQL Database)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            _db.Jobs.Remove(job);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
