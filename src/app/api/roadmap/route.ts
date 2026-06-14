import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are TrendForge AI — a real-time career and technology intelligence agent powered by advanced LLM reasoning. 
Your role is to analyze live technology trends and generate hyper-personalized, trend-aware career roadmaps.

You have awareness of these CURRENT top trending technologies (June 2025):
- AI Agents (score: 98, growth: +142%)
- MCP Servers / Model Context Protocol (score: 94, growth: +118%)
- LangGraph for multi-agent orchestration (score: 89, growth: +96%)
- Vector Databases (Chroma/Pgvector/Pinecone) (score: 87, growth: +88%)
- RAG (Retrieval-Augmented Generation) systems (score: 85, growth: +76%)
- Multimodal AI (vision + text + voice) (score: 82, growth: +71%)
- Edge AI deployment (score: 78, growth: +64%)
- OpenAI Realtime API (score: 76, growth: +59%)

You must:
1. Acknowledge the user's current skills as a foundation
2. Map the FASTEST PATHS from those skills to current market demand
3. Prioritize technologies by market heat score and hiring urgency
4. Generate specific, actionable project ideas
5. Give HONEST hiring probability based on timeline + goal + market
6. Suggest DIVERSE learning resources across OpenAI Cookbook, DeepLearning.AI, fast.ai, Hugging Face, official documentation, GitHub repositories, and YouTube tutorials.

Always respond with valid JSON matching the exact schema provided. No markdown, no extra text — pure JSON only.`;

const ROADMAP_SCHEMA = `{
  "summary": "string — 2-3 sentences analyzing their situation against live market trends",
  "trendContext": "string — 1-2 sentences about what specific live trends affect their goal",
  "hiringProbability": "number 0-100 — realistic probability of achieving their goal in given timeline",
  "roadmap": [
    {
      "week": "string e.g. Week 1–2",
      "title": "string — phase title",
      "skills": ["array of specific skills/tools to learn"],
      "projects": ["array of concrete projects to build"],
      "urgency": "number 0-100 — how urgent based on market demand"
    }
  ],
  "suggestedTechStack": ["array of 6-8 specific technologies"],
  "learningResources": [
    {
      "title": "string — resource name",
      "url": "string — real URL",
      "type": "Course | Docs | YouTube | GitHub"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  let skills = "";
  let goal = "";
  let timeline = "3 months";
  let level = "intermediate";
  let customPrompt = "";
  let currentRoadmap: any = null;

  try {
    const body = await req.json();
    skills = body.skills;
    goal = body.goal;
    timeline = body.timeline || "3 months";
    level = body.level || "intermediate";
    customPrompt = body.customPrompt || "";
    currentRoadmap = body.currentRoadmap || null;
  } catch (err: any) {
    console.error("Failed to parse request JSON:", err);
    return NextResponse.json({ error: "Invalid request JSON" }, { status: 400 });
  }

  if (!skills || !goal) {
    return NextResponse.json({ error: "Skills and goal are required" }, { status: 400 });
  }

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    if (!endpoint || !apiKey) {
      return NextResponse.json(getMockRoadmap(skills, goal, timeline, level, customPrompt, currentRoadmap));
    }

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    let userPrompt = "";
    if (customPrompt && currentRoadmap) {
      userPrompt = `
User wants to CUSTOMIZE their existing career roadmap.
Current Profile:
- Skills: ${skills}
- Goal: ${goal}
- Timeline: ${timeline}
- Level: ${level}

Current Roadmap:
${JSON.stringify(currentRoadmap, null, 2)}

User Customization Request: "${customPrompt}"

Please update the existing career roadmap matching their request. Keep the JSON schema exactly the same. Make the updates specific and precise to their request (e.g. if they asked to focus on a technology or adjust pacing, modify the roadmap steps, summary, and suggested stack accordingly).
`;
    } else {
      userPrompt = `
User Profile:
- Current Skills: ${skills}
- Goal: ${goal}
- Available Time: ${timeline}
- Experience Level: ${level}

Based on LIVE market trends (June 2025) and the user's profile above, generate a highly detailed, comprehensive, and granular week-by-week career roadmap matching the timeline (${timeline}).
Ensure the roadmap has at least 6 distinct phases or week ranges.
For each roadmap phase:
1. Provide a specific, informative phase title.
2. List at least 4-5 granular skills, tools, and libraries to learn (e.g. Pgvector, LangGraph State, LangSmith tracing).
3. Describe at least 3 concrete, non-generic projects to build with clear execution steps.
4. Give a realistic market urgency score based on trending job requirements.

Return ONLY valid JSON matching this exact schema:
${ROADMAP_SCHEMA}

Make the roadmap SPECIFIC and custom to their skills and goal. Reference real technologies trending NOW in the industry. Be honest about the hiring probability.
`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Azure OpenAI error, falling back to local simulation:", errText);
      return NextResponse.json(getMockRoadmap(skills, goal, timeline, level, customPrompt, currentRoadmap));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.warn("No response content, falling back to local simulation");
      return NextResponse.json(getMockRoadmap(skills, goal, timeline, level, customPrompt, currentRoadmap));
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);

  } catch (err: any) {
    console.warn("Roadmap API exception, falling back to local simulation:", err);
    return NextResponse.json(getMockRoadmap(skills, goal, timeline, level, customPrompt, currentRoadmap));
  }
}

function getMockRoadmap(skills: string, goal: string, timeline: string, level: string, customPrompt?: string, currentRoadmap?: any) {
  const normalizedGoal = goal.toLowerCase();
  const normalizedSkills = skills.toLowerCase();

  // If this is a customization request, adapt the current roadmap dynamically
  if (customPrompt && currentRoadmap) {
    const cloned = JSON.parse(JSON.stringify(currentRoadmap));
    const lower = customPrompt.toLowerCase();
    
    cloned.summary = `Customized Study Path: Adjusted to incorporate "${customPrompt}".`;
    
    // 1. Time pacing adjustments
    if (lower.includes("slow") || lower.includes("pace") || lower.includes("extend") || lower.includes("longer")) {
      cloned.roadmap.forEach((phase: any) => {
        phase.week = phase.week.replace(/Week (\d+)–(\d+)/, (match: string, start: string, end: string) => {
          return `Week ${Number(start) * 2 - 1}–${Number(end) * 2}`;
        });
      });
      cloned.hiringProbability = Math.max(10, cloned.hiringProbability - 5);
      cloned.summary += " Pacing extended to allow more hands-on practice.";
    } else if (lower.includes("fast") || lower.includes("speed") || lower.includes("accelerate") || lower.includes("quick")) {
      cloned.roadmap.forEach((phase: any) => {
        phase.week = phase.week.replace(/Week (\d+)–(\d+)/, (match: string, start: string, end: string) => {
          return `Week ${Math.max(1, Math.round(Number(start) / 2))}–${Math.max(1, Math.round(Number(end) / 2))}`;
        });
      });
      cloned.hiringProbability = Math.min(99, cloned.hiringProbability + 8);
      cloned.summary += " Pacing accelerated for an intensive study cycle.";
    }

    // 2. Keyword extraction for tech stack injection
    const stopWords = new Set(["focus", "more", "make", "this", "that", "want", "learn", "study", "path", "roadmap", "engineering", "development", "developer", "engineer", "build", "project", "pacing", "weeks", "months", "timeline", "level", "skills", "goal", "target"]);
    const words = lower.match(/\b[a-z]{3,15}\b/g) || [];
    const extractedTechs = words
      .filter(w => !stopWords.has(w))
      .map(w => w.charAt(0).toUpperCase() + w.slice(1));

    if (extractedTechs.length > 0) {
      // Add to suggested tech stack
      cloned.suggestedTechStack = Array.from(new Set([...cloned.suggestedTechStack, ...extractedTechs]));
      
      // Inject into roadmap steps
      cloned.roadmap.forEach((phase: any, index: number) => {
        const techToInject = extractedTechs[index % extractedTechs.length];
        
        phase.skills.push(`${techToInject} deployment`, `${techToInject} best practices`);
        phase.projects.unshift(`Build and deploy a ${techToInject}-based prototype matching your goal of ${goal}`);
        
        if (index === 1 || index === 3) {
          phase.title = `${phase.title} (with ${techToInject})`;
        }
      });
      
      cloned.summary += ` Integrated support for: ${extractedTechs.join(", ")}.`;
    } else {
      cloned.roadmap[0].title = `${cloned.roadmap[0].title} (Customized)`;
      cloned.roadmap[0].projects.unshift(`Custom project: ${customPrompt}`);
    }

    return cloned;
  }

  // Determine Track
  let track = "Full-Stack";
  let techStack: string[] = [];
  let roadmapPhases: any[] = [];
  let resources: any[] = [];
  let trendContext = "";

  if (normalizedGoal.match(/ai|ml|agent|mcp|rag|llm|pytorch|nlp|vision|voice|intelligence|reasoning/)) {
    track = "AI/ML Engineering";
    trendContext = "AI Agents, MCP Servers, and LangGraph are the hottest trends. Companies hiring for AI roles are looking for RAG, vector database tuning, and state-graph orchestration.";
    techStack = ["Python 3.11+", "LangGraph", "MCP Protocols", "ChromaDB / pgvector", "FastAPI", "Docker", "PyTorch"];
    resources = [
      { title: "LangChain Academy — AI Agent Courses", url: "https://academy.langchain.com", type: "Course" },
      { title: "DeepLearning.AI — Short AI Courses", url: "https://www.deeplearning.ai/short-courses/", type: "Course" },
      { title: "OpenAI Cookbook — Recipes & Examples", url: "https://cookbook.openai.com", type: "Docs" },
      { title: "LangGraph GitHub — Multi-Agent Framework", url: "https://github.com/langchain-ai/langgraph", type: "GitHub" },
      { title: "Andrej Karpathy — Neural Networks Zero to Hero", url: "https://www.youtube.com/@AndrejKarpathy", type: "YouTube" }
    ];
    roadmapPhases = [
      {
        week: "Week 1–2",
        title: "AI Foundations & Prompt Chaining",
        skills: ["Python async programming", "LLM APIs (OpenAI/Anthropic)", "Prompt engineering", "LangChain basics"],
        projects: [
          `Build an API bridge combining ${skills} with OpenAI chat models`,
          `Create a prompt-chaining research assistant targeting ${goal}`,
          "Implement a basic token rate-limit retry handler"
        ],
        urgency: 95
      },
      {
        week: "Week 3–4",
        title: "RAG Systems & Vector Databases",
        skills: ["ChromaDB / pgvector", "LlamaIndex integration", "Document chunks & embeddings", "Semantic search"],
        projects: [
          `Document Q&A engine for files using pgvector and ${skills}`,
          "Hybrid keyword-semantic search system",
          "Chunk evaluation pipeline with context overlap analysis"
        ],
        urgency: 90
      },
      {
        week: "Week 5–6",
        title: "Multi-Agent Orchestration with LangGraph",
        skills: ["LangGraph State Graphs", "Agent memory databases", "Tool calling & routing", "State transition machines"],
        projects: [
          `Multi-agent workflow automating tasks for ${goal}`,
          "Human-in-the-loop validation flow",
          "Hierarchical supervisor agent architecture"
        ],
        urgency: 98
      },
      {
        week: "Week 7–8",
        title: "Model Context Protocol & System Integrations",
        skills: ["MCP protocol specification", "Custom MCP server development", "SSE & JSON-RPC", "Cursor/Claude integration"],
        projects: [
          `Custom MCP server letting LLMs access your ${skills} data`,
          "Secure execution environment for agent commands",
          "Tool integration connecting LLMs to external databases"
        ],
        urgency: 93
      },
      {
        week: "Week 9–10",
        title: "MLOps, Tracing & Production Scaling",
        skills: ["LangSmith tracking", "Docker containerization", "Prometheus metrics", "Guardrails & safety"],
        projects: [
          "Set up evaluation runs and tracking with LangSmith",
          "Containerize agent loops using Docker multi-stage builds",
          "Implement Pydantic security guardrails to block prompt injections"
        ],
        urgency: 87
      },
      {
        week: "Week 11–12",
        title: "Capstone & Professional AI Portfolio",
        skills: ["GitHub portfolio development", "System design for AI apps", "Open-source contribution", "Production optimization"],
        projects: [
          `Capstone: Production-ready agent platform achieving ${goal}`,
          "Detailed architecture documentation with Mermaid diagrams",
          "Load testing agent endpoints with synthetic users"
        ],
        urgency: 100
      }
    ];
  } else if (normalizedGoal.match(/frontend|react|web|ui|ux|next|html|css|svelte|vue|angular|tailwindcss|javascript|typescript/)) {
    track = "Frontend Web Development";
    trendContext = "Modern web development is dominated by React Server Components (RSC) in Next.js 15, responsive Tailwind layouts, and state libraries like Zustand. Core web vitals and bundle optimizations are top priorities.";
    techStack = ["TypeScript", "Next.js 15", "React 19", "Zustand", "Tailwind CSS", "React Query", "Vercel"];
    resources = [
      { title: "Next.js official documentation", url: "https://nextjs.org/docs", type: "Docs" },
      { title: "React official documentation", url: "https://react.dev", type: "Docs" },
      { title: "Zustand State Manager GitHub", url: "https://github.com/pmndrs/zustand", type: "GitHub" },
      { title: "Jack Herrington — Frontend & React Tutorials", url: "https://www.youtube.com/@jherr", type: "YouTube" }
    ];
    roadmapPhases = [
      {
        week: "Week 1–2",
        title: "Advanced Tailwind CSS & Responsive UI Design",
        skills: ["Tailwind utilities", "CSS Grid & Flexbox", "Semantic HTML5", "Responsive design patterns"],
        projects: [
          `Build a highly-interactive UI dashboard matching your ${skills} skill profile`,
          "Design a responsive dark-themed landing page",
          "Implement accessible ARIA-compliant dropdowns and modals from scratch"
        ],
        urgency: 92
      },
      {
        week: "Week 3–4",
        title: "React 19 Hooks, Context & State Architecture",
        skills: ["React state & props", "Custom React hooks", "Context API", "React 19 transition APIs"],
        projects: [
          "Create a client-side filter engine with custom search hooks",
          `Develop a shopping cart UI utilizing React context and state hooks`,
          "Refactor legacy classes to modern functional components with hooks"
        ],
        urgency: 89
      },
      {
        week: "Week 5–6",
        title: "Next.js 15 App Router & Server Components",
        skills: ["Next.js App router", "React Server Components (RSC)", "Server Actions", "Static & Dynamic routing"],
        projects: [
          `Build a Next.js application that showcases your projects and goals of ${goal}`,
          "Integrate server actions for secure form submissions directly to backend databases",
          "Configure middleware to handle route protection and user sessions"
        ],
        urgency: 96
      },
      {
        week: "Week 7–8",
        title: "Zustand State Management & API Integration",
        skills: ["Zustand stores", "React Query / TanStack Query", "REST API integration", "Data fetching states"],
        projects: [
          "Create a persistent user-profile Zustand store with middleware storage mapping",
          `Build a dashboard fetching real-time dev data via React Query`,
          "Implement infinite scrolling and search queries with automatic pagination"
        ],
        urgency: 91
      },
      {
        week: "Week 9–10",
        title: "Component Libraries & Automated UI Testing",
        skills: ["Radix UI / Shadcn UI", "Jest testing framework", "React Testing Library", "Playwright E2E tests"],
        projects: [
          "Construct a modular UI library with custom themes and styling mappings",
          "Write unit tests verifying form validations and interactive triggers",
          "Configure Playwright to test critical login and payment flows in headless browser modes"
        ],
        urgency: 85
      },
      {
        week: "Week 11–12",
        title: "SEO, Web Vitals Optimization & Deployment",
        skills: ["Next.js image/font optimizations", "Dynamic imports & code splitting", "Vercel hosting", "SEO metadata"],
        projects: [
          `Capstone: Deploy a fully optimized Next.js app that achieves your goal of ${goal}`,
          "Achieve a 95+ score on Google Lighthouse by optimizing loading speeds",
          "Configure open-graph dynamic card generation to optimize social shares"
        ],
        urgency: 98
      }
    ];
  } else if (normalizedGoal.match(/backend|java|python|go|rust|node|api|django|spring|express|nest|graphql|rest|fastapi|server/)) {
    track = "Backend Systems Engineering";
    trendContext = "Backend development demands high throughput, structured API design (REST/GraphQL/gRPC), relational databases like PostgreSQL, caching mechanisms, and containerization with Docker.";
    techStack = ["Node.js / Go / Python", "PostgreSQL", "FastAPI / NestJS", "Redis", "gRPC / Protobuf", "Docker", "AWS"];
    resources = [
      { title: "FastAPI official documentation", url: "https://fastapi.tiangolo.com", type: "Docs" },
      { title: "Prisma ORM documentation", url: "https://www.prisma.io/docs", type: "Docs" },
      { title: "Hussein Nasser — Backend Engineering Course", url: "https://www.youtube.com/@hnasr", type: "YouTube" },
      { title: "Docker official documentation", url: "https://docs.docker.com", type: "Docs" }
    ];
    roadmapPhases = [
      {
        week: "Week 1–2",
        title: "Async Runtimes & Advanced Backend API Frameworks",
        skills: ["Async/await mechanisms", "FastAPI / NestJS routing", "Middleware development", "Request validations"],
        projects: [
          `Build a highly-structured backend API using ${skills}`,
          "Create a logging middleware tracking latency and request payloads",
          "Configure custom input schemas validating payloads with strict error messages"
        ],
        urgency: 93
      },
      {
        week: "Week 3–4",
        title: "Database Integration, ORMs & Schema Migrations",
        skills: ["PostgreSQL schema design", "SQL query optimization", "Database migrations", "ORM query builders"],
        projects: [
          `Design a relational database model matching your goal of ${goal}`,
          "Write optimized SQL queries handling complex relationships and analytical groupings",
          "Implement safe backward-compatible database schema migration paths"
        ],
        urgency: 90
      },
      {
        week: "Week 5–6",
        title: "Session Authentication & Secure API Architectures",
        skills: ["JWT authentication", "OAuth2 flows", "API key management", "CORS & Security headers"],
        projects: [
          "Build an authentication microservice with password hashing and tokens",
          `Develop a rate-limiting middleware protecting route access`,
          "Configure role-based access controls (RBAC) mapping permissions to backend API routes"
        ],
        urgency: 95
      },
      {
        week: "Week 7–8",
        title: "Caching Layers & Real-Time Server Communication",
        skills: ["Redis cache keys", "Data serialization", "WebSockets protocols", "Pub/Sub models"],
        projects: [
          "Implement Redis caching on heavy database query endpoints",
          "Create a real-time notification socket server handling clients",
          "Configure Redis Pub/Sub channels to sync data states between multiple running servers"
        ],
        urgency: 88
      },
      {
        week: "Week 9–10",
        title: "Containerization & Background Task Processors",
        skills: ["Dockerfiles", "Docker Compose", "Celery / BullMQ background tasks", "Task queues"],
        projects: [
          `Containerize your backend API stack utilizing Docker Compose`,
          "Implement a background task queue sending emails and compiling analytics",
          "Optimize Docker images using multi-stage builds to decrease size"
        ],
        urgency: 86
      },
      {
        week: "Week 11–12",
        title: "Production Deployment, Tracing & Capstone Portfolio",
        skills: ["AWS EC2/ECS", "Nginx reverse proxy", "OpenTelemetry tracing", "CI/CD deployment"],
        projects: [
          `Capstone: Deploy a highly-resilient backend architecture achieving ${goal}`,
          "Configure OpenTelemetry tracing to track latency issues in DB requests",
          "Set up automatic GitHub Actions pipelines deploying verified builds to servers"
        ],
        urgency: 97
      }
    ];
  } else if (normalizedGoal.match(/database|data|sql|clickhouse|postgres|db|nosql|analytics|etl|pipeline|warehouse/)) {
    track = "Database & Data Infrastructure";
    trendContext = "Data platforms require database query optimizations, distributed OLAP warehouses like ClickHouse for speed, pgvector for semantic database integrations, and robust ETL pipelines.";
    techStack = ["PostgreSQL", "ClickHouse", "Python / Pandas", "Apache Kafka", "Docker", "pgvector", "SQL"];
    resources = [
      { title: "PostgreSQL Tutorial & Advanced Indexing", url: "https://www.postgresqltutorial.com", type: "Docs" },
      { title: "ClickHouse documentation", url: "https://clickhouse.com/docs", type: "Docs" },
      { title: "Apache Kafka Quickstart", url: "https://kafka.apache.org/quickstart", type: "Docs" }
    ];
    roadmapPhases = [
      {
        week: "Week 1–2",
        title: "Relational Indexing & Advanced Query Tuning",
        skills: ["B-tree & GIN indexing", "EXPLAIN ANALYZE logs", "Common Table Expressions (CTE)", "Window functions"],
        projects: [
          `Optimize database queries mapping data profiles matching ${skills}`,
          "Create advanced SQL reports analyzing performance bottlenecks",
          "Refactor query patterns to use efficient indexes and avoid full-table scans"
        ],
        urgency: 91
      },
      {
        week: "Week 3–4",
        title: "Schema Design, Migrations & Distributed Models",
        skills: ["Database normalization", "Foreign key constraints", "Sharding & replication", "Migration scripts"],
        projects: [
          `Design a scalable schema modeling user requirements for ${goal}`,
          "Implement replica configurations syncing data states between primary and backup nodes",
          "Write backward-compatible database schema migration scripts"
        ],
        urgency: 87
      },
      {
        week: "Week 5–6",
        title: "OLAP & Columnar Databases for Big Data Analytics",
        skills: ["ClickHouse architecture", "MergeTree engines", "Materialized views", "Columnar queries"],
        projects: [
          "Set up ClickHouse to process and store billions of telemetry event streams",
          "Write materialized views mapping raw metrics to aggregated tables",
          "Configure data integration pipelines migrating cold data to S3 buckets"
        ],
        urgency: 94
      },
      {
        week: "Week 7–8",
        title: "Data Pipelines, Streaming & Message Queues",
        skills: ["Apache Kafka", "Kafka Producers & Consumers", "ETL concepts", "Python data processing"],
        projects: [
          "Build a real-time event pipeline consuming user updates and logs",
          "Implement a Python ETL script processing raw JSON logs to relational schemas",
          "Create a message streaming architecture mapping topics to database writes"
        ],
        urgency: 89
      },
      {
        week: "Week 9–10",
        title: "Vector Search & Cognitive Integrations",
        skills: ["pgvector extension", "HNSW indexes", "Cosine distance queries", "Embedding models"],
        projects: [
          "Configure pgvector to store and search for document vectors",
          "Build a search backend returning context matching query embeddings",
          "Tune vector search latency using specialized index architectures"
        ],
        urgency: 95
      },
      {
        week: "Week 11–12",
        title: "Database DevOps, Clustering & Capstone",
        skills: ["Docker containers for DBs", "Kubernetes StatefulSets", "DB monitoring & alerts", "Cloud backups"],
        projects: [
          `Capstone: Deploy a clustered database system matching the specs of ${goal}`,
          "Set up Grafana alerts warning of disk usages or slow queries",
          "Automate database daily backups deploying files to secure cloud vaults"
        ],
        urgency: 98
      }
    ];
  } else if (normalizedGoal.match(/devops|kubernetes|cloud|aws|docker|terraform|ci\/cd|git|ansible|gcp|serverless/)) {
    track = "DevOps & Infrastructure Engineering";
    trendContext = "Modern infrastructure depends on Infrastructure as Code (IaC) via Terraform, container orchestration using Kubernetes (k8s), automated CI/CD pipelines, and cloud platform monitoring tools.";
    techStack = ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus & Grafana", "AWS / GCP", "Shell Scripting"];
    resources = [
      { title: "Terraform official registry", url: "https://registry.terraform.io", type: "Docs" },
      { title: "Kubernetes interactive training docs", url: "https://kubernetes.io/docs/tutorials/", type: "Docs" },
      { title: "TechWorld with Nana — DevOps tutorials", url: "https://www.youtube.com/@TechWorldWithNana", type: "YouTube" }
    ];
    roadmapPhases = [
      {
        week: "Week 1–2",
        title: "Containerization & Shell Scripting",
        skills: ["Dockerfiles", "Docker multi-stage builds", "Alpine images optimization", "Docker Compose"],
        projects: [
          `Containerize applications written in ${skills}`,
          "Reduce production Docker image sizes by 80% using multi-stage compilations",
          "Set up a local multi-service testing suite utilizing Docker Compose"
        ],
        urgency: 93
      },
      {
        week: "Week 3–4",
        title: "Infrastructure as Code (IaC) with Terraform",
        skills: ["HashiCorp Configuration Language (HCL)", "Terraform providers", "Terraform state locks", "Modules design"],
        projects: [
          `Write Terraform modules deploying web servers on AWS or GCP`,
          "Configure remote state storage in cloud buckets with locking database structures",
          "Implement automatic resource teardown rules based on testing schedules"
        ],
        urgency: 90
      },
      {
        week: "Week 5–6",
        title: "Container Orchestration with Kubernetes (k8s)",
        skills: ["Pods & Deployments configs", "Kubernetes networking", "Ingress controllers", "ConfigMaps & Secrets"],
        projects: [
          "Deploy a scalable web cluster on a local Kubernetes cluster",
          "Configure Ingress rules mapping external domain requests to pods",
          "Implement secure configuration mappings separating secret keys from deployments"
        ],
        urgency: 97
      },
      {
        week: "Week 7–8",
        title: "CI/CD Deployment Automation Pipelines",
        skills: ["GitHub Actions workflow files", "GitLab CI runners", "Artifact storage", "Secure token mappings"],
        projects: [
          `Build a pipeline building Docker images and deploying them to registries`,
          "Configure automatic unit test running checking pull requests",
          "Configure secret environments deploying builds directly to production infrastructure"
        ],
        urgency: 91
      },
      {
        week: "Week 9–10",
        title: "Infrastructure Monitoring & Alert Dashboards",
        skills: ["Prometheus scraper configurations", "Grafana metric queries", "AlertManager alert rules", "Logging stacks"],
        projects: [
          "Set up Prometheus and Grafana dashboards reporting cluster statistics",
          "Configure alerts notifying developers of CPU spikes or failed database requests",
          "Construct a logging pipeline mapping standard outputs to unified databases"
        ],
        urgency: 86
      },
      {
        week: "Week 11–12",
        title: "GitOps Workflows & Capstone Portfolio",
        skills: ["ArgoCD configurations", "Secret vault integrations", "Kubernetes cluster security", "Production scaling"],
        projects: [
          `Capstone: Deploy a fully automated GitOps infrastructure for your goal of ${goal}`,
          "Integrate HashiCorp Vault managing application credentials",
          "Configure cluster autoscaling rules adapting to load surges"
        ],
        urgency: 98
      }
    ];
  } else {
    // Default Track: Full-Stack General Software Engineering
    track = "Full-Stack Software Engineering";
    trendContext = "Full-stack development demands proficiency in frontend UI frameworks (React/Next.js), typed programming languages (TypeScript), backend services (Node.js/Python), relational database schemas, and Docker.";
    techStack = ["TypeScript", "Next.js", "Node.js / Python", "PostgreSQL", "Docker", "Tailwind CSS", "GitHub Actions"];
    resources = [
      { title: "Next.js official documentation", url: "https://nextjs.org/docs", type: "Docs" },
      { title: "Full Stack Open Course — University of Helsinki", url: "https://fullstackopen.com/en/", type: "Course" },
      { title: "MDN Web Docs — Web development guides", url: "https://developer.mozilla.org", type: "Docs" }
    ];
    roadmapPhases = [
      {
        week: "Week 1–2",
        title: "Responsive Frontends & Modern CSS Layouts",
        skills: ["Tailwind CSS utility patterns", "CSS Flexbox & Grid models", "React functional components", "TypeScript typing"],
        projects: [
          `Build an interactive portfolio site mapping your skills in ${skills}`,
          "Design a responsive SaaS landing page with dark theme options",
          "Construct a reusable library of accessible form elements with TypeScript type checks"
        ],
        urgency: 92
      },
      {
        week: "Week 3–4",
        title: "React Core, Router & Client State Architecture",
        skills: ["React state triggers", "Context API stores", "Custom React hooks", "Client routing patterns"],
        projects: [
          "Build a task management page with state management and filters",
          "Create an API search hook fetching real-time repository listings",
          "Develop a user signup wizard with client-side form checking"
        ],
        urgency: 88
      },
      {
        week: "Week 5–6",
        title: "Next.js Framework & Server Integration",
        skills: ["Next.js App router routing", "React Server Components (RSC)", "Server Actions", "Metadata optimizations"],
        projects: [
          `Build a Next.js app to display project plans achieving ${goal}`,
          "Integrate Server Actions saving records directly to PostgreSQL backend layers",
          "Configure search indexing using routing options"
        ],
        urgency: 95
      },
      {
        week: "Week 7–8",
        title: "Backend Services, Database Models & ORMs",
        skills: ["PostgreSQL database schemas", "ORM queries with Prisma / Drizzle", "REST API development", "Validations"],
        projects: [
          "Design a database schema capturing relationships and configurations",
          `Develop API backend routes returning records mapped from DB tables`,
          "Configure relational models with safe database transaction pipelines"
        ],
        urgency: 90
      },
      {
        week: "Week 9–10",
        title: "Containerization & Continuous Integration pipelines",
        skills: ["Docker files configurations", "Docker Compose services", "GitHub Actions workflows", "API testing"],
        projects: [
          "Write multi-stage Dockerfiles compiling client builds and runtime images",
          "Create a local Docker Compose structure booting database servers and API containers",
          "Set up automatic test execution pipelines running on pull requests"
        ],
        urgency: 85
      },
      {
        week: "Week 11–12",
        title: "Deployment, Optimizations & Capstone Showcase",
        skills: ["Vercel and cloud deployments", "Redis API caching", "Lighthouse audit optimizations", "SEO optimizations"],
        projects: [
          `Capstone: Deploy a full-stack, production-ready web application fulfilling ${goal}`,
          "Implement Redis caching on heavy database endpoints to reduce response latencies",
          "Achieve a 90+ score across all Lighthouse performance audits"
        ],
        urgency: 98
      }
    ];
  }

  // Adjust duration interpolation in week labels if timeline is different from 3 months
  if (timeline !== "3 months") {
    const factor = timeline === "1 month" ? 0.33 : timeline === "2 months" ? 0.66 : timeline === "6 months" ? 2 : timeline === "1 year" ? 4 : 1;
    if (factor !== 1) {
      let currentWeekOffset = 1;
      roadmapPhases.forEach((phase, index) => {
        const weeksCount = Math.max(1, Math.round((index === 5 ? 2 : 2) * factor));
        const start = currentWeekOffset;
        const end = start + weeksCount - 1;
        phase.week = `Week ${start}–${end}`;
        currentWeekOffset = end + 1;
      });
    }
  }

  const hiringMap: Record<string, number> = {
    "1 month": 45,
    "2 months": 62,
    "3 months": 78,
    "6 months": 87,
    "1 year": 94,
  };

  return {
    summary: `Based on current market analysis, your ${level} background in ${skills} provides a strong foundation. The ${track} market is experiencing rapid expansion, making your goal of "${goal}" highly achievable with focused effort on the right technologies.`,
    trendContext,
    hiringProbability: hiringMap[timeline] || 78,
    roadmap: roadmapPhases,
    suggestedTechStack: techStack,
    learningResources: resources
  };
}
