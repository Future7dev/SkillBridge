import { SKILL_DEPENDENCIES, CANONICAL_SKILLS } from '../data/skillsData';

/**
 * Calculate Effective Proficiency for a student skill
 * Formula: Effective = min(SelfAssessment + ProjectBonus, 5)
 */
export function getEffectiveProficiency(studentSkillRecord) {
  if (!studentSkillRecord) return 0;
  const base = studentSkillRecord.selfAssessment || 0;
  const bonus = studentSkillRecord.projectBonus || 0;
  return Math.min(base + bonus, 5);
}

/**
 * Calculate complete match metrics between a student and a job requirement
 * Exact formulas from SkillBridge Document Sections 6, 7, 8, 9
 */
export function calculateJobMatch(student, job) {
  if (!student || !job) {
    return {
      jobMatchScore: 0,
      skillBreakdown: [],
      strongSkills: [],
      lowGaps: [],
      mediumGaps: [],
      highGaps: [],
      summaryLabel: "No Match"
    };
  }

  // Normalize skill requirements array from either skillsRequired or jobSkills
  const rawSkills = job.skillsRequired || job.jobSkills || [];
  
  // Default fallback requirements if no specific skills were specified
  const skillsRequired = rawSkills.length > 0 ? rawSkills.map(sk => ({
    skillId: sk.skillId || sk.skill?.canonicalCode || 'csharp',
    skillName: sk.skillName || sk.skill?.skillName || 'C#',
    requiredProficiency: sk.requiredProficiency || 3,
    weight: sk.weight || sk.skillWeight || 15,
    importance: sk.importance || (sk.isRequired === false ? 'Preferred' : 'Required')
  })) : [
    { skillId: 'csharp', skillName: 'C#', requiredProficiency: 3, weight: 25, importance: 'Required' },
    { skillId: 'aspnet_core', skillName: 'ASP.NET Core', requiredProficiency: 3, weight: 25, importance: 'Required' },
    { skillId: 'sql_server', skillName: 'SQL Server', requiredProficiency: 3, weight: 20, importance: 'Required' }
  ];

  let totalWeightedMatch = 0;
  let totalWeightSum = 0;

  const skillBreakdown = [];
  const strongSkills = [];
  const lowGaps = [];
  const mediumGaps = [];
  const highGaps = [];

  const studentSkillMap = new Map();
  (student.skills || []).forEach(s => {
    studentSkillMap.set(s.skillId, s);
  });

  skillsRequired.forEach(req => {
    const studentRecord = studentSkillMap.get(req.skillId);
    const effectiveProficiency = getEffectiveProficiency(studentRecord);

    const requiredProficiency = req.requiredProficiency || 1;
    const skillMatch = Math.min(effectiveProficiency / requiredProficiency, 1);
    const weight = req.weight || 10;

    totalWeightedMatch += skillMatch * weight;
    totalWeightSum += weight;

    const gap = Math.max(requiredProficiency - effectiveProficiency, 0);
    const importanceMultiplier = req.importance === 'Required' ? 1.5 : 1.0;
    const priorityScore = gap * weight * importanceMultiplier;

    let gapCategory = 'Strong Match';
    if (gap === 0) {
      gapCategory = 'Strong Match';
    } else if (gap === 1) {
      gapCategory = 'Low Gap';
    } else if (gap === 2) {
      gapCategory = 'Medium Gap';
    } else {
      gapCategory = 'High Gap';
    }

    const item = {
      skillId: req.skillId,
      skillName: req.skillName,
      requiredProficiency,
      studentProficiency: effectiveProficiency,
      gap,
      weight,
      importance: req.importance || 'Required',
      skillMatchRatio: skillMatch,
      priorityScore,
      gapCategory
    };

    skillBreakdown.push(item);

    if (gap === 0) strongSkills.push(item);
    else if (gap === 1) lowGaps.push(item);
    else if (gap === 2) mediumGaps.push(item);
    else highGaps.push(item);
  });

  const jobMatchScore = totalWeightSum > 0 ? Math.round((totalWeightedMatch / totalWeightSum) * 100) : 0;

  let summaryLabel = "Strong Match";
  if (jobMatchScore >= 85) summaryLabel = "Excellent Match";
  else if (jobMatchScore >= 70) summaryLabel = "Moderate/Strong Match";
  else if (jobMatchScore >= 50) summaryLabel = "Moderate Match";
  else summaryLabel = "Needs Growth";

  return {
    jobMatchScore,
    totalWeightSum,
    skillBreakdown,
    strongSkills,
    lowGaps,
    mediumGaps,
    highGaps,
    summaryLabel
  };
}

/**
 * Generate Prerequisite-Aware Personalized Learning Roadmap
 */
export function generatePersonalizedRoadmap(student, targetJob) {
  const matchResult = calculateJobMatch(student, targetJob);
  const gaps = matchResult.skillBreakdown.filter(s => s.gap > 0);

  if (gaps.length === 0) {
    return {
      roadmap: [],
      topRecommendation: "You are fully qualified for this role! Focus on building advanced projects.",
      isComplete: true
    };
  }

  const gapMap = new Map();
  gaps.forEach(g => gapMap.set(g.skillId, g));

  const studentSkillMap = new Map();
  (student.skills || []).forEach(s => {
    studentSkillMap.set(s.skillId, getEffectiveProficiency(s));
  });

  const orderedSkills = [];
  const processed = new Set();

  function processSkill(skillId) {
    if (processed.has(skillId)) return;

    const prereqs = SKILL_DEPENDENCIES[skillId] || [];
    for (const prereqId of prereqs) {
      const studentProf = studentSkillMap.get(prereqId) || 0;
      if (studentProf < 2) {
        processSkill(prereqId);
      }
    }

    processed.add(skillId);

    const gapData = gapMap.get(skillId);
    const canonical = CANONICAL_SKILLS.find(c => c.id === skillId);
    const skillName = gapData ? gapData.skillName : (canonical ? canonical.name : skillId);
    const currentLevel = studentSkillMap.get(skillId) || 0;
    const targetLevel = gapData ? gapData.requiredProficiency : 3;
    const gapVal = gapData ? gapData.gap : Math.max(targetLevel - currentLevel, 1);
    const priority = gapData ? gapData.priorityScore : gapVal * 10;

    orderedSkills.push({
      skillId,
      skillName,
      currentLevel,
      targetLevel,
      gap: gapVal,
      priorityScore: priority,
      prerequisites: prereqs.map(p => {
        const pObj = CANONICAL_SKILLS.find(c => c.id === p);
        return pObj ? pObj.name : p;
      }),
      reason: gapData 
        ? `High priority gap (${gapVal} levels missing, weight: ${gapData.weight}).`
        : `Prerequisite dependency required before advanced topics.`
    });
  }

  const sortedGaps = [...gaps].sort((a, b) => b.priorityScore - a.priorityScore);

  sortedGaps.forEach(gapItem => {
    processSkill(gapItem.skillId);
  });

  const topSkill = orderedSkills[0];
  const topRecommendation = topSkill 
    ? `Learn ${topSkill.skillName} first to close your primary gap of ${topSkill.gap} proficiency levels.`
    : "Follow your custom roadmap below.";

  return {
    roadmap: orderedSkills,
    topRecommendation,
    isComplete: false
  };
}
