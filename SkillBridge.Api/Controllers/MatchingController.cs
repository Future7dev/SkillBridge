using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Api.Data;
using SkillBridge.Api.Services;
using System.Threading.Tasks;

namespace SkillBridge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchingController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly SkillMatchingService _matcher;

        public MatchingController(AppDbContext db, SkillMatchingService matcher)
        {
            _db = db;
            _matcher = matcher;
        }

        [HttpGet("calculate/{userId}/{jobId}")]
        public async Task<IActionResult> CalculateMatchScore(int userId, int jobId)
        {
            var student = await _db.StudentProfiles
                .FirstOrDefaultAsync(s => s.UserId == userId);

            var studentSkills = await _db.StudentSkills
                .Where(s => s.UserId == userId)
                .ToListAsync();

            var job = await _db.Jobs
                .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
                .FirstOrDefaultAsync(j => j.JobId == jobId);

            if (student == null || job == null)
            {
                return NotFound(new { message = "Student profile or job posting not found in MySQL database." });
            }

            var result = _matcher.CalculateMatch(student, studentSkills, job);
            return Ok(result);
        }
    }
}
