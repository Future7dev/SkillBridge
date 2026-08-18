import { SKILL_DEPENDENCIES, CANONICAL_SKILLS } from '../data/skillsData';
import { extractSkillsFromText, calculateTfidfCosineSimilarity } from './nlpEngine';

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

  const rawSkills = job.skillsRequired || job.jobSkills || [];
  const textSkills = extractSkillsFromText(job.description || '');
  const existingSkillIds = new Set(rawSkills.map(s => s.skillId || s.skill?.canonicalCode));

  const mergedSkills = [...rawSkills];
  textSkills.forEach(ts => {
    if (!existingSkillIds.has(ts.skillId)) {
      mergedSkills.push({
        skillId: ts.skillId,
        skillName: ts.skillName,
        requiredProficiency: ts.detectedProficiency || 3,
        weight: 15,
        importance: 'Required'
      });
      existingSkillIds.add(ts.skillId);
    }
  });

  const skillsRequired = mergedSkills.length > 0 ? mergedSkills.map(sk => ({
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
    if (gap === 0) gapCategory = 'Strong Match';
    else if (gap === 1) gapCategory = 'Low Gap';
    else if (gap === 2) gapCategory = 'Medium Gap';
    else gapCategory = 'High Gap';

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
 * Generate Personalized Learning Roadmap STRICTLY based on NLP text extraction from Job Description and Student Resume Text
 */
export function generatePersonalizedRoadmap(student, targetJob) {
  const resumeText = student?.resumeText || `${student?.name || ''} ${student?.degree || ''} ${student?.university || ''}`;
  const jobDesc = targetJob?.description || `${targetJob?.title || ''} ${targetJob?.company || ''}`;

  // 1. Extract skills from Job Description text using NLP NER
  const extractedJdSkills = extractSkillsFromText(jobDesc);
  
  // 2. Extract skills from Student Resume text using NLP NER
  const extractedResumeSkills = extractSkillsFromText(resumeText);
  const resumeSkillSet = new Set(extractedResumeSkills.map(s => s.skillId));

  // 3. Skill Gaps = Extracted JD text skills NOT present in Extracted Resume text skills
  const missingGaps = extractedJdSkills.filter(sk => !resumeSkillSet.has(sk.skillId));

  // Compute TF-IDF Cosine Similarity score
  const tfidfScore = calculateTfidfCosineSimilarity(resumeText, jobDesc);

  if (missingGaps.length === 0) {
    return {
      roadmap: [],
      topRecommendation: "NLP text analysis shows your resume covers all skills extracted from this job description!",
      isComplete: true,
      tfidfScore,
      extractedJdSkills,
      extractedResumeSkills
    };
  }

  // 4. Prerequisite-aware Topological Graph Sorting
  const orderedSkills = [];
  const processed = new Set();

  function processSkill(skillId, skillName) {
    if (processed.has(skillId)) return;

    const prereqs = SKILL_DEPENDENCIES[skillId] || [];
    for (const prereqId of prereqs) {
      if (!resumeSkillSet.has(prereqId) && !processed.has(prereqId)) {
        const pObj = CANONICAL_SKILLS.find(c => c.id === prereqId);
        if (pObj) {
          processSkill(prereqId, pObj.name);
        }
      }
    }

    processed.add(skillId);

    const canonical = CANONICAL_SKILLS.find(c => c.id === skillId);
    const finalName = skillName || (canonical ? canonical.name : skillId);

    orderedSkills.push({
      skillId,
      skillName: finalName,
      extractedFromDesc: true,
      currentLevel: resumeSkillSet.has(skillId) ? 2 : 0,
      targetLevel: 4,
      gap: resumeSkillSet.has(skillId) ? 2 : 3,
      prerequisites: prereqs.map(p => {
        const pObj = CANONICAL_SKILLS.find(c => c.id === p);
        return pObj ? pObj.name : p;
      }),
      reason: `NLP Text Extraction: "${finalName}" was identified in the Job Description text as a core requirement not found in student's resume text.`
    });
  }

  missingGaps.forEach(g => {
    processSkill(g.skillId, g.skillName);
  });

  const topSkill = orderedSkills[0];
  const topRecommendation = topSkill 
    ? `NLP Text Extraction recommends learning ${topSkill.skillName} first based on text analysis of ${targetJob?.title || targetJob?.jobTitle}.`
    : "Follow your custom text-extracted roadmap below.";

  return {
    roadmap: orderedSkills,
    topRecommendation,
    isComplete: false,
    tfidfScore,
    extractedJdSkills,
    extractedResumeSkills
  };
}
