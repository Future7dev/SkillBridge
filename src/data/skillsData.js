// Master Canonical SKILLS Table with synonym mappings — Expanded to 50+ skills
export const CANONICAL_SKILLS = [
  // --- Programming Languages ---
  { id: "csharp", name: "C#", category: "Languages", description: "Modern, object-oriented language by Microsoft.", synonyms: ["c#", "csharp", "c sharp", ".net c#"] },
  { id: "java", name: "Java", category: "Languages", description: "Cross-platform OOP language widely used in enterprise.", synonyms: ["java", "java ee", "j2ee", "spring java"] },
  { id: "python", name: "Python", category: "Languages", description: "High-level language for ML, Web, and Automation.", synonyms: ["python", "py", "python3", "python 3"] },
  { id: "javascript", name: "JavaScript", category: "Languages", description: "Core programming language of the Web.", synonyms: ["javascript", "js", "ecmascript", "es6", "vanilla js", "vanilla javascript"] },
  { id: "typescript", name: "TypeScript", category: "Languages", description: "Strongly typed superset of JavaScript.", synonyms: ["typescript", "ts"] },
  { id: "cpp", name: "C++", category: "Languages", description: "High-performance systems programming language.", synonyms: ["c++", "cpp", "c plus plus"] },
  { id: "golang", name: "Go / Golang", category: "Languages", description: "Fast, statically-typed language by Google.", synonyms: ["go", "golang", "go lang"] },
  { id: "rust", name: "Rust", category: "Languages", description: "Systems language focused on safety and performance.", synonyms: ["rust", "rust lang"] },
  { id: "kotlin", name: "Kotlin", category: "Languages", description: "Modern language for JVM and Android.", synonyms: ["kotlin"] },
  { id: "swift", name: "Swift", category: "Languages", description: "Apple's language for iOS and macOS development.", synonyms: ["swift", "swift ui"] },
  { id: "php", name: "PHP", category: "Languages", description: "Server-side scripting language for the web.", synonyms: ["php", "php 8"] },
  { id: "ruby", name: "Ruby", category: "Languages", description: "Dynamic, OOP scripting language.", synonyms: ["ruby", "ruby on rails"] },
  { id: "scala", name: "Scala", category: "Languages", description: "Functional and OOP language on the JVM.", synonyms: ["scala"] },
  { id: "r_lang", name: "R", category: "Languages", description: "Statistical computing and data analysis language.", synonyms: ["r language", "r programming", "rstudio"] },

  // --- Backend Frameworks ---
  { id: "aspnet_core", name: "ASP.NET Core", category: "Backend Frameworks", description: "Cross-platform web framework by Microsoft.", synonyms: ["asp.net core", "aspnet core", ".net core", "asp.net", "aspnet", "web api", ".net web api"] },
  { id: "spring_boot", name: "Spring Boot", category: "Backend Frameworks", description: "Java-based framework for microservices.", synonyms: ["spring boot", "spring", "spring framework", "spring mvc"] },
  { id: "node_js", name: "Node.js", category: "Backend Frameworks", description: "JavaScript runtime built on Chrome's V8 engine.", synonyms: ["node.js", "nodejs", "node js", "express.js", "expressjs", "express"] },
  { id: "django", name: "Django", category: "Backend Frameworks", description: "High-level Python web framework.", synonyms: ["django", "django rest framework", "drf"] },
  { id: "flask", name: "Flask", category: "Backend Frameworks", description: "Lightweight Python web framework.", synonyms: ["flask", "flask api"] },
  { id: "fastapi", name: "FastAPI", category: "Backend Frameworks", description: "Modern, fast Python web framework for APIs.", synonyms: ["fastapi", "fast api"] },
  { id: "laravel", name: "Laravel", category: "Backend Frameworks", description: "PHP framework for web artisans.", synonyms: ["laravel"] },
  { id: "rails", name: "Ruby on Rails", category: "Backend Frameworks", description: "Full-stack web application framework.", synonyms: ["ruby on rails", "rails"] },

  // --- Frontend Frameworks ---
  { id: "react", name: "React.js", category: "Frontend Frameworks", description: "Declarative, component-based UI library.", synonyms: ["react", "react.js", "reactjs", "react js"] },
  { id: "angular", name: "Angular", category: "Frontend Frameworks", description: "TypeScript-based web application framework by Google.", synonyms: ["angular", "angularjs", "angular.js", "angular 2+"] },
  { id: "vue", name: "Vue.js", category: "Frontend Frameworks", description: "Progressive JavaScript framework for building UIs.", synonyms: ["vue", "vue.js", "vuejs", "vue js"] },
  { id: "nextjs", name: "Next.js", category: "Frontend Frameworks", description: "React framework with SSR and SSG.", synonyms: ["next.js", "nextjs", "next js"] },
  { id: "html_css", name: "HTML & CSS", category: "Frontend Frameworks", description: "Markup and styling languages for the web.", synonyms: ["html", "css", "html5", "css3", "html/css", "bootstrap", "tailwind"] },

  // --- Databases ---
  { id: "sql_server", name: "SQL Server", category: "Databases", description: "Relational database management system by Microsoft.", synonyms: ["sql server", "mssql", "microsoft sql server", "t-sql", "tsql"] },
  { id: "mysql", name: "MySQL", category: "Databases", description: "Open-source relational database.", synonyms: ["mysql", "my sql"] },
  { id: "postgresql", name: "PostgreSQL", category: "Databases", description: "Open-source advanced relational database.", synonyms: ["postgresql", "postgres", "pg"] },
  { id: "mongodb", name: "MongoDB", category: "Databases", description: "NoSQL document-based database.", synonyms: ["mongodb", "mongo db", "mongo"] },
  { id: "redis", name: "Redis", category: "Databases", description: "In-memory data structure store.", synonyms: ["redis"] },
  { id: "sql", name: "SQL", category: "Databases", description: "Structured Query Language for relational databases.", synonyms: ["sql", "structured query language", "relational database", "rdbms"] },
  { id: "firebase", name: "Firebase", category: "Databases", description: "Google's app development platform with Firestore.", synonyms: ["firebase", "firestore", "firebase realtime database"] },

  // --- ORM / Data Access ---
  { id: "ef_core", name: "Entity Framework", category: "ORM / Data Access", description: "ORM for .NET applications.", synonyms: ["entity framework", "ef core", "entity framework core", "efcore", "orm"] },
  { id: "hibernate", name: "Hibernate / JPA", category: "ORM / Data Access", description: "ORM for Java applications.", synonyms: ["hibernate", "jpa", "java persistence api"] },
  { id: "sequelize", name: "Sequelize / Prisma", category: "ORM / Data Access", description: "ORM for Node.js.", synonyms: ["sequelize", "prisma", "typeorm"] },

  // --- DevOps & Cloud ---
  { id: "docker", name: "Docker", category: "DevOps & Cloud", description: "Platform for containerized applications.", synonyms: ["docker", "containerization", "containers", "docker compose", "dockerfile"] },
  { id: "kubernetes", name: "Kubernetes", category: "DevOps & Cloud", description: "Container orchestration system.", synonyms: ["kubernetes", "k8s", "kubectl", "helm"] },
  { id: "azure", name: "Azure", category: "DevOps & Cloud", description: "Microsoft's public cloud computing platform.", synonyms: ["azure", "ms azure", "microsoft azure", "azure devops", "app service", "azure functions"] },
  { id: "aws", name: "AWS", category: "DevOps & Cloud", description: "Amazon Web Services cloud platform.", synonyms: ["aws", "amazon web services", "ec2", "s3", "lambda", "ecs", "eks", "cloudwatch"] },
  { id: "gcp", name: "Google Cloud", category: "DevOps & Cloud", description: "Google's cloud computing platform.", synonyms: ["gcp", "google cloud", "google cloud platform", "gke"] },
  { id: "ci_cd", name: "CI/CD", category: "DevOps & Cloud", description: "Continuous integration and deployment pipelines.", synonyms: ["ci/cd", "cicd", "jenkins", "github actions", "gitlab ci", "azure pipelines", "travis ci"] },
  { id: "terraform", name: "Terraform / IaC", category: "DevOps & Cloud", description: "Infrastructure as Code tooling.", synonyms: ["terraform", "iac", "infrastructure as code", "ansible"] },

  // --- Machine Learning & AI ---
  { id: "spacy_nlp", name: "NLP / spaCy", category: "Machine Learning", description: "Natural language processing in Python.", synonyms: ["spacy", "nlp", "natural language processing", "nltk", "text mining"] },
  { id: "machine_learning", name: "Machine Learning", category: "Machine Learning", description: "Algorithms that learn from data.", synonyms: ["machine learning", "ml", "scikit-learn", "sklearn", "gradient boosting", "random forest", "xgboost"] },
  { id: "deep_learning", name: "Deep Learning", category: "Machine Learning", description: "Neural network models for complex AI tasks.", synonyms: ["deep learning", "neural network", "tensorflow", "pytorch", "keras", "cnn", "rnn", "lstm"] },
  { id: "data_science", name: "Data Science", category: "Machine Learning", description: "Analyzing and interpreting complex data.", synonyms: ["data science", "data analysis", "pandas", "numpy", "jupyter", "data analyst", "exploratory data analysis"] },
  { id: "llm", name: "LLM / Generative AI", category: "Machine Learning", description: "Large language models and generative AI.", synonyms: ["llm", "gpt", "openai", "langchain", "generative ai", "chatgpt", "prompt engineering"] },

  // --- Tools & Practices ---
  { id: "git", name: "Git & GitHub", category: "Tools & Practices", description: "Distributed version control system.", synonyms: ["git", "github", "version control", "gitlab", "bitbucket", "git flow"] },
  { id: "agile", name: "Agile / Scrum", category: "Tools & Practices", description: "Agile software development methodology.", synonyms: ["agile", "scrum", "kanban", "jira", "sprint", "agile methodology"] },
  { id: "rest_api", name: "REST API / GraphQL", category: "Tools & Practices", description: "API design and implementation patterns.", synonyms: ["rest", "rest api", "restful", "restful api", "graphql", "api design", "openapi", "swagger"] },
  { id: "microservices", name: "Microservices", category: "Tools & Practices", description: "Architectural pattern for distributed systems.", synonyms: ["microservices", "microservice", "service mesh", "api gateway"] },
  { id: "linux", name: "Linux / Shell", category: "Tools & Practices", description: "Linux OS and bash scripting.", synonyms: ["linux", "bash", "shell", "unix", "shell scripting", "command line"] },
  { id: "testing", name: "Testing / QA", category: "Tools & Practices", description: "Software testing frameworks and QA.", synonyms: ["unit testing", "integration testing", "jest", "pytest", "xunit", "mocha", "selenium", "cypress", "tdd", "bdd"] },
  { id: "system_design", name: "System Design", category: "Tools & Practices", description: "Designing scalable software architecture.", synonyms: ["system design", "software architecture", "scalability", "distributed systems", "load balancing"] },
];

// Prerequisite Skill Dependency Graph
export const SKILL_DEPENDENCIES = {
  aspnet_core: ["csharp"],
  ef_core: ["csharp", "aspnet_core", "sql"],
  docker: ["linux"],
  kubernetes: ["docker"],
  azure: ["docker"],
  aws: ["linux"],
  gcp: ["linux"],
  ci_cd: ["git"],
  spring_boot: ["java"],
  hibernate: ["java", "sql"],
  node_js: ["javascript"],
  nextjs: ["react", "javascript"],
  django: ["python"],
  flask: ["python"],
  fastapi: ["python"],
  machine_learning: ["python", "data_science"],
  deep_learning: ["machine_learning"],
  spacy_nlp: ["python"],
  llm: ["python", "machine_learning"],
  typescript: ["javascript"],
  react: ["javascript", "html_css"],
  angular: ["typescript", "html_css"],
  vue: ["javascript", "html_css"],
  microservices: ["rest_api"],
  system_design: ["microservices"],
  sequelize: ["node_js", "sql"],
};

// Default Job Postings — With rich, realistic JD text for NLP extraction
export const INITIAL_JOBS = [
  {
    id: "job-dot-net-intern",
    title: "Backend Engineering Intern (.NET Core & Cloud)",
    company: "TechBridge Systems Inc.",
    location: "Remote / Hybrid (Seattle, WA)",
    type: "Internship",
    postedDate: "2026-08-10",
    description: `We are seeking a motivated Backend Engineering Intern with a passion for building scalable RESTful APIs.

Role Requirements:
- Strong proficiency in C# and object-oriented programming
- Experience with ASP.NET Core Web API development
- Knowledge of SQL Server database design and T-SQL queries
- Familiarity with Entity Framework Core for ORM-based data access
- Hands-on experience with Docker containerization
- Exposure to Microsoft Azure cloud services and deployments
- Understanding of Git version control and GitHub workflows
- REST API design principles and best practices
- Unit Testing and integration testing experience
- CI/CD pipeline familiarity (Azure DevOps or GitHub Actions)

Preferred Qualifications:
- Knowledge of microservices architecture
- Experience with Agile/Scrum development methodology`,

    skillsRequired: [
      { skillId: "csharp", skillName: "C#", requiredProficiency: 3, weight: 20, importance: "Required" },
      { skillId: "aspnet_core", skillName: "ASP.NET Core", requiredProficiency: 3, weight: 25, importance: "Required" },
      { skillId: "sql_server", skillName: "SQL Server", requiredProficiency: 3, weight: 15, importance: "Required" },
      { skillId: "ef_core", skillName: "Entity Framework", requiredProficiency: 3, weight: 10, importance: "Required" },
      { skillId: "docker", skillName: "Docker", requiredProficiency: 2, weight: 10, importance: "Preferred" },
      { skillId: "azure", skillName: "Azure", requiredProficiency: 2, weight: 10, importance: "Preferred" },
      { skillId: "git", skillName: "Git & GitHub", requiredProficiency: 3, weight: 10, importance: "Required" },
    ]
  },
  {
    id: "job-fullstack-dev",
    title: "Full Stack Software Developer",
    company: "Apex Cloud Solutions",
    location: "Austin, TX",
    type: "Full-Time",
    postedDate: "2026-08-14",
    description: `Join our core product team to build modern enterprise web applications.

Role Requirements:
- Proficiency in React.js for building interactive UI components
- Strong JavaScript and TypeScript skills
- Experience with ASP.NET Core REST Web APIs
- SQL Server database design and complex queries
- Understanding of REST API principles and API design patterns
- Git and GitHub for version control and collaboration
- HTML and CSS for responsive web design
- Docker for containerization and deployment
- Unit Testing with Jest or xUnit
- Agile/Scrum methodology and Jira project management

Preferred:
- Next.js server-side rendering experience
- Azure cloud deployments`,

    skillsRequired: [
      { skillId: "react", skillName: "React.js", requiredProficiency: 4, weight: 25, importance: "Required" },
      { skillId: "javascript", skillName: "JavaScript", requiredProficiency: 4, weight: 20, importance: "Required" },
      { skillId: "typescript", skillName: "TypeScript", requiredProficiency: 3, weight: 10, importance: "Preferred" },
      { skillId: "aspnet_core", skillName: "ASP.NET Core", requiredProficiency: 3, weight: 20, importance: "Required" },
      { skillId: "sql_server", skillName: "SQL Server", requiredProficiency: 3, weight: 10, importance: "Required" },
      { skillId: "git", skillName: "Git & GitHub", requiredProficiency: 3, weight: 15, importance: "Required" },
    ]
  },
  {
    id: "job-ml-nlp-intern",
    title: "AI / NLP Research Intern",
    company: "Cognitive Labs",
    location: "San Francisco, CA",
    type: "Internship",
    postedDate: "2026-08-16",
    description: `Work on cutting-edge artificial intelligence and machine learning research.

Role Requirements:
- Strong Python programming skills (Python 3+)
- Natural language processing (NLP) knowledge and experience with spaCy or NLTK
- Machine learning fundamentals — scikit-learn, classification, regression models
- Deep learning frameworks — TensorFlow or PyTorch
- Data science skills — pandas, numpy, matplotlib, Jupyter notebooks
- Text similarity techniques: TF-IDF vectorization, cosine similarity, named entity recognition
- Git version control and GitHub collaboration
- Docker containerization preferred
- REST API design and FastAPI or Flask experience

Preferred Qualifications:
- LLM / Generative AI experience (OpenAI, LangChain, prompt engineering)
- AWS or GCP cloud deployment experience
- SQL and database knowledge (PostgreSQL or MySQL)`,

    skillsRequired: [
      { skillId: "python", skillName: "Python", requiredProficiency: 4, weight: 25, importance: "Required" },
      { skillId: "spacy_nlp", skillName: "NLP / spaCy", requiredProficiency: 3, weight: 20, importance: "Required" },
      { skillId: "machine_learning", skillName: "Machine Learning", requiredProficiency: 3, weight: 20, importance: "Required" },
      { skillId: "data_science", skillName: "Data Science", requiredProficiency: 3, weight: 15, importance: "Required" },
      { skillId: "git", skillName: "Git & GitHub", requiredProficiency: 3, weight: 10, importance: "Required" },
      { skillId: "docker", skillName: "Docker", requiredProficiency: 2, weight: 10, importance: "Preferred" },
    ]
  },
  {
    id: "job-java-backend",
    title: "Java Backend Developer",
    company: "Fintech Innovations Ltd.",
    location: "New York, NY",
    type: "Full-Time",
    postedDate: "2026-08-17",
    description: `Build robust financial systems using Java and Spring Boot microservices.

Role Requirements:
- Strong Java programming expertise (Java 11+)
- Spring Boot and Spring Framework for microservices development
- Hibernate and JPA for ORM-based database access
- SQL and PostgreSQL for relational database management
- REST API and GraphQL API design
- Docker and Kubernetes for containerized deployments
- AWS cloud services (EC2, S3, Lambda, ECS)
- Apache Kafka for event-driven messaging
- Git and version control workflows
- CI/CD pipeline experience (Jenkins or GitHub Actions)
- Agile/Scrum methodology

Preferred Qualifications:
- Redis caching and in-memory data management
- Microservices architecture and API gateway patterns
- System design knowledge for high-traffic, scalable applications`,

    skillsRequired: [
      { skillId: "java", skillName: "Java", requiredProficiency: 4, weight: 25, importance: "Required" },
      { skillId: "spring_boot", skillName: "Spring Boot", requiredProficiency: 4, weight: 20, importance: "Required" },
      { skillId: "sql", skillName: "SQL", requiredProficiency: 3, weight: 15, importance: "Required" },
      { skillId: "postgresql", skillName: "PostgreSQL", requiredProficiency: 3, weight: 10, importance: "Preferred" },
      { skillId: "docker", skillName: "Docker", requiredProficiency: 3, weight: 10, importance: "Required" },
      { skillId: "aws", skillName: "AWS", requiredProficiency: 3, weight: 10, importance: "Required" },
      { skillId: "git", skillName: "Git & GitHub", requiredProficiency: 3, weight: 10, importance: "Required" },
    ]
  },
  {
    id: "job-frontend-react",
    title: "Frontend React Developer",
    company: "UX Ventures",
    location: "Remote",
    type: "Full-Time",
    postedDate: "2026-08-18",
    description: `Build beautiful, performant user interfaces using React and modern frontend tooling.

Role Requirements:
- Expert-level React.js skills including hooks, context, and state management (Redux)
- Strong TypeScript proficiency
- Modern JavaScript (ES6+) expertise
- Next.js for server-side rendering and static site generation
- HTML5 and CSS3 including responsive design and Flexbox/Grid
- REST API and GraphQL integration
- Git version control and code review workflows
- Unit testing with Jest and React Testing Library
- Performance optimization and web accessibility (WCAG)

Preferred Qualifications:
- Node.js backend experience
- CI/CD and Docker deployment experience
- Figma and design systems familiarity`,

    skillsRequired: [
      { skillId: "react", skillName: "React.js", requiredProficiency: 4, weight: 30, importance: "Required" },
      { skillId: "typescript", skillName: "TypeScript", requiredProficiency: 4, weight: 20, importance: "Required" },
      { skillId: "javascript", skillName: "JavaScript", requiredProficiency: 4, weight: 20, importance: "Required" },
      { skillId: "nextjs", skillName: "Next.js", requiredProficiency: 3, weight: 15, importance: "Preferred" },
      { skillId: "html_css", skillName: "HTML & CSS", requiredProficiency: 4, weight: 10, importance: "Required" },
      { skillId: "git", skillName: "Git & GitHub", requiredProficiency: 3, weight: 5, importance: "Required" },
    ]
  }
];

// Initial Student Profile — With realistic resume text for NLP
export const INITIAL_STUDENT = {
  id: "student-alex",
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  degree: "B.S. Computer Science",
  university: "State Institute of Technology",
  graduationYear: 2027,
  targetRoles: ["Backend Engineer Intern", ".NET Developer", "Full Stack Intern"],
  resumeText: `Alex Rivera — Computer Science Student
Email: alex.rivera@university.edu | Phone: (555) 019-2831 | GitHub: github.com/alexrivera

SUMMARY
Computer Science student with hands-on experience in C# and ASP.NET Core Web API development. Built RESTful APIs using SQL Server, managed Git repositories on GitHub, and containerized services using Docker.

TECHNICAL SKILLS
Languages: C#, JavaScript, Python, HTML, CSS
Frameworks: ASP.NET Core, React
Databases: SQL Server, MySQL
Tools: Git, GitHub, Docker, Visual Studio Code

PROJECTS
Student Portal REST API (C#, ASP.NET Core, SQL Server, Entity Framework)
— Built a multi-tier REST API backend with JWT authentication and role-based access control
— Used SQL Server for data persistence and Entity Framework Core for ORM

Personal Blog Platform (React, JavaScript, HTML, CSS)
— Implemented a responsive SPA with React hooks and RESTful API integration

EDUCATION
B.S. Computer Science — State Institute of Technology (Expected 2027)
GPA: 3.7/4.0 | Relevant Courses: Data Structures, Algorithms, Database Systems, Web Development`,

  skills: [
    { skillId: "csharp", selfAssessment: 4, projectBonus: 0, notes: "Built 3 C# projects" },
    { skillId: "aspnet_core", selfAssessment: 3, projectBonus: 0, notes: "Built REST API for portal" },
    { skillId: "sql_server", selfAssessment: 2, projectBonus: 0, notes: "Basic queries and tables" },
    { skillId: "ef_core", selfAssessment: 1, projectBonus: 0, notes: "Basic ORM usage" },
    { skillId: "docker", selfAssessment: 1, projectBonus: 0, notes: "Containerized basic app" },
    { skillId: "javascript", selfAssessment: 3, projectBonus: 0, notes: "DOM manipulation & fetch" },
    { skillId: "react", selfAssessment: 2, projectBonus: 0, notes: "Personal blog SPA" },
    { skillId: "git", selfAssessment: 3, projectBonus: 0, notes: "Daily Git workflow" },
    { skillId: "html_css", selfAssessment: 3, projectBonus: 0, notes: "Responsive layouts" },
    { skillId: "python", selfAssessment: 2, projectBonus: 0, notes: "Python basics" },
    { skillId: "sql", selfAssessment: 2, projectBonus: 0, notes: "SQL SELECT & JOIN queries" },
    { skillId: "mysql", selfAssessment: 2, projectBonus: 0, notes: "Used MySQL locally" },
  ],

  projects: [
    {
      id: "proj-1",
      title: "Student Portal REST API",
      tech: ["C#", "ASP.NET Core", "SQL Server", "Entity Framework"],
      description: "Designed multi-tier backend with JWT authentication and role-based access control."
    },
    {
      id: "proj-2",
      title: "Personal Blog Platform",
      tech: ["React", "JavaScript", "HTML", "CSS"],
      description: "Responsive single-page application with React hooks and RESTful API integration."
    }
  ]
};

// Initial Student Applications
export const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    jobId: "job-dot-net-intern",
    jobTitle: "Backend Engineering Intern (.NET Core & Cloud)",
    company: "TechBridge Systems Inc.",
    appliedDate: "2026-08-12",
    status: "Under Review",
    matchScore: 72,
    stageNotes: "Resume screened by TF-IDF model. Candidate shortlisted for technical review."
  }
];

// Curated YouTube Videos & Learning Resources for EVERY Topic
export const LEARNING_RESOURCES = {
  csharp: [
    { title: "C# Full Course for Beginners - FreeCodeCamp", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours 30 Mins", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=gfkTfcpWqAY", embedId: "gfkTfcpWqAY" },
    { title: "C# Tutorial for Beginners - Programming with Mosh", channel: "Programming with Mosh", type: "YouTube Video", duration: "1 Hour 20 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=vLnKLF5vibI", embedId: "vLnKLF5vibI" }
  ],
  java: [
    { title: "Java Full Course for Beginners", channel: "Amigoscode", type: "YouTube Video", duration: "9 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=Qgl81fPcLc8", embedId: "Qgl81fPcLc8" },
    { title: "Java Programming Tutorial - Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=A74TOX803D0", embedId: "A74TOX803D0" }
  ],
  python: [
    { title: "Python for Beginners - Full Course", channel: "Programming with Mosh", type: "YouTube Video", duration: "6 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", embedId: "_uQrJ0TkZlc" },
    { title: "Python Tutorial - Python Full Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours 20 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", embedId: "rfscVS0vtbw" }
  ],
  javascript: [
    { title: "JavaScript Tutorial for Beginners - Full Course", channel: "Programming with Mosh", type: "YouTube Video", duration: "1 Hour 40 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", embedId: "W6NZfCO5SIk" },
    { title: "Modern JavaScript ES6+ Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours 20 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", embedId: "PkZNo7MFNFg" }
  ],
  typescript: [
    { title: "TypeScript Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "5 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=d56mG7DezGs", embedId: "d56mG7DezGs" },
    { title: "TypeScript Tutorial for Beginners", channel: "Programming with Mosh", type: "YouTube Video", duration: "1 Hour", level: "Beginner", url: "https://www.youtube.com/watch?v=BwuLxPH8IDs", embedId: "BwuLxPH8IDs" }
  ],
  cpp: [
    { title: "C++ Tutorial for Beginners - Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", embedId: "vLnPwxZdW4Y" }
  ],
  golang: [
    { title: "Golang Tutorial for Beginners | Full Go Course", channel: "TechWorld with Nana", type: "YouTube Video", duration: "3 Hours 25 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=yyUHQIec83I", embedId: "yyUHQIec83I" }
  ],
  kotlin: [
    { title: "Kotlin Tutorial for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "2 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=F9UC9DY-vIU", embedId: "F9UC9DY-vIU" }
  ],
  aspnet_core: [
    { title: "ASP.NET Core Web API Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "5 Hours 10 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=c-w_A59W2yI", embedId: "c-w_A59W2yI" },
    { title: "ASP.NET Core REST API Tutorial", channel: "IAmTimCorey", type: "YouTube Video", duration: "3 Hours 45 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=BfEjDD8mWYg", embedId: "BfEjDD8mWYg" }
  ],
  spring_boot: [
    { title: "Spring Boot Tutorial for Beginners", channel: "Amigoscode", type: "YouTube Video", duration: "3 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=9SGDpanrc8U", embedId: "9SGDpanrc8U" },
    { title: "Spring Boot Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "5 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=vtPkZShrvXQ", embedId: "vtPkZShrvXQ" }
  ],
  node_js: [
    { title: "Node.js Full Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "8 Hours", level: "Beginner to Advanced", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", embedId: "Oe421EPjeBE" },
    { title: "Node.js & Express.js Tutorial", channel: "Traversy Media", type: "YouTube Video", duration: "1 Hour 45 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=ENrzD9HAZK4", embedId: "ENrzD9HAZK4" }
  ],
  django: [
    { title: "Django Tutorial for Beginners - Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours 20 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=F5mRW0jo-U4", embedId: "F5mRW0jo-U4" }
  ],
  flask: [
    { title: "Flask Tutorial for Beginners", channel: "Corey Schafer", type: "YouTube Video", duration: "2 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=MwZwr5Tvyxo", embedId: "MwZwr5Tvyxo" }
  ],
  fastapi: [
    { title: "FastAPI Full Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=7t2alSnE2-I", embedId: "7t2alSnE2-I" }
  ],
  react: [
    { title: "React JS Full Course 2026 - Beginners to Advanced", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "12 Hours", level: "Beginner to Advanced", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", embedId: "bMknfKXIFA8" },
    { title: "React Hooks & State Management Crash Course", channel: "Traversy Media", type: "YouTube Video", duration: "1 Hour 45 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", embedId: "w7ejDZ8SWv8" }
  ],
  angular: [
    { title: "Angular Tutorial for Beginners: Learn Angular & TypeScript", channel: "Programming with Mosh", type: "YouTube Video", duration: "2 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=k5E2AVpwsko", embedId: "k5E2AVpwsko" }
  ],
  vue: [
    { title: "Vue.js Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours 10 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=FXpIoQ_rT_c", embedId: "FXpIoQ_rT_c" }
  ],
  nextjs: [
    { title: "Next.js Full Course for Beginners", channel: "Traversy Media", type: "YouTube Video", duration: "2 Hours 30 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=mTz0GXj8NN0", embedId: "mTz0GXj8NN0" }
  ],
  html_css: [
    { title: "HTML and CSS Full Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "6 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=mU6anWqZJcc", embedId: "mU6anWqZJcc" }
  ],
  sql_server: [
    { title: "Microsoft SQL Server Tutorial for Beginners", channel: "Programming with Mosh", type: "YouTube Video", duration: "1 Hour 15 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=7S_tz1z_5bA", embedId: "7S_tz1z_5bA" },
    { title: "SQL Database Design & Queries Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", embedId: "HXV3zeQKqGY" }
  ],
  mysql: [
    { title: "MySQL Full Course for Beginners", channel: "Programming with Mosh", type: "YouTube Video", duration: "3 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=7S_tz1z_5bA", embedId: "7S_tz1z_5bA" }
  ],
  postgresql: [
    { title: "PostgreSQL Tutorial Full Course", channel: "Derek Banas", type: "YouTube Video", duration: "4 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=-VO7YjQeG6Y", embedId: "-VO7YjQeG6Y" }
  ],
  mongodb: [
    { title: "MongoDB Tutorial for Beginners - Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=c2M-rlkkT5o", embedId: "c2M-rlkkT5o" }
  ],
  sql: [
    { title: "SQL Tutorial - Full Database Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours 20 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", embedId: "HXV3zeQKqGY" }
  ],
  redis: [
    { title: "Redis Crash Course", channel: "Traversy Media", type: "YouTube Video", duration: "40 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ", embedId: "jgpVdJB2sKQ" }
  ],
  ef_core: [
    { title: "Entity Framework Core Full Course for Beginners", channel: "Les Jackson", type: "YouTube Video", duration: "3 Hours 20 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=d7J_4N4cW44", embedId: "d7J_4N4cW44" },
    { title: "EF Core Deep Dive: DbContext, Migrations & LINQ", channel: "IAmTimCorey", type: "YouTube Video", duration: "2 Hours 40 Mins", level: "Advanced", url: "https://www.youtube.com/watch?v=S38h32n7hJ4", embedId: "S38h32n7hJ4" }
  ],
  hibernate: [
    { title: "Hibernate and JPA Tutorial for Beginners", channel: "Amigoscode", type: "YouTube Video", duration: "2 Hours", level: "Intermediate", url: "https://www.youtube.com/results?search_query=hibernate+jpa+tutorial", embedId: null }
  ],
  docker: [
    { title: "Docker Tutorial for Beginners (Full Course)", channel: "TechWorld with Nana", type: "YouTube Video", duration: "2 Hours 45 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", embedId: "3c-iBn73dDE" },
    { title: "Dockerizing ASP.NET Core & SQL Server Microservices", channel: "Nick Chapsas", type: "YouTube Video", duration: "45 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", embedId: "fqMOX6JJhGo" }
  ],
  kubernetes: [
    { title: "Kubernetes Tutorial for Beginners (Full Course)", channel: "TechWorld with Nana", type: "YouTube Video", duration: "4 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=X48VuDVv0do", embedId: "X48VuDVv0do" }
  ],
  azure: [
    { title: "Microsoft Azure Fundamentals AZ-900 Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours 15 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", embedId: "NKEFWyqJ5XA" },
    { title: "Deploying ASP.NET Core Web API to Azure App Service", channel: "Julio Casal", type: "YouTube Video", duration: "1 Hour 10 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=3g83uE_hIvg", embedId: "3g83uE_hIvg" }
  ],
  aws: [
    { title: "AWS Certified Cloud Practitioner - Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "13 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", embedId: "SOTamWNgDKc" },
    { title: "AWS Tutorial for Beginners", channel: "TechWorld with Nana", type: "YouTube Video", duration: "2 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=k1RI5locZE4", embedId: "k1RI5locZE4" }
  ],
  gcp: [
    { title: "Google Cloud Platform (GCP) Tutorial for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=jpno8FSqpc8", embedId: "jpno8FSqpc8" }
  ],
  ci_cd: [
    { title: "CI/CD Explained with GitHub Actions", channel: "TechWorld with Nana", type: "YouTube Video", duration: "1 Hour 30 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", embedId: "R8_veQiYBjI" }
  ],
  spacy_nlp: [
    { title: "Natural Language Processing (NLP) with Python & spaCy", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours 10 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=dIUTsFT2MeQ", embedId: "dIUTsFT2MeQ" },
    { title: "TF-IDF Vectorization & Text Similarity Tutorial", channel: "StatQuest", type: "YouTube Video", duration: "45 Mins", level: "Intermediate", url: "https://www.youtube.com/watch?v=WnGPv6HnBok", embedId: "WnGPv6HnBok" }
  ],
  machine_learning: [
    { title: "Machine Learning Full Course - Learn ML in 6 Hours", channel: "edureka!", type: "YouTube Video", duration: "6 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", embedId: "GwIo3gDZCVQ" },
    { title: "Machine Learning with scikit-learn", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "4 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=pqNCD_5r0IU", embedId: "pqNCD_5r0IU" }
  ],
  deep_learning: [
    { title: "Deep Learning Crash Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=VyWAvY2CF9c", embedId: "VyWAvY2CF9c" }
  ],
  data_science: [
    { title: "Data Science Full Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "10 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", embedId: "ua-CiDNNj30" }
  ],
  llm: [
    { title: "LangChain & LLM Tutorial for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "2 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=lG7Uxts9SXs", embedId: "lG7Uxts9SXs" }
  ],
  git: [
    { title: "Git and GitHub Tutorial for Beginners - Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "1 Hour 10 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", embedId: "RGOj5yH7evk" },
    { title: "Git Command Line Complete Tutorial", channel: "Corey Schafer", type: "YouTube Video", duration: "45 Mins", level: "Beginner", url: "https://www.youtube.com/watch?v=HVsySz-h9r4", embedId: "HVsySz-h9r4" }
  ],
  agile: [
    { title: "Agile Scrum Full Course for Beginners", channel: "Simplilearn", type: "YouTube Video", duration: "2 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=gy1c4_YixCo", embedId: "gy1c4_YixCo" }
  ],
  rest_api: [
    { title: "REST API Tutorial for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "1 Hour", level: "Beginner", url: "https://www.youtube.com/watch?v=-MTSQjw5DrM", embedId: "-MTSQjw5DrM" }
  ],
  microservices: [
    { title: "Microservices Architecture Tutorial", channel: "TechWorld with Nana", type: "YouTube Video", duration: "2 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=T-m7ZFxeg1A", embedId: "T-m7ZFxeg1A" }
  ],
  linux: [
    { title: "Linux Command Line Full Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "5 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", embedId: "sWbUDq4S6Y8" }
  ],
  testing: [
    { title: "Software Testing Full Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours", level: "Beginner to Intermediate", url: "https://www.youtube.com/watch?v=j9nnQ5fCeD4", embedId: "j9nnQ5fCeD4" }
  ],
  system_design: [
    { title: "System Design Interview Course", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "5 Hours", level: "Advanced", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", embedId: "xpDnVSmNFX0" }
  ],
  firebase: [
    { title: "Firebase Full Course for Beginners", channel: "freeCodeCamp.org", type: "YouTube Video", duration: "3 Hours", level: "Beginner", url: "https://www.youtube.com/watch?v=9zdvmgGsww0", embedId: "9zdvmgGsww0" }
  ],
  terraform: [
    { title: "Terraform Tutorial for Beginners", channel: "TechWorld with Nana", type: "YouTube Video", duration: "2 Hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=l5k1ai_GBDE", embedId: "l5k1ai_GBDE" }
  ]
};
