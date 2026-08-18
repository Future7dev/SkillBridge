using Microsoft.EntityFrameworkCore;
using SkillBridge.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SkillBridge.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
        public DbSet<Skill> Skills => Set<Skill>();
        public DbSet<SkillDependency> SkillDependencies => Set<SkillDependency>();
        public DbSet<StudentSkill> StudentSkills => Set<StudentSkill>();
        public DbSet<Job> Jobs => Set<Job>();
        public DbSet<JobSkill> JobSkills => Set<JobSkill>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<Application> Applications => Set<Application>();
        public DbSet<Roadmap> Roadmaps => Set<Roadmap>();
        public DbSet<RoadmapItem> RoadmapItems => Set<RoadmapItem>();
        public DbSet<ResumeAnalysis> ResumeAnalyses => Set<ResumeAnalysis>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.StudentProfile)
                .WithOne(p => p.User)
                .HasForeignKey<StudentProfile>(p => p.UserId);

            modelBuilder.Entity<Job>()
                .HasMany(j => j.JobSkills)
                .WithOne()
                .HasForeignKey(js => js.JobId);
        }

        public void SeedInitialData()
        {
            // Seed master skills if empty in MySQL
            if (!Skills.Any())
            {
                var seedSkills = new List<Skill>
                {
                    new Skill { SkillName = "C#", Category = "Languages", Description = "Modern C# Language", CanonicalCode = "csharp" },
                    new Skill { SkillName = "ASP.NET Core", Category = "Backend Frameworks", Description = "Web API Framework", CanonicalCode = "aspnet_core" },
                    new Skill { SkillName = "SQL Server", Category = "Databases", Description = "Relational Database", CanonicalCode = "sql_server" },
                    new Skill { SkillName = "Entity Framework", Category = "ORM / Data Access", Description = "ORM Framework", CanonicalCode = "ef_core" },
                    new Skill { SkillName = "Docker", Category = "DevOps & Cloud", Description = "Containerization", CanonicalCode = "docker" },
                    new Skill { SkillName = "Azure", Category = "DevOps & Cloud", Description = "Cloud Platform", CanonicalCode = "azure" }
                };
                Skills.AddRange(seedSkills);
                SaveChanges();
            }

            // Seed Alex Rivera student if empty
            if (!Users.Any(u => u.Email == "alex.rivera@university.edu"))
            {
                var alexUser = new User
                {
                    Username = "alex_rivera",
                    Email = "alex.rivera@university.edu",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student123!"),
                    Role = "Student",
                    FirstName = "Alex",
                    LastName = "Rivera",
                    Status = "Active"
                };
                Users.Add(alexUser);
                SaveChanges();

                var alexProfile = new StudentProfile
                {
                    UserId = alexUser.UserId,
                    Degree = "B.S. Computer Science",
                    Institution = "State Institute of Technology",
                    GraduationYear = 2027,
                    Cgpa = 3.80m,
                    TargetRole = "Backend Engineer Intern",
                    Bio = "C# & ASP.NET Core enthusiast."
                };
                StudentProfiles.Add(alexProfile);
                SaveChanges();
            }

            // Seed Default Job Postings into MySQL Database if empty
            if (!Jobs.Any())
            {
                var recruiter = Users.FirstOrDefault(u => u.Role == "Recruiter") ?? Users.First();
                
                var job1 = new Job
                {
                    RecruiterId = recruiter.UserId,
                    JobTitle = "Junior Backend Engineer (C# / .NET Core)",
                    CompanyName = "TechBridge Systems",
                    Location = "Remote / Hybrid",
                    EmploymentType = "Internship",
                    ExperienceLevel = "Entry-Level",
                    Description = "Seeking a motivated junior backend engineer with hands-on C#, ASP.NET Core Web API, and relational database skills.",
                    PostedDate = DateTime.UtcNow,
                    Status = "Active"
                };

                var job2 = new Job
                {
                    RecruiterId = recruiter.UserId,
                    JobTitle = "Cloud & DevOps Intern (Docker / Azure)",
                    CompanyName = "CloudScale Solutions",
                    Location = "New York, NY (Hybrid)",
                    EmploymentType = "Internship",
                    ExperienceLevel = "Entry-Level",
                    Description = "Join our DevOps microservices infrastructure team. Help build containerized CI/CD pipelines using Docker and deploy to Azure.",
                    PostedDate = DateTime.UtcNow,
                    Status = "Active"
                };

                Jobs.AddRange(job1, job2);
                SaveChanges();

                var csharpSkill = Skills.FirstOrDefault(s => s.CanonicalCode == "csharp");
                var aspnetSkill = Skills.FirstOrDefault(s => s.CanonicalCode == "aspnet_core");
                var sqlSkill = Skills.FirstOrDefault(s => s.CanonicalCode == "sql_server");
                var dockerSkill = Skills.FirstOrDefault(s => s.CanonicalCode == "docker");

                if (csharpSkill != null && aspnetSkill != null && sqlSkill != null)
                {
                    JobSkills.AddRange(
                        new JobSkill { JobId = job1.JobId, SkillId = csharpSkill.SkillId, RequiredProficiency = 3, SkillWeight = 25, IsRequired = true },
                        new JobSkill { JobId = job1.JobId, SkillId = aspnetSkill.SkillId, RequiredProficiency = 3, SkillWeight = 25, IsRequired = true },
                        new JobSkill { JobId = job1.JobId, SkillId = sqlSkill.SkillId, RequiredProficiency = 3, SkillWeight = 20, IsRequired = true }
                    );
                }

                if (dockerSkill != null)
                {
                    JobSkills.AddRange(
                        new JobSkill { JobId = job2.JobId, SkillId = dockerSkill.SkillId, RequiredProficiency = 3, SkillWeight = 30, IsRequired = true }
                    );
                }

                SaveChanges();
            }

            // Seed Initial Student Applications into MySQL Database if empty
            if (!Applications.Any())
            {
                var studentUser = Users.FirstOrDefault(u => u.Role == "Student") ?? Users.First();
                var job = Jobs.FirstOrDefault();

                if (job != null)
                {
                    var seedApp = new Application
                    {
                        UserId = studentUser.UserId,
                        JobId = job.JobId,
                        ApplicationDate = DateTime.UtcNow,
                        MatchScorePct = 78m,
                        Status = "Under Review",
                        Notes = "Initial application screened by automated TF-IDF model."
                    };

                    Applications.Add(seedApp);
                    SaveChanges();
                }
            }
        }
    }
}
