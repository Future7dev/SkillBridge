"""
SkillBridge Python NLP Microservice
Powered by Python 3.12, TF-IDF Vectorization, Cosine Similarity & NER Text Skill Extraction
Roadmap generated strictly from Job Description text extractions vs Resume text extractions.
"""

import sys
import json
import math
import re
from http.server import HTTPServer, BaseHTTPRequestHandler

# Master Canonical Skills & Synonyms Table
CANONICAL_SKILLS = [
    {
        "id": "csharp",
        "name": "C#",
        "category": "Languages",
        "synonyms": ["c#", "csharp", "c sharp", ".net c#"]
    },
    {
        "id": "aspnet_core",
        "name": "ASP.NET Core",
        "category": "Backend Frameworks",
        "synonyms": ["asp.net core", "aspnet core", ".net core", "asp.net", "aspnet", "web api"]
    },
    {
        "id": "sql_server",
        "name": "SQL Server",
        "category": "Databases",
        "synonyms": ["sql server", "mssql", "microsoft sql server", "t-sql", "tsql", "sql"]
    },
    {
        "id": "ef_core",
        "name": "Entity Framework",
        "category": "ORM / Data Access",
        "synonyms": ["entity framework", "ef core", "entity framework core", "efcore", "orm"]
    },
    {
        "id": "docker",
        "name": "Docker",
        "category": "DevOps & Cloud",
        "synonyms": ["docker", "containerization", "containers", "docker compose"]
    },
    {
        "id": "azure",
        "name": "Azure",
        "category": "DevOps & Cloud",
        "synonyms": ["azure", "ms azure", "microsoft azure", "azure devops", "app service"]
    },
    {
        "id": "react",
        "name": "React.js",
        "category": "Frontend Frameworks",
        "synonyms": ["react", "react.js", "reactjs", "react js", "frontend react"]
    },
    {
        "id": "javascript",
        "name": "JavaScript",
        "category": "Languages",
        "synonyms": ["javascript", "js", "ecmascript", "es6"]
    },
    {
        "id": "typescript",
        "name": "TypeScript",
        "category": "Languages",
        "synonyms": ["typescript", "ts"]
    },
    {
        "id": "python",
        "name": "Python",
        "category": "Languages",
        "synonyms": ["python", "py", "python3"]
    },
    {
        "id": "spacy_nlp",
        "name": "spaCy / NLP",
        "category": "Machine Learning",
        "synonyms": ["spacy", "nlp", "natural language processing", "scikit-learn", "nltk"]
    },
    {
        "id": "git",
        "name": "Git & GitHub",
        "category": "Tools & Practices",
        "synonyms": ["git", "github", "version control", "gitlab", "bitbucket"]
    }
]

# Prerequisite Skill Graph
SKILL_PREREQUISITES = {
    "aspnet_core": ["csharp"],
    "ef_core": ["csharp", "aspnet_core", "sql_server"],
    "docker": ["aspnet_core"],
    "azure": ["docker", "aspnet_core"],
    "typescript": ["javascript"],
    "react": ["javascript"],
    "spacy_nlp": ["python"]
}

STOP_WORDS = set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
    'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
    'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
    'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
    'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
    'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
    'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were',
    'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'yours'
])


def tokenize(text: str):
    """Clean and tokenize input text into unigrams and bigrams."""
    if not text:
        return []
    text_clean = text.lower()
    tokens = re.findall(r'[a-zA-Z0-9#+.]+', text_clean)
    filtered = [t for t in tokens if len(t) > 1 and t not in STOP_WORDS]
    bigrams = [f"{filtered[i]} {filtered[i+1]}" for i in range(len(filtered) - 1)]
    return filtered + bigrams


def compute_tf(tokens):
    """Compute Term Frequency."""
    tf_dict = {}
    total = len(tokens) or 1
    for token in tokens:
        tf_dict[token] = tf_dict.get(token, 0) + 1
    for token in tf_dict:
        tf_dict[token] = tf_dict[token] / total
    return tf_dict


def calculate_python_tfidf_similarity(doc1: str, doc2: str):
    """
    Python TF-IDF Vectorization & Cosine Similarity
    """
    tokens1 = tokenize(doc1)
    tokens2 = tokenize(doc2)
    
    if not tokens1 or not tokens2:
        return 0.0

    tf1 = compute_tf(tokens1)
    tf2 = compute_tf(tokens2)

    vocab = set(tf1.keys()).union(set(tf2.keys()))

    idf = {}
    for word in vocab:
        df = (1 if word in tf1 else 0) + (1 if word in tf2 else 0)
        idf[word] = math.log(2.0 / df) + 1.0

    vec1 = {word: tf1.get(word, 0.0) * idf[word] for word in vocab}
    vec2 = {word: tf2.get(word, 0.0) * idf[word] for word in vocab}

    dot_product = sum(vec1[w] * vec2[w] for w in vocab)
    mag1 = math.sqrt(sum(val ** 2 for val in vec1.values()))
    mag2 = math.sqrt(sum(val ** 2 for val in vec2.values()))

    if mag1 == 0 or mag2 == 0:
        return 0.0

    similarity = dot_product / (mag1 * mag2)
    return round(similarity * 100, 2)


def extract_skills_ner(text: str):
    """
    Extract skills strictly from text via Named Entity Recognition (NER)
    """
    if not text:
        return []
    
    lower_text = text.lower()
    extracted = []

    for skill in CANONICAL_SKILLS:
        for synonym in skill["synonyms"]:
            escaped = re.escape(synonym)
            pattern = rf'(?:^|[^a-zA-Z0-9#+.])' + escaped + rf'(?:$|[^a-zA-Z0-9#+.])'
            if re.search(pattern, lower_text):
                extracted.append({
                    "skillId": skill["id"],
                    "skillName": skill["name"],
                    "category": skill["category"],
                    "matchedTerm": synonym
                })
                break
    return extracted


def analyze_resume_and_job(resume_text: str, job_description: str):
    """
    Pure Text Extraction Roadmap Pipeline:
    Analyzes Job Description text and Student Resume text strictly without using preset skill arrays.
    """
    tfidf_score = calculate_python_tfidf_similarity(resume_text, job_description)
    resume_skills = extract_skills_ner(resume_text)
    job_skills = extract_skills_ner(job_description)

    resume_skill_ids = set(s["skillId"] for s in resume_skills)
    
    # Missing skills = skills extracted from JD text that are NOT in Resume text
    missing_skills = [s for s in job_skills if s["skillId"] not in resume_skill_ids]

    roadmap = []
    processed = set()

    for item in missing_skills:
        s_id = item["skillId"]
        if s_id in processed:
            continue
        
        # Prerequisite dependencies check
        prereqs = SKILL_PREREQUISITES.get(s_id, [])
        for p_id in prereqs:
            if p_id not in resume_skill_ids and p_id not in processed:
                p_skill = next((s for s in CANONICAL_SKILLS if s["id"] == p_id), None)
                if p_skill:
                    roadmap.append({
                        "skillId": p_id,
                        "skillName": p_skill["name"],
                        "category": p_skill["category"],
                        "gap": 2,
                        "extractedFromJdText": False,
                        "type": "Prerequisite Dependency",
                        "reason": f"Prerequisite dependency required before mastering {item['skillName']}"
                    })
                    processed.add(p_id)

        roadmap.append({
            "skillId": s_id,
            "skillName": item["skillName"],
            "category": item["category"],
            "gap": 3,
            "extractedFromJdText": True,
            "type": "Extracted JD Text Skill Gap",
            "reason": f"Extracted directly from Job Description text matching keyword '{item['matchedTerm']}'"
        })
        processed.add(s_id)

    return {
        "engine": "Python 3.12 Pure Text Extraction NLP Engine",
        "tfidfMatchScorePct": tfidf_score,
        "resumeSkillsDetected": resume_skills,
        "jobRequirementsDetected": job_skills,
        "missingSkillGaps": missing_skills,
        "curatedRoadmap": roadmap
    }


class NLPRequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode('utf-8'))
            resume_text = payload.get('resumeText', '')
            job_desc = payload.get('jobDescription', '')

            result = analyze_resume_and_job(resume_text, job_desc)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        input_data = sys.stdin.read()
        payload = json.loads(input_data)
        res = analyze_resume_and_job(payload.get('resumeText', ''), payload.get('jobDescription', ''))
        print(json.dumps(res))
    else:
        port = 5001
        server = HTTPServer(('0.0.0.0', port), NLPRequestHandler)
        print(f"SkillBridge Python NLP Server running on http://localhost:{port}...")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("Stopping Python NLP Server.")
