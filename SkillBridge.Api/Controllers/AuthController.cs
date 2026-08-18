using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Api.Data;
using SkillBridge.Api.Models;
using SkillBridge.Api.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SkillBridge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtService _jwt;

        public AuthController(AppDbContext db, JwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        // Student Registration Endpoint
        [HttpPost("register-student")]
        public async Task<IActionResult> RegisterStudent([FromBody] StudentRegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "An account with this email already exists in MySQL. Please sign in instead." });
            }

            var nameParts = dto.FullName.Split(' ');
            var firstName = nameParts[0];
            var lastName = nameParts.Length > 1 ? string.Join(" ", nameParts[1..]) : "User";

            var user = new User
            {
                Username = dto.Email.Split('@')[0] + "_" + Guid.NewGuid().ToString().Substring(0, 4),
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Student",
                FirstName = firstName,
                LastName = lastName,
                Status = "Active"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var studentProfile = new StudentProfile
            {
                UserId = user.UserId,
                Degree = dto.Degree,
                Institution = dto.University,
                GraduationYear = dto.GraduationYear,
                TargetRole = dto.TargetRoles.Count > 0 ? dto.TargetRoles[0] : "Software Engineer"
            };

            _db.StudentProfiles.Add(studentProfile);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.UserId.ToString(),
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                Role = user.Role,
                ProfileDetails = new { studentProfile.Degree, studentProfile.Institution, studentProfile.GraduationYear }
            });
        }

        // Recruiter Registration Endpoint
        [HttpPost("register-recruiter")]
        public async Task<IActionResult> RegisterRecruiter([FromBody] RecruiterRegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "An account with this email already exists in MySQL. Please sign in instead." });
            }

            var nameParts = dto.FullName.Split(' ');
            var firstName = nameParts[0];
            var lastName = nameParts.Length > 1 ? string.Join(" ", nameParts[1..]) : "Recruiter";

            var user = new User
            {
                Username = dto.Email.Split('@')[0] + "_" + Guid.NewGuid().ToString().Substring(0, 4),
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Recruiter",
                FirstName = firstName,
                LastName = lastName,
                Status = "Active"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.UserId.ToString(),
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                Role = user.Role,
                ProfileDetails = new { dto.CompanyName, dto.Industry }
            });
        }

        // Mentor Registration Endpoint
        [HttpPost("register-mentor")]
        public async Task<IActionResult> RegisterMentor([FromBody] MentorRegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "An account with this email already exists in MySQL. Please sign in instead." });
            }

            var nameParts = dto.FullName.Split(' ');
            var firstName = nameParts[0];
            var lastName = nameParts.Length > 1 ? string.Join(" ", nameParts[1..]) : "Mentor";

            var user = new User
            {
                Username = dto.Email.Split('@')[0] + "_" + Guid.NewGuid().ToString().Substring(0, 4),
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Mentor",
                FirstName = firstName,
                LastName = lastName,
                Status = "Active"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.UserId.ToString(),
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                Role = user.Role,
                ProfileDetails = new { dto.Institution, dto.Bio }
            });
        }

        // Universal Login Endpoint - STRICT MySQL DATABASE VALIDATION
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            // STRICT REJECTION: If user is not found in MySQL or password does not match
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { 
                    message = "User account does not exist or credentials are invalid. If you do not have an account, please click Register to sign up." 
                });
            }

            var token = _jwt.GenerateToken(user);

            object? details = null;
            if (user.StudentProfile != null)
                details = new { user.StudentProfile.Degree, user.StudentProfile.Institution };

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.UserId.ToString(),
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                Role = user.Role,
                ProfileDetails = details
            });
        }

        // Me / Session Check Endpoint
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var user = await _db.Users
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return NotFound();

            return Ok(new
            {
                user.UserId,
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                user.Email,
                user.Role
            });
        }
    }
}
