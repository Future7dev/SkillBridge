using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Api.Data;
using SkillBridge.Api.Models;
using System.Threading.Tasks;

namespace SkillBridge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public JobsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _db.Jobs
                .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
                .ToListAsync();
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _db.Jobs
                .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
                .FirstOrDefaultAsync(j => j.JobId == id);
            
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job posting)
        {
            _db.Jobs.Add(posting);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJob), new { id = posting.JobId }, posting);
        }
    }
}
