using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillBridge.Api.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("username")]
        public string Username { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("role")]
        public string Role { get; set; } = "Student"; // Student, Recruiter, Mentor, Administrator

        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = "Active";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public StudentProfile? StudentProfile { get; set; }
    }

    [Table("student_profiles")]
    public class StudentProfile
    {
        [Key]
        [Column("profile_id")]
        public int ProfileId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("degree")]
        public string? Degree { get; set; } = "B.S. Computer Science";

        [Column("institution")]
        public string? Institution { get; set; } = "State Institute of Technology";

        [Column("graduation_year")]
        public int? GraduationYear { get; set; } = 2027;

        [Column("cgpa")]
        public decimal? Cgpa { get; set; } = 3.8m;

        [Column("target_role")]
        public string? TargetRole { get; set; } = "Backend Engineer Intern";

        [Column("bio")]
        public string? Bio { get; set; } = string.Empty;

        [Column("linkedin_url")]
        public string? LinkedinUrl { get; set; }

        [Column("github_url")]
        public string? GithubUrl { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }

    [Table("skills")]
    public class Skill
    {
        [Key]
        [Column("skill_id")]
        public int SkillId { get; set; }

        [Column("skill_name")]
        public string SkillName { get; set; } = string.Empty;

        [Column("category")]
        public string Category { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("canonical_code")]
        public string CanonicalCode { get; set; } = string.Empty;
    }

    [Table("skill_dependencies")]
    public class SkillDependency
    {
        [Key]
        [Column("dependency_id")]
        public int DependencyId { get; set; }

        [Column("skill_id")]
        public int SkillId { get; set; }

        [Column("prerequisite_skill_id")]
        public int PrerequisiteSkillId { get; set; }

        [Column("description")]
        public string? Description { get; set; }
    }

    [Table("student_skills")]
    public class StudentSkill
    {
        [Key]
        [Column("student_skill_id")]
        public int StudentSkillId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("skill_id")]
        public int SkillId { get; set; }

        [Column("proficiency_level")]
        public byte ProficiencyLevel { get; set; } = 0; // 0 to 5

        [Column("verified_by_project")]
        public bool VerifiedByProject { get; set; } = false;

        [Column("self_rating")]
        public byte SelfRating { get; set; } = 0; // 0 to 5

        [Column("last_updated")]
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        [ForeignKey("SkillId")]
        public Skill? Skill { get; set; }
    }

    [Table("jobs")]
    public class Job
    {
        [Key]
        [Column("job_id")]
        public int JobId { get; set; }

        [Column("recruiter_id")]
        public int RecruiterId { get; set; }

        [Column("job_title")]
        public string JobTitle { get; set; } = string.Empty;

        [Column("company_name")]
        public string CompanyName { get; set; } = string.Empty;

        [Column("location")]
        public string Location { get; set; } = string.Empty;

        [Column("employment_type")]
        public string EmploymentType { get; set; } = "Internship";

        [Column("experience_level")]
        public string ExperienceLevel { get; set; } = "Entry-Level";

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("posted_date")]
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;

        [Column("status")]
        public string Status { get; set; } = "Active";

        public List<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
    }

    [Table("job_skills")]
    public class JobSkill
    {
        [Key]
        [Column("job_skill_id")]
        public int JobSkillId { get; set; }

        [Column("job_id")]
        public int JobId { get; set; }

        [Column("skill_id")]
        public int SkillId { get; set; }

        [Column("required_proficiency")]
        public byte RequiredProficiency { get; set; } = 3; // 1-5

        [Column("skill_weight")]
        public decimal SkillWeight { get; set; } = 15.0m;

        [Column("is_required")]
        public bool IsRequired { get; set; } = true;

        [Column("requirement_importance")]
        public decimal RequirementImportance { get; set; } = 1.0m;

        [ForeignKey("SkillId")]
        public Skill? Skill { get; set; }
    }

    [Table("projects")]
    public class Project
    {
        [Key]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("technologies_used")]
        public string? TechnologiesUsed { get; set; }

        [Column("github_link")]
        public string? GithubLink { get; set; }

        [Column("verified_proficiency_bonus")]
        public byte VerifiedProficiencyBonus { get; set; } = 0;
    }

    [Table("applications")]
    public class Application
    {
        [Key]
        [Column("application_id")]
        public int ApplicationId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("job_id")]
        public int JobId { get; set; }

        [Column("application_date")]
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

        [Column("match_score_pct")]
        public decimal MatchScorePct { get; set; } = 0m;

        [Column("status")]
        public string Status { get; set; } = "Submitted";

        [Column("notes")]
        public string? Notes { get; set; }
    }

    [Table("roadmaps")]
    public class Roadmap
    {
        [Key]
        [Column("roadmap_id")]
        public int RoadmapId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("job_id")]
        public int JobId { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("total_steps")]
        public int TotalSteps { get; set; } = 0;

        [Column("completed_steps")]
        public int CompletedSteps { get; set; } = 0;

        [Column("overall_gap_score")]
        public decimal OverallGapScore { get; set; } = 0m;

        [Column("status")]
        public string Status { get; set; } = "In Progress";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("roadmap_items")]
    public class RoadmapItem
    {
        [Key]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Column("roadmap_id")]
        public int RoadmapId { get; set; }

        [Column("skill_id")]
        public int SkillId { get; set; }

        [Column("step_order")]
        public int StepOrder { get; set; } = 1;

        [Column("recommendation_reason")]
        public string? RecommendationReason { get; set; }

        [Column("target_proficiency")]
        public byte TargetProficiency { get; set; } = 3;

        [Column("estimated_hours")]
        public int EstimatedHours { get; set; } = 0;

        [Column("is_completed")]
        public bool IsCompleted { get; set; } = false;

        [Column("status")]
        public string Status { get; set; } = "Pending";
    }

    [Table("resume_analysis")]
    public class ResumeAnalysis
    {
        [Key]
        [Column("analysis_id")]
        public int AnalysisId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("job_id")]
        public int JobId { get; set; }

        [Column("tfidf_cosine_similarity")]
        public decimal? TfidfCosineSimilarity { get; set; }

        [Column("extracted_skills_count")]
        public int ExtractedSkillsCount { get; set; } = 0;

        [Column("matched_skills_count")]
        public int MatchedSkillsCount { get; set; } = 0;

        [Column("missing_skills_count")]
        public int MissingSkillsCount { get; set; } = 0;

        [Column("overall_match_score")]
        public decimal? OverallMatchScore { get; set; }

        [Column("top_recommendation")]
        public string? TopRecommendation { get; set; }

        [Column("analyzed_at")]
        public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("notifications")]
    public class Notification
    {
        [Key]
        [Column("notification_id")]
        public int NotificationId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("message")]
        public string Message { get; set; } = string.Empty;

        [Column("is_read")]
        public bool IsRead { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("audit_logs")]
    public class AuditLog
    {
        [Key]
        [Column("log_id")]
        public int LogId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("action")]
        public string Action { get; set; } = string.Empty;

        [Column("entity_name")]
        public string EntityName { get; set; } = string.Empty;

        [Column("entity_id")]
        public int? EntityId { get; set; }

        [Column("details")]
        public string? Details { get; set; }

        [Column("logged_at")]
        public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
    }
}
