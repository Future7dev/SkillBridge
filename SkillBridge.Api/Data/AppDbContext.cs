using Microsoft.EntityFrameworkCore;
using SkillBridge.Api.Models;
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
        }
    }
}
