using System.Collections.Generic;

namespace SkillBridge.Api.Models
{
    public class StudentRegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Degree { get; set; } = "B.S. Computer Science";
        public string University { get; set; } = "State Institute of Technology";
        public int GraduationYear { get; set; } = 2027;
        public List<string> TargetRoles { get; set; } = new List<string>();
    }

    public class RecruiterRegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Industry { get; set; } = "Technology";
        public string CompanyWebsite { get; set; } = string.Empty;
    }

    public class MentorRegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public List<string> ExpertiseAreas { get; set; } = new List<string>();
    }

    public class AdminRegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string AdminSecurityKey { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Student";
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public object? ProfileDetails { get; set; }
    }
}
