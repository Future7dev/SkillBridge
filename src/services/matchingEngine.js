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
 * Normalize a job object — handles both frontend (id, title, company) and DB (jobId, jobTitle, companyName) shapes
 */
function normalizeJob(job) {
  if (!job) return null;
  return {
    ...job,
    id: job.id || job.jobId || '',
    title: job.title || job.jobTitle || '',
    company: job.company || job.companyName || '',
    description: job.description || job.jobDescription || '',
    skillsRequired: job.skillsRequired || job.jobSkills || []
  };
}

/**
 * Calculate complete match metrics between a student and a job requirement
 */
export function calculateJobMatch(student, rawJob) {
  const job = normalizeJob(rawJob);
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

  // Merge structured skill requirements + NLP-extracted from JD text
  const rawSkills = job.skillsRequired || [];
  const textSkills = extractSkillsFromText(job.description || '');
  const existingSkillIds = new Set(rawSkills.map(s => s.skillId || s.skill?.canonicalCode));

  const mergedSkills = [...rawSkills];
  textSkills.forEach(ts => {
    if (!existingSkillIds.has(ts.skillId)) {
      mergedSkills.push({
        skillId: ts.skillId,
        skillName: ts.skillName,
        requiredProficiency: ts.detectedProficiency || 3,
        weight: 12,
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
    { skillId: 'sql', skillName: 'SQL', requiredProficiency: 3, weight: 20, importance: 'Required' }
  ];

  let totalWeightedMatch = 0;
  let totalWeightSum = 0;
  const skillBreakdown = [], strongSkills = [], lowGaps = [], mediumGaps = [], highGaps = [];

  const studentSkillMap = new Map();
  (student.skills || []).forEach(s => studentSkillMap.set(s.skillId, s));

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

  let summaryLabel = "Needs Growth";
  if (jobMatchScore >= 85) summaryLabel = "Excellent Match";
  else if (jobMatchScore >= 70) summaryLabel = "Strong Match";
  else if (jobMatchScore >= 50) summaryLabel = "Moderate Match";

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
 * Generate Personalized Learning Roadmap STRICTLY based on:
 * 1. NLP text extraction from Job Description (what job requires)
 * 2. NLP text extraction from Student Resume Text (what student has)
 * 
 * Gap = Skills extracted from JD text - Skills extracted from Resume text
 */
export function generatePersonalizedRoadmap(student, rawJob) {
  const job = normalizeJob(rawJob);

  // Use actual resume text for NLP; fall back to skill names if no resume provided
  let resumeText = student?.resumeText || '';
  if (!resumeText || resumeText.trim().length < 20) {
    // Build synthetic resume text from skills list as fallback
    resumeText = (student?.skills || [])
      .filter(s => (s.selfAssessment || 0) > 0)
      .map(s => {
        const canonical = CANONICAL_SKILLS.find(c => c.id === s.skillId);
        return canonical ? `${canonical.name} ${canonical.synonyms.join(' ')}` : s.skillId;
      })
      .join(' ');
  }

  const jobDesc = job?.description || `${job?.title || ''} ${job?.company || ''}`;

  if (!jobDesc || jobDesc.trim().length < 10) {
    return {
      roadmap: [],
      topRecommendation: "Please select a job with a description to generate your roadmap.",
      isComplete: false,
      tfidfScore: 0,
      extractedJdSkills: [],
      extractedResumeSkills: []
    };
  }

  // 1. Extract skills from Job Description text using NLP NER
  const extractedJdSkills = extractSkillsFromText(jobDesc);

  // 2. Extract skills from Student Resume text using NLP NER
  const extractedResumeSkills = extractSkillsFromText(resumeText);
  const resumeSkillSet = new Set(extractedResumeSkills.map(s => s.skillId));

  // Also add skills from structured student.skills array (explicitly added skills)
  (student?.skills || []).forEach(s => {
    if ((s.selfAssessment || 0) >= 2) {
      resumeSkillSet.add(s.skillId);
    }
  });

  // 3. Skill Gaps = Extracted JD text skills NOT present in Resume/Profile skills
  const missingGaps = extractedJdSkills.filter(sk => !resumeSkillSet.has(sk.skillId));

  // Compute TF-IDF Cosine Similarity score
  const tfidfScore = calculateTfidfCosineSimilarity(resumeText, jobDesc);

  if (missingGaps.length === 0 && extractedJdSkills.length > 0) {
    return {
      roadmap: [],
      topRecommendation: `🎉 NLP analysis shows your profile already covers all ${extractedJdSkills.length} skills extracted from this job description! You're a strong match for ${job?.title || 'this role'}.`,
      isComplete: true,
      tfidfScore,
      extractedJdSkills,
      extractedResumeSkills
    };
  }

  if (extractedJdSkills.length === 0) {
    return {
      roadmap: [],
      topRecommendation: "Could not extract specific skills from the job description. Try selecting a job with a detailed description.",
      isComplete: false,
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
    const prereqNames = (prereqs || [])
      .map(p => {
        const pObj = CANONICAL_SKILLS.find(c => c.id === p);
        return pObj ? pObj.name : p;
      })
      .filter(Boolean);

    orderedSkills.push({
      skillId,
      skillName: finalName,
      category: canonical?.category || 'General',
      extractedFromDesc: true,
      currentLevel: resumeSkillSet.has(skillId) ? 2 : 0,
      targetLevel: 4,
      gap: resumeSkillSet.has(skillId) ? 2 : 3,
      prerequisites: prereqNames,
      reason: `Extracted from Job Description text: "${finalName}" is required for ${job?.title || 'this role'} but not found in your resume.`
    });
  }

  missingGaps.forEach(g => {
    processSkill(g.skillId, g.skillName);
  });

  const topSkill = orderedSkills[0];
  const topRecommendation = topSkill
    ? `Start with ${topSkill.skillName} — NLP extracted ${missingGaps.length} missing skill${missingGaps.length > 1 ? 's' : ''} from the ${job?.title || 'job'} description. Your resume matched ${extractedResumeSkills.length} of ${extractedJdSkills.length} required skills.`
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
