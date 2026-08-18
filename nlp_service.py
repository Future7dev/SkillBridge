"""
SkillBridge Python NLP Microservice v2.0
Powered by Python 3.12 — TF-IDF Vectorization, Cosine Similarity & NER Text Skill Extraction
Supports 50+ canonical skills across all major domains.
"""

import sys
import json
import math
import re
from http.server import HTTPServer, BaseHTTPRequestHandler

# ============================================================
# Master Canonical Skills Table (mirrors skillsData.js)
# ============================================================
CANONICAL_SKILLS = [
  # Languages
  {"id": "csharp", "name": "C#", "category": "Languages", "synonyms": ["c#", "csharp", "c sharp", ".net c#"]},
  {"id": "java", "name": "Java", "category": "Languages", "synonyms": ["java", "java ee", "j2ee", "spring java"]},
  {"id": "python", "name": "Python", "category": "Languages", "synonyms": ["python", "py", "python3", "python 3"]},
  {"id": "javascript", "name": "JavaScript", "category": "Languages", "synonyms": ["javascript", "js", "ecmascript", "es6", "vanilla js"]},
  {"id": "typescript", "name": "TypeScript", "category": "Languages", "synonyms": ["typescript", "ts"]},
  {"id": "cpp", "name": "C++", "category": "Languages", "synonyms": ["c++", "cpp", "c plus plus"]},
  {"id": "golang", "name": "Go / Golang", "category": "Languages", "synonyms": ["go", "golang", "go lang"]},
  {"id": "kotlin", "name": "Kotlin", "category": "Languages", "synonyms": ["kotlin"]},
  {"id": "swift", "name": "Swift", "category": "Languages", "synonyms": ["swift", "swift ui"]},
  {"id": "php", "name": "PHP", "category": "Languages", "synonyms": ["php", "php 8"]},
  {"id": "ruby", "name": "Ruby", "category": "Languages", "synonyms": ["ruby", "ruby on rails"]},
  {"id": "scala", "name": "Scala", "category": "Languages", "synonyms": ["scala"]},
  {"id": "r_lang", "name": "R", "category": "Languages", "synonyms": ["r language", "r programming", "rstudio"]},

  # Backend Frameworks
  {"id": "aspnet_core", "name": "ASP.NET Core", "category": "Backend Frameworks", "synonyms": ["asp.net core", "aspnet core", ".net core", "asp.net", "aspnet", "web api", ".net web api"]},
  {"id": "spring_boot", "name": "Spring Boot", "category": "Backend Frameworks", "synonyms": ["spring boot", "spring", "spring framework", "spring mvc"]},
  {"id": "node_js", "name": "Node.js", "category": "Backend Frameworks", "synonyms": ["node.js", "nodejs", "node js", "express.js", "expressjs", "express"]},
  {"id": "django", "name": "Django", "category": "Backend Frameworks", "synonyms": ["django", "django rest framework", "drf"]},
  {"id": "flask", "name": "Flask", "category": "Backend Frameworks", "synonyms": ["flask", "flask api"]},
  {"id": "fastapi", "name": "FastAPI", "category": "Backend Frameworks", "synonyms": ["fastapi", "fast api"]},
  {"id": "laravel", "name": "Laravel", "category": "Backend Frameworks", "synonyms": ["laravel"]},

  # Frontend Frameworks
  {"id": "react", "name": "React.js", "category": "Frontend Frameworks", "synonyms": ["react", "react.js", "reactjs", "react js"]},
  {"id": "angular", "name": "Angular", "category": "Frontend Frameworks", "synonyms": ["angular", "angularjs", "angular.js", "angular 2"]},
  {"id": "vue", "name": "Vue.js", "category": "Frontend Frameworks", "synonyms": ["vue", "vue.js", "vuejs", "vue js"]},
  {"id": "nextjs", "name": "Next.js", "category": "Frontend Frameworks", "synonyms": ["next.js", "nextjs", "next js"]},
  {"id": "html_css", "name": "HTML & CSS", "category": "Frontend Frameworks", "synonyms": ["html", "css", "html5", "css3", "bootstrap", "tailwind"]},

  # Databases
  {"id": "sql_server", "name": "SQL Server", "category": "Databases", "synonyms": ["sql server", "mssql", "microsoft sql server", "t-sql", "tsql"]},
  {"id": "mysql", "name": "MySQL", "category": "Databases", "synonyms": ["mysql", "my sql"]},
  {"id": "postgresql", "name": "PostgreSQL", "category": "Databases", "synonyms": ["postgresql", "postgres", "pg"]},
  {"id": "mongodb", "name": "MongoDB", "category": "Databases", "synonyms": ["mongodb", "mongo db", "mongo"]},
  {"id": "redis", "name": "Redis", "category": "Databases", "synonyms": ["redis"]},
  {"id": "sql", "name": "SQL", "category": "Databases", "synonyms": ["sql", "structured query language", "relational database", "rdbms"]},
  {"id": "firebase", "name": "Firebase", "category": "Databases", "synonyms": ["firebase", "firestore"]},

  # ORM
  {"id": "ef_core", "name": "Entity Framework", "category": "ORM / Data Access", "synonyms": ["entity framework", "ef core", "entity framework core", "efcore", "orm"]},
  {"id": "hibernate", "name": "Hibernate / JPA", "category": "ORM / Data Access", "synonyms": ["hibernate", "jpa", "java persistence api"]},

  # DevOps & Cloud
  {"id": "docker", "name": "Docker", "category": "DevOps & Cloud", "synonyms": ["docker", "containerization", "containers", "docker compose", "dockerfile"]},
  {"id": "kubernetes", "name": "Kubernetes", "category": "DevOps & Cloud", "synonyms": ["kubernetes", "k8s", "kubectl", "helm"]},
  {"id": "azure", "name": "Azure", "category": "DevOps & Cloud", "synonyms": ["azure", "ms azure", "microsoft azure", "azure devops", "app service", "azure functions"]},
  {"id": "aws", "name": "AWS", "category": "DevOps & Cloud", "synonyms": ["aws", "amazon web services", "ec2", "s3", "lambda", "ecs", "eks"]},
  {"id": "gcp", "name": "Google Cloud", "category": "DevOps & Cloud", "synonyms": ["gcp", "google cloud", "google cloud platform", "gke"]},
  {"id": "ci_cd", "name": "CI/CD", "category": "DevOps & Cloud", "synonyms": ["ci/cd", "cicd", "jenkins", "github actions", "gitlab ci", "azure pipelines"]},
  {"id": "terraform", "name": "Terraform / IaC", "category": "DevOps & Cloud", "synonyms": ["terraform", "iac", "infrastructure as code", "ansible"]},

  # Machine Learning & AI
  {"id": "spacy_nlp", "name": "NLP / spaCy", "category": "Machine Learning", "synonyms": ["spacy", "nlp", "natural language processing", "nltk", "text mining"]},
  {"id": "machine_learning", "name": "Machine Learning", "category": "Machine Learning", "synonyms": ["machine learning", "scikit-learn", "sklearn", "gradient boosting", "random forest", "xgboost"]},
  {"id": "deep_learning", "name": "Deep Learning", "category": "Machine Learning", "synonyms": ["deep learning", "neural network", "tensorflow", "pytorch", "keras"]},
  {"id": "data_science", "name": "Data Science", "category": "Machine Learning", "synonyms": ["data science", "data analysis", "pandas", "numpy", "jupyter", "data analyst"]},
  {"id": "llm", "name": "LLM / Generative AI", "category": "Machine Learning", "synonyms": ["llm", "gpt", "openai", "langchain", "generative ai", "prompt engineering"]},

  # Tools & Practices
  {"id": "git", "name": "Git & GitHub", "category": "Tools & Practices", "synonyms": ["git", "github", "version control", "gitlab", "bitbucket"]},
  {"id": "agile", "name": "Agile / Scrum", "category": "Tools & Practices", "synonyms": ["agile", "scrum", "kanban", "jira", "sprint"]},
  {"id": "rest_api", "name": "REST API / GraphQL", "category": "Tools & Practices", "synonyms": ["rest", "rest api", "restful", "graphql", "api design", "openapi", "swagger"]},
  {"id": "microservices", "name": "Microservices", "category": "Tools & Practices", "synonyms": ["microservices", "microservice", "service mesh", "api gateway"]},
  {"id": "linux", "name": "Linux / Shell", "category": "Tools & Practices", "synonyms": ["linux", "bash", "shell", "unix", "shell scripting"]},
  {"id": "testing", "name": "Testing / QA", "category": "Tools & Practices", "synonyms": ["unit testing", "integration testing", "jest", "pytest", "xunit", "selenium", "cypress", "tdd"]},
  {"id": "system_design", "name": "System Design", "category": "Tools & Practices", "synonyms": ["system design", "software architecture", "scalability", "distributed systems"]},
]

# Prerequisite Skill Dependency Graph
SKILL_PREREQUISITES = {
  "aspnet_core": ["csharp"],
  "ef_core": ["csharp", "aspnet_core"],
  "docker": ["linux"],
  "kubernetes": ["docker"],
  "azure": ["docker"],
  "aws": ["linux"],
  "spring_boot": ["java"],
  "hibernate": ["java"],
  "node_js": ["javascript"],
  "nextjs": ["react", "javascript"],
  "django": ["python"],
  "flask": ["python"],
  "fastapi": ["python"],
  "machine_learning": ["python"],
  "deep_learning": ["machine_learning"],
  "spacy_nlp": ["python"],
  "llm": ["python", "machine_learning"],
  "typescript": ["javascript"],
  "react": ["javascript"],
  "angular": ["typescript"],
  "vue": ["javascript"],
  "microservices": ["rest_api"],
  "ci_cd": ["git"],
}

STOP_WORDS = set([
  'a', 'about', 'after', 'all', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because',
  'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'down', 'each', 'few', 'for', 'from', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'him', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
  'just', 'me', 'more', 'most', 'my', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'our', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
  'with', 'you', 'your', 'using', 'built', 'experience', 'build', 'strong', 'knowledge',
  'understanding', 'looking', 'seeking', 'role', 'include', 'including', 'like', 'good',
  'great', 'years', 'ability', 'work', 'team', 'minimum', 'preferred'
])


def tokenize(text: str):
  """Clean and tokenize text into unigrams and bigrams."""
  if not text:
    return []
  text_clean = text.lower()
  # retain special chars for skill names: C#, .NET, C++
  tokens = re.findall(r'[a-zA-Z0-9#.+/]+', text_clean)
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
    tf_dict[token] /= total
  return tf_dict


def calculate_python_tfidf_similarity(doc1: str, doc2: str):
  """Python TF-IDF Vectorization & Cosine Similarity."""
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
  mag1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
  mag2 = math.sqrt(sum(v ** 2 for v in vec2.values()))

  if mag1 == 0 or mag2 == 0:
    return 0.0
  return round(dot_product / (mag1 * mag2) * 100, 2)


def extract_skills_ner(text: str):
  """Extract canonical skills from text via NER synonym matching."""
  if not text:
    return []

  lower_text = text.lower()
  extracted = []

  for skill in CANONICAL_SKILLS:
    for synonym in skill["synonyms"]:
      escaped = re.escape(synonym)
      # Match synonym with word/symbol boundaries
      pattern = r'(?:^|[\s,;:()\-/])' + escaped + r'(?:$|[\s,;:()\-/+])'
      if re.search(pattern, lower_text) or synonym in lower_text:
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
  Pure Text Extraction Roadmap Pipeline.
  Analyzes Job Description and Student Resume text via NLP NER.
  """
  tfidf_score = calculate_python_tfidf_similarity(resume_text, job_description)
  resume_skills = extract_skills_ner(resume_text)
  job_skills = extract_skills_ner(job_description)

  resume_skill_ids = set(s["skillId"] for s in resume_skills)
  missing_skills = [s for s in job_skills if s["skillId"] not in resume_skill_ids]

  roadmap = []
  processed = set()

  for item in missing_skills:
    s_id = item["skillId"]
    if s_id in processed:
      continue

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
            "reason": f"Prerequisite required before mastering {item['skillName']}"
          })
          processed.add(p_id)

    roadmap.append({
      "skillId": s_id,
      "skillName": item["skillName"],
      "category": item["category"],
      "gap": 3,
      "extractedFromJdText": True,
      "type": "Extracted JD Text Skill Gap",
      "reason": f"Extracted from Job Description text — matched keyword '{item['matchedTerm']}'"
    })
    processed.add(s_id)

  return {
    "engine": "Python 3.12 NLP Engine v2.0",
    "tfidfMatchScorePct": tfidf_score,
    "resumeSkillsDetected": resume_skills,
    "jobRequirementsDetected": job_skills,
    "missingSkillGaps": missing_skills,
    "curatedRoadmap": roadmap
  }


class NLPRequestHandler(BaseHTTPRequestHandler):
  def log_message(self, format, *args):
    pass  # Suppress default request logs

  def do_OPTIONS(self):
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    self.end_headers()

  def do_GET(self):
    self.send_response(200)
    self.send_header('Content-Type', 'application/json')
    self.send_header('Access-Control-Allow-Origin', '*')
    self.end_headers()
    self.wfile.write(json.dumps({
      "status": "ok",
      "engine": "Python 3.12 NLP Microservice v2.0",
      "skills": len(CANONICAL_SKILLS)
    }).encode('utf-8'))

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
    print(f"SkillBridge Python NLP Server v2.0 running on http://localhost:{port}...")
    print(f"  Canonical skills loaded: {len(CANONICAL_SKILLS)}")
    try:
      server.serve_forever()
    except KeyboardInterrupt:
      print("Stopping Python NLP Server.")
