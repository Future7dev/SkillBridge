import { CANONICAL_SKILLS } from '../data/skillsData';

// Common English stop words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't", 'cannot',
  'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd",
  "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i',
  "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's",
  'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll",
  "she's", 'should', "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've",
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd",
  "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which',
  'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd",
  "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves',
  // domain stop words
  'using', 'built', 'experience', 'build', 'strong', 'knowledge', 'understanding', 'hands', 'looking',
  'seeking', 'role', 'requirements', 'qualifications', 'preferred', 'years', 'ability', 'work',
  'team', 'include', 'including', 'like', 'good', 'great', 'excellent', 'plus', 'minimum'
]);

/**
 * Clean & Tokenize text into unigrams and bigrams
 */
export function tokenize(text) {
  if (!text) return [];
  const clean = text.toLowerCase().replace(/[^\w\s#.+/]/g, ' ');
  const tokens = clean.split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return [...tokens, ...bigrams];
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
 * Calculate TF-IDF + Cosine Similarity between two documents
 */
export function calculateTfidfCosineSimilarity(docA, docB) {
  if (!docA || !docB) return 0;
  const tokensA = tokenize(docA);
  const tokensB = tokenize(docB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const tfA = getTermFrequency(tokensA);
  const tfB = getTermFrequency(tokensB);

  const vocabulary = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);

  const idf = {};
  for (const term of vocabulary) {
    let docCount = 0;
    if (tfA[term]) docCount++;
    if (tfB[term]) docCount++;
    idf[term] = Math.log(2 / (docCount || 1)) + 1;
  }

  let dotProduct = 0, normA = 0, normB = 0;
  for (const term of vocabulary) {
    const va = (tfA[term] || 0) * idf[term];
    const vb = (tfB[term] || 0) * idf[term];
    dotProduct += va * vb;
    normA += va * va;
    normB += vb * vb;
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  if (normA === 0 || normB === 0) return 0;

  return Math.round((dotProduct / (normA * normB)) * 100);
}

/**
 * Named Entity Recognition (NER) — Extracts canonical skills from raw text
 * Uses multi-strategy matching: exact phrase, word boundary, and proximity detection
 */
export function extractSkillsFromText(text) {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const extractedSkills = [];

  for (const skill of CANONICAL_SKILLS) {
    let found = false;
    let matchedTerm = '';

    for (const synonym of skill.synonyms) {
      // Escape special regex chars
      const escaped = synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Word boundary match — works for most single and compound terms
      const regex = new RegExp(`(?:^|[\\s,;:()/\\-])${escaped}(?:$|[\\s,;:()/\\-+])`, 'i');
      
      if (regex.test(lowerText) || lowerText.includes(synonym)) {
        found = true;
        matchedTerm = synonym;
        break;
      }
    }

    if (found) {
      // Estimate proficiency from context keywords
      let estimatedProficiency = 2;
      const context = lowerText;
      if (context.includes(`expert in ${matchedTerm}`) || context.includes(`advanced ${matchedTerm}`) || context.includes('expert-level')) {
        estimatedProficiency = 4;
      } else if (context.includes(`proficient in ${matchedTerm}`) || context.includes('proficient') || context.includes('strong proficiency')) {
        estimatedProficiency = 3;
      } else if (context.includes(`basic`) || context.includes(`beginner`) || context.includes('exposure')) {
        estimatedProficiency = 1;
      }

      extractedSkills.push({
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        matchedTerm,
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

  const precision = extractedSet.size > 0 ? truePositives / extractedSet.size : 0;
  const recall = truthSet.size > 0 ? truePositives / truthSet.size : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    precision: (precision * 100).toFixed(1),
    recall: (recall * 100).toFixed(1),
    f1Score: (f1 * 100).toFixed(1),
    truePositives,
    falsePositives: extractedSet.size - truePositives,
    falseNegatives: truthSet.size - truePositives
  };
}
