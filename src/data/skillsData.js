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

// Initial Student Profile
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
Computer Science student with strong proficiency in object-oriented programming in C# and web API development using ASP.NET Core. Built multiple university projects using SQL Server databases and basic Docker containers.

Technical Skills:
Languages & Frameworks: C#, ASP.NET Core, SQL Server, JavaScript, Python, HTML/CSS
Tools & Platforms: Docker, Git, Visual Studio, SQL Server Management Studio`,

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
    {
      title: "C# Full Course for Beginners - FreeCodeCamp",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "4 Hours 30 Mins",
      level: "Beginner to Intermediate",
      url: "https://www.youtube.com/watch?v=gfkTfcpWqAY",
      embedId: "gfkTfcpWqAY"
    },
    {
      title: "C# Tutorial for Beginners - Programming with Mosh",
      channel: "Programming with Mosh",
      type: "YouTube Video",
      duration: "1 Hour 20 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=vLnKLF5vibI",
      embedId: "vLnKLF5vibI"
    }
  ],
  aspnet_core: [
    {
      title: "ASP.NET Core Web API Full Course for Beginners - Tim Corey",
      channel: "IAmTimCorey",
      type: "YouTube Video",
      duration: "3 Hours 45 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=BfEjDD8mWYg",
      embedId: "BfEjDD8mWYg"
    },
    {
      title: "ASP.NET Core REST API Tutorial from Scratch",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "5 Hours 10 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=c-w_A59W2yI",
      embedId: "c-w_A59W2yI"
    }
  ],
  sql_server: [
    {
      title: "Microsoft SQL Server Tutorial for Beginners",
      channel: "Kudvenkat / Programming with Mosh",
      type: "YouTube Video",
      duration: "1 Hour 15 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      embedId: "7S_tz1z_5bA"
    },
    {
      title: "SQL Database Design & Queries Full Course",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "4 Hours",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      embedId: "HXV3zeQKqGY"
    }
  ],
  ef_core: [
    {
      title: "Entity Framework Core Full Course for Beginners",
      channel: "Les Jackson",
      type: "YouTube Video",
      duration: "3 Hours 20 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=d7J_4N4cW44",
      embedId: "d7J_4N4cW44"
    },
    {
      title: "EF Core Deep Dive: DbContext, Migrations & LINQ Queries",
      channel: "IAmTimCorey",
      type: "YouTube Video",
      duration: "2 Hours 40 Mins",
      level: "Advanced",
      url: "https://www.youtube.com/watch?v=S38h32n7hJ4",
      embedId: "S38h32n7hJ4"
    }
  ],
  docker: [
    {
      title: "Docker Tutorial for Beginners (Full Course)",
      channel: "TechWorld with Nana",
      type: "YouTube Video",
      duration: "2 Hours 45 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      embedId: "3c-iBn73dDE"
    },
    {
      title: "Dockerizing ASP.NET Core & SQL Server Microservices",
      channel: "Nick Chapsas",
      type: "YouTube Video",
      duration: "45 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
      embedId: "fqMOX6JJhGo"
    }
  ],
  azure: [
    {
      title: "Microsoft Azure Fundamentals AZ-900 Full Course",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "3 Hours 15 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA",
      embedId: "NKEFWyqJ5XA"
    },
    {
      title: "Deploying ASP.NET Core Web API to Azure App Service",
      channel: "Julio Casal",
      type: "YouTube Video",
      duration: "1 Hour 10 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=3g83uE_hIvg",
      embedId: "3g83uE_hIvg"
    }
  ],
  react: [
    {
      title: "React JS Full Course 2026 - Beginners to Advanced",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "12 Hours",
      level: "Beginner to Advanced",
      url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
      embedId: "bMknfKXIFA8"
    },
    {
      title: "React Hooks & State Management Crash Course",
      channel: "Traversy Media",
      type: "YouTube Video",
      duration: "1 Hour 45 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
      embedId: "w7ejDZ8SWv8"
    }
  ],
  javascript: [
    {
      title: "JavaScript Tutorial for Beginners - Full Course",
      channel: "Programming with Mosh",
      type: "YouTube Video",
      duration: "1 Hour 40 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      embedId: "W6NZfCO5SIk"
    },
    {
      title: "Modern JavaScript ES6+ & Async Async/Await Course",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "3 Hours 20 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      embedId: "PkZNo7MFNFg"
    }
  ],
  typescript: [
    {
      title: "TypeScript Course for Beginners - Learn TypeScript",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "5 Hours",
      level: "Beginner to Intermediate",
      url: "https://www.youtube.com/watch?v=d56mG7DezGs",
      embedId: "d56mG7DezGs"
    },
    {
      title: "TypeScript Tutorial for Beginners",
      channel: "Programming with Mosh",
      type: "YouTube Video",
      duration: "1 Hour",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
      embedId: "BwuLxPH8IDs"
    }
  ],
  python: [
    {
      title: "Python for Beginners - Full Course",
      channel: "Programming with Mosh",
      type: "YouTube Video",
      duration: "6 Hours",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
      embedId: "_uQrJ0TkZlc"
    },
    {
      title: "Python Tutorial - Python Full Course for Beginners",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "4 Hours 20 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      embedId: "rfscVS0vtbw"
    }
  ],
  spacy_nlp: [
    {
      title: "Natural Language Processing (NLP) with Python & spaCy",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "3 Hours 10 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=dIUTsFT2MeQ",
      embedId: "dIUTsFT2MeQ"
    },
    {
      title: "TF-IDF Vectorization & Text Similarity Tutorial",
      channel: "StatQuest / Machine Learning Simplified",
      type: "YouTube Video",
      duration: "45 Mins",
      level: "Intermediate",
      url: "https://www.youtube.com/watch?v=WnGPv6HnBok",
      embedId: "WnGPv6HnBok"
    }
  ],
  git: [
    {
      title: "Git and GitHub Tutorial for Beginners - Full Course",
      channel: "freeCodeCamp.org",
      type: "YouTube Video",
      duration: "1 Hour 10 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      embedId: "RGOj5yH7evk"
    },
    {
      title: "Git Command Line Complete Tutorial",
      channel: "Corey Schafer",
      type: "YouTube Video",
      duration: "45 Mins",
      level: "Beginner",
      url: "https://www.youtube.com/watch?v=HVsySz-h9r4",
      embedId: "HVsySz-h9r4"
    }
  ]
};
