// Master Canonical SKILLS Table with synonym mappings
export const CANONICAL_SKILLS = [
  {
    id: "csharp",
    name: "C#",
    category: "Languages",
    description: "Modern, object-oriented programming language developed by Microsoft.",
    synonyms: ["c#", "csharp", "c sharp", ".net c#"]
  },
  {
    id: "aspnet_core",
    name: "ASP.NET Core",
    category: "Backend Frameworks",
    description: "Cross-platform, high-performance web framework for building modern cloud-based applications.",
    synonyms: ["asp.net core", "aspnet core", ".net core", "asp.net", "aspnet", "web api"]
  },
  {
    id: "sql_server",
    name: "SQL Server",
    category: "Databases",
    description: "Relational database management system by Microsoft.",
    synonyms: ["sql server", "mssql", "microsoft sql server", "t-sql", "tsql", "sql"]
  },
  {
    id: "ef_core",
    name: "Entity Framework",
    category: "ORM / Data Access",
    description: "Object-relational mapper (ORM) for .NET applications.",
    synonyms: ["entity framework", "ef core", "entity framework core", "efcore", "orm"]
  },
  {
    id: "docker",
    name: "Docker",
    category: "DevOps & Cloud",
    description: "Platform for developing, shipping, and running applications in containers.",
    synonyms: ["docker", "containerization", "containers", "docker compose"]
  },
  {
    id: "azure",
    name: "Azure",
    category: "DevOps & Cloud",
    description: "Microsoft's public cloud computing platform.",
    synonyms: ["azure", "ms azure", "microsoft azure", "azure devops", "app service"]
  },
  {
    id: "react",
    name: "React.js",
    category: "Frontend Frameworks",
    description: "Declarative, component-based UI library for web applications.",
    synonyms: ["react", "react.js", "reactjs", "react js", "frontend react"]
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Languages",
    description: "Core programming language of the Web.",
    synonyms: ["javascript", "js", "ecmascript", "es6"]
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Languages",
    description: "Strongly typed programming language that builds on JavaScript.",
    synonyms: ["typescript", "ts"]
  },
  {
    id: "python",
    name: "Python",
    category: "Languages",
    description: "High-level programming language used widely for ML, Web, and Automation.",
    synonyms: ["python", "py", "python3"]
  },
  {
    id: "spacy_nlp",
    name: "spaCy / NLP",
    category: "Machine Learning",
    description: "Industrial-strength natural language processing in Python.",
    synonyms: ["spacy", "nlp", "natural language processing", "scikit-learn", "nltk"]
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "Tools & Practices",
    description: "Distributed version control system.",
    synonyms: ["git", "github", "version control", "gitlab", "bitbucket"]
  }
];

// Prerequisite Skill Dependency Graph
// Key = Target Skill ID, Value = Array of Prerequisite Skill IDs
export const SKILL_DEPENDENCIES = {
  aspnet_core: ["csharp"],
  ef_core: ["csharp", "aspnet_core", "sql_server"],
  docker: ["aspnet_core"],
  azure: ["docker", "aspnet_core"],
  typescript: ["javascript"],
  react: ["javascript"],
  spacy_nlp: ["python"]
};

// Default Job Postings
export const INITIAL_JOBS = [
  {
    id: "job-dot-net-intern",
    title: "Backend Engineering Intern (.NET Core & Cloud)",
    company: "TechBridge Systems Inc.",
    location: "Remote / Hybrid (Seattle, WA)",
    type: "Internship",
    postedDate: "2026-08-10",
    description: "We are seeking a motivated Backend Engineering Intern with a passion for building scalable C# APIs using ASP.NET Core and SQL Server. You will learn to work with Entity Framework, containerize services using Docker, and deploy to Azure.",
    skillsRequired: [
      { skillId: "csharp", skillName: "C#", requiredProficiency: 3, weight: 20, importance: "Required" },
      { skillId: "aspnet_core", skillName: "ASP.NET Core", requiredProficiency: 3, weight: 25, importance: "Required" },
      { skillId: "sql_server", skillName: "SQL Server", requiredProficiency: 3, weight: 15, importance: "Required" },
      { skillId: "ef_core", skillName: "Entity Framework", requiredProficiency: 3, weight: 15, importance: "Required" },
      { skillId: "docker", skillName: "Docker", requiredProficiency: 3, weight: 10, importance: "Preferred" },
      { skillId: "azure", skillName: "Azure", requiredProficiency: 3, weight: 15, importance: "Preferred" }
    ]
  },
  {
    id: "job-fullstack-dev",
    title: "Full Stack Software Developer",
    company: "Apex Cloud Solutions",
    location: "Austin, TX",
    type: "Full-Time",
    postedDate: "2026-08-14",
    description: "Join our core product team to build modern enterprise web applications using React.js, ASP.NET Core REST Web APIs, and SQL Server databases.",
    skillsRequired: [
      { skillId: "react", skillName: "React.js", requiredProficiency: 4, weight: 25, importance: "Required" },
      { skillId: "javascript", skillName: "JavaScript", requiredProficiency: 4, weight: 20, importance: "Required" },
      { skillId: "aspnet_core", skillName: "ASP.NET Core", requiredProficiency: 3, weight: 25, importance: "Required" },
      { skillId: "sql_server", skillName: "SQL Server", requiredProficiency: 3, weight: 15, importance: "Required" },
      { skillId: "git", skillName: "Git & GitHub", requiredProficiency: 3, weight: 15, importance: "Required" }
    ]
  },
  {
    id: "job-ml-nlp-intern",
    title: "AI / NLP Research Intern",
    company: "Cognitive Labs",
    location: "San Francisco, CA",
    type: "Internship",
    postedDate: "2026-08-16",
    description: "Work on cutting-edge text similarity, TF-IDF vectorization, and named entity recognition models for document processing.",
    skillsRequired: [
      { skillId: "python", skillName: "Python", requiredProficiency: 4, weight: 35, importance: "Required" },
      { skillId: "spacy_nlp", skillName: "spaCy / NLP", requiredProficiency: 3, weight: 35, importance: "Required" },
      { skillId: "docker", skillName: "Docker", requiredProficiency: 2, weight: 15, importance: "Preferred" },
      { skillId: "git", skillName: "Git & GitHub", requiredProficiency: 3, weight: 15, importance: "Required" }
    ]
  }
];

// Initial Student Profile matching PDF document example
export const INITIAL_STUDENT = {
  id: "student-alex",
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  degree: "B.S. Computer Science",
  university: "State Institute of Technology",
  graduationYear: 2027,
  targetRoles: ["Backend Engineer Intern", ".NET Developer", "Full Stack Intern"],
  resumeText: `Alex Rivera - Computer Science Student
Email: alex.rivera@university.edu | Phone: (555) 019-2831

Summary:
Computer Science student with strong proficiency in object-oriented programming in C# and web API development using ASP.NET Core. Built multiple university projects using SQL Server databases and basic Docker containers. Passionate about cloud architectures and backend engineering.

Technical Skills:
Languages & Frameworks: C#, ASP.NET Core, SQL Server, JavaScript, Python, HTML/CSS
Tools & Platforms: Docker, Git, Visual Studio, SQL Server Management Studio

Projects:
1. Student Portal Web API: Developed RESTful endpoints using C# and ASP.NET Core 8. Connected to Microsoft SQL Server database using raw ADO.NET and parameterized stored procedures.
2. Containerized Microservice Demo: Configured Docker container for ASP.NET Web API and exposed endpoints for testing.

Education:
B.S. in Computer Science - State Institute of Technology (3.8 GPA)`,
  
  // Student self-assessment & verified project evidence
  skills: [
    { skillId: "csharp", selfAssessment: 4, projectBonus: 0, notes: "Completed 3 projects in C#" },
    { skillId: "aspnet_core", selfAssessment: 4, projectBonus: 0, notes: "Built REST API for portal" },
    { skillId: "sql_server", selfAssessment: 2, projectBonus: 0, notes: "Basic queries and tables" },
    { skillId: "ef_core", selfAssessment: 0, projectBonus: 0, notes: "No prior experience" },
    { skillId: "docker", selfAssessment: 1, projectBonus: 0, notes: "Containerized basic app" },
    { skillId: "azure", selfAssessment: 1, projectBonus: 0, notes: "Explored portal UI" },
    { skillId: "javascript", selfAssessment: 3, projectBonus: 0, notes: "DOM manipulation & fetch" },
    { skillId: "git", selfAssessment: 3, projectBonus: 0, notes: "Daily Git workflow" }
  ],

  projects: [
    {
      id: "proj-1",
      title: "Student Portal REST API",
      tech: ["C#", "ASP.NET Core", "SQL Server"],
      description: "Designed multi-tier backend with JWT authentication and role-based access control."
    },
    {
      id: "proj-2",
      title: "Dockerized Service",
      tech: ["Docker", "ASP.NET Core"],
      description: "Containerized C# Web API microservice using Dockerfile and docker-compose."
    }
  ],

  certifications: [
    { name: "Foundational C# Certification", issuer: "Microsoft / FreeCodeCamp", year: 2025 }
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

// Curated Learning Resources for missing skills
export const LEARNING_RESOURCES = {
  ef_core: [
    { title: "Entity Framework Core Fundamentals", type: "Microsoft Learn", duration: "4 Hours", level: "Intermediate", url: "https://learn.microsoft.com/en-us/ef/core/" },
    { title: "Building Data Models with EF Core & C#", type: "Video Course", duration: "3.5 Hours", level: "Intermediate", url: "#" }
  ],
  sql_server: [
    { title: "Advanced SQL Queries & Indexing", type: "Interactive Practice", duration: "5 Hours", level: "Intermediate", url: "#" },
    { title: "Database Normalization & Stored Procedures", type: "Documentation", duration: "2 Hours", level: "Basic", url: "#" }
  ],
  docker: [
    { title: "Docker & Containerization for .NET Developers", type: "Workshop", duration: "4 Hours", level: "Beginner-Intermediate", url: "#" },
    { title: "Writing Production Dockerfiles", type: "Tutorial", duration: "1.5 Hours", level: "Intermediate", url: "#" }
  ],
  azure: [
    { title: "AZ-900: Azure Fundamentals Overview", type: "Certification Guide", duration: "8 Hours", level: "Beginner", url: "#" },
    { title: "Deploying ASP.NET Core to Azure App Service", type: "Hands-on Lab", duration: "2 Hours", level: "Intermediate", url: "#" }
  ]
};
