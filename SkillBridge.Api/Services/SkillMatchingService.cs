using SkillBridge.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SkillBridge.Api.Services
{
    public class MatchResult
    {
        public int JobMatchScore { get; set; }
        public string SummaryLabel { get; set; } = string.Empty;
        public List<SkillMatchDetail> SkillBreakdown { get; set; } = new List<SkillMatchDetail>();
    }

    public class SkillMatchDetail
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public int RequiredProficiency { get; set; }
        public int StudentProficiency { get; set; }
        public int Gap { get; set; }
        public decimal Weight { get; set; }
        public bool IsRequired { get; set; } = true;
        public double SkillMatchRatio { get; set; }
    }

    public class SkillMatchingService
    {
        public MatchResult CalculateMatch(StudentProfile student, List<StudentSkill> studentSkills, Job job)
        {
            if (job == null || job.JobSkills == null || !job.JobSkills.Any())
            {
                return new MatchResult { JobMatchScore = 0, SummaryLabel = "No Skills Defined" };
            }

            var studentSkillMap = studentSkills.ToDictionary(s => s.SkillId, s => (int)s.ProficiencyLevel);

            double totalWeightedMatch = 0;
            double totalWeightSum = 0;
            var breakdown = new List<SkillMatchDetail>();

            foreach (var req in job.JobSkills)
            {
                int studentProf = studentSkillMap.TryGetValue(req.SkillId, out int prof) ? prof : 0;
                int reqProf = req.RequiredProficiency > 0 ? req.RequiredProficiency : 1;

                double skillMatch = Math.Min((double)studentProf / reqProf, 1.0);
                double weight = (double)req.SkillWeight > 0 ? (double)req.SkillWeight : 10.0;

                totalWeightedMatch += skillMatch * weight;
                totalWeightSum += weight;

                int gap = Math.Max(reqProf - studentProf, 0);

                breakdown.Add(new SkillMatchDetail
                {
                    SkillId = req.SkillId,
                    SkillName = req.Skill?.SkillName ?? $"Skill #{req.SkillId}",
                    RequiredProficiency = reqProf,
                    StudentProficiency = studentProf,
                    Gap = gap,
                    Weight = req.SkillWeight,
                    IsRequired = req.IsRequired,
                    SkillMatchRatio = skillMatch
                });
            }

            int score = totalWeightSum > 0 ? (int)Math.Round((totalWeightedMatch / totalWeightSum) * 100) : 0;

            string label = "Needs Growth";
            if (score >= 85) label = "Excellent Match";
            else if (score >= 70) label = "Moderate/Strong Match";
            else if (score >= 50) label = "Moderate Match";

            return new MatchResult
            {
                JobMatchScore = score,
                SummaryLabel = label,
                SkillBreakdown = breakdown
            };
        }
    }
}
