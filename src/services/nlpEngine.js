import { CANONICAL_SKILLS } from '../data/skillsData';

// Common English stop words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d',
  'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'with', 'using', 'built', 'experience'
]);

/**
 * Clean & Tokenize text
 */
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s#.+]/g, ' ') // retain # and . for C#, .NET
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Compute Term Frequency (TF)
 */
export function getTermFrequency(tokens) {
  const tf = {};
  const total = tokens.length || 1;
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  for (const token in tf) {
    tf[token] = tf[token] / total;
  }
  return tf;
}

/**
 * Calculate TF-IDF + Cosine Similarity between document A (e.g. Resume) and document B (e.g. Job Description)
 */
export function calculateTfidfCosineSimilarity(docA, docB) {
  const tokensA = tokenize(docA);
  const tokensB = tokenize(docB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const tfA = getTermFrequency(tokensA);
  const tfB = getTermFrequency(tokensB);

  // Combine unique terms across both documents
  const vocabulary = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);

  // IDF: inverse document frequency across corpus of 2 documents
  const idf = {};
  for (const term of vocabulary) {
    let docCount = 0;
    if (tfA[term]) docCount++;
    if (tfB[term]) docCount++;
    idf[term] = Math.log(2 / (docCount || 1)) + 1; // standard smoothed idf
  }

  // Build TF-IDF vectors
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const term of vocabulary) {
    const vectorA = (tfA[term] || 0) * idf[term];
    const vectorB = (tfB[term] || 0) * idf[term];

    dotProduct += vectorA * vectorB;
    normA += vectorA * vectorA;
    normB += vectorB * vectorB;
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  const cosineSim = dotProduct / (normA * normB);
  return Math.round(cosineSim * 100);
}

/**
 * Named Entity Recognition (NER) & Skill Normalization against Canonical SKILLS table
 */
export function extractSkillsFromText(text) {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const extractedSkills = [];

  for (const skill of CANONICAL_SKILLS) {
    // Check canonical name & synonyms
    let found = false;
    let matchedTerm = '';

    for (const synonym of skill.synonyms) {
      // Word boundary regex check
      const escaped = synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+.])${escaped}(?:$|[^a-zA-Z0-9#+.])`, 'i');

      if (regex.test(lowerText)) {
        found = true;
        matchedTerm = synonym;
        break;
      }
    }

    if (found) {
      // Estimate proficiency based on contextual keywords near the skill
      let estimatedProficiency = 2; // Default basic
      if (lowerText.includes(`expert in ${matchedTerm}`) || lowerText.includes(`advanced ${matchedTerm}`)) {
        estimatedProficiency = 4;
      } else if (lowerText.includes(`proficient in ${matchedTerm}`) || lowerText.includes(`built`) || lowerText.includes(`experienced`)) {
        estimatedProficiency = 3;
      } else if (lowerText.includes(`basic`) || lowerText.includes(`beginner`)) {
        estimatedProficiency = 1;
      }

      extractedSkills.push({
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        matchedTerm: matchedTerm,
        detectedProficiency: estimatedProficiency
      });
    }
  }

  return extractedSkills;
}

/**
 * Evaluate Skill Extraction Performance (Precision, Recall, F1-Score)
 */
export function evaluateExtractionMetrics(groundTruthSkills, extractedSkills) {
  const truthSet = new Set(groundTruthSkills.map(s => s.toLowerCase()));
  const extractedSet = new Set(extractedSkills.map(s => s.toLowerCase()));

  let truePositives = 0;
  for (const item of extractedSet) {
    if (truthSet.has(item)) truePositives++;
  }

  const falsePositives = extractedSet.size - truePositives;
  const falseNegatives = truthSet.size - truePositives;

  const precision = extractedSet.size > 0 ? truePositives / extractedSet.size : 0;
  const recall = truthSet.size > 0 ? truePositives / truthSet.size : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    precision: (precision * 100).toFixed(1),
    recall: (recall * 100).toFixed(1),
    f1Score: (f1 * 100).toFixed(1),
    truePositives,
    falsePositives,
    falseNegatives
  };
}
