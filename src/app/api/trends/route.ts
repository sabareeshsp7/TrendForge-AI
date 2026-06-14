import { NextRequest, NextResponse } from "next/server";
import { mockNewsArticles } from "@/lib/mockData";

const TRACKED_TECH = [
  // AI / ML
  { name: "AI Agents", keywords: ["ai agent", "agents", "autonomous agent", "agentic", "crewai", "autogen"], category: "AI/ML", color: "#6366f1", baseScore: 95, baseGrowth: 140 },
  { name: "MCP Servers", keywords: ["mcp", "model context protocol", "context protocol"], category: "AI/ML", color: "#0891b2", baseScore: 92, baseGrowth: 125 },
  { name: "LangGraph", keywords: ["langgraph", "crewai", "autogen", "orchestration"], category: "AI/ML", color: "#059669", baseScore: 88, baseGrowth: 95 },
  { name: "Vector Databases", keywords: ["vector database", "vector db", "chromadb", "pinecone", "pgvector", "milvus", "qdrant"], category: "AI/ML", color: "#d97706", baseScore: 86, baseGrowth: 82 },
  { name: "RAG Systems", keywords: ["rag", "retrieval-augmented", "retrieval augmented", "llamaindex", "embeddings"], category: "AI/ML", color: "#dc2626", baseScore: 89, baseGrowth: 78 },
  { name: "PyTorch", keywords: ["pytorch", "torch", "deep learning framework"], category: "AI/ML", color: "#ee4c2c", baseScore: 85, baseGrowth: 34 },
  
  // Languages
  { name: "TypeScript", keywords: ["typescript", "ts", "javascript", "js"], category: "Language", color: "#3178c6", baseScore: 91, baseGrowth: 45 },
  { name: "Python", keywords: ["python", "py", "pip"], category: "Language", color: "#3776ab", baseScore: 93, baseGrowth: 52 },
  { name: "Rust", keywords: ["rust", "rustlang", "cargo"], category: "Language", color: "#dea584", baseScore: 87, baseGrowth: 92 },
  { name: "Go (Golang)", keywords: ["golang", "go language", "go runtime"], category: "Language", color: "#00add8", baseScore: 83, baseGrowth: 38 },
  { name: "Zig", keywords: ["ziglang", "zig language", "zig compiler"], category: "Language", color: "#ec915f", baseScore: 68, baseGrowth: 105 },
  { name: "C++", keywords: ["c++", "cpp", "clang"], category: "Language", color: "#00599c", baseScore: 78, baseGrowth: 15 },

  // Web Dev & Frameworks
  { name: "Next.js", keywords: ["next.js", "nextjs", "react framework"], category: "Web Dev", color: "#f8fafc", baseScore: 89, baseGrowth: 40 },
  { name: "React", keywords: ["reactjs", "react.js", "jsx"], category: "Web Dev", color: "#61dafb", baseScore: 94, baseGrowth: 22 },
  { name: "Svelte", keywords: ["svelte", "sveltekit", "svelte.js"], category: "Web Dev", color: "#ff3e00", baseScore: 76, baseGrowth: 64 },
  { name: "FastAPI", keywords: ["fastapi", "fast api", "uvicorn"], category: "Web Dev", color: "#009688", baseScore: 81, baseGrowth: 48 },
  { name: "Bun.js", keywords: ["bun.js", "bun run", "bun runtime"], category: "Web Dev", color: "#db2777", baseScore: 74, baseGrowth: 86 },
  { name: "Node.js", keywords: ["nodejs", "node.js", "npm"], category: "Web Dev", color: "#339933", baseScore: 88, baseGrowth: 15 },

  // Databases
  { name: "PostgreSQL", keywords: ["postgresql", "postgres", "pgvector"], category: "Database", color: "#336791", baseScore: 90, baseGrowth: 30 },
  { name: "Redis", keywords: ["redis", "redislabs", "in-memory database"], category: "Database", color: "#d82c20", baseScore: 86, baseGrowth: 18 },
  { name: "MongoDB", keywords: ["mongodb", "mongo", "nosql"], category: "Database", color: "#47a248", baseScore: 79, baseGrowth: 10 },
  { name: "ClickHouse", keywords: ["clickhouse", "columnar database", "olap"], category: "Database", color: "#ffcc00", baseScore: 70, baseGrowth: 72 },
  { name: "SQLite", keywords: ["sqlite", "sqlite3", "libsql"], category: "Database", color: "#003b57", baseScore: 82, baseGrowth: 32 },

  // DevOps & Cloud
  { name: "Kubernetes", keywords: ["kubernetes", "k8s", "kubectl"], category: "DevOps", color: "#326ce5", baseScore: 88, baseGrowth: 25 },
  { name: "Docker", keywords: ["docker", "containerization", "dockerfile"], category: "DevOps", color: "#2496ed", baseScore: 92, baseGrowth: 12 },
  { name: "Terraform", keywords: ["terraform", "hcl", "infrastructure as code"], category: "DevOps", color: "#7b42bc", baseScore: 80, baseGrowth: 28 },
  { name: "Cloudflare", keywords: ["cloudflare", "wrangler", "cloudflare workers"], category: "DevOps", color: "#f38020", baseScore: 87, baseGrowth: 82 },
  { name: "AWS", keywords: ["aws", "amazon web services", "ec2", "s3"], category: "Cloud", color: "#ff9900", baseScore: 91, baseGrowth: 10 },
  { name: "Vercel", keywords: ["vercel", "next.js hosting"], category: "Cloud", color: "#0a0a0a", baseScore: 84, baseGrowth: 42 }
];

export async function GET(req: NextRequest) {
  try {
    const newsApiKey = process.env.NEWSAPI_KEY;
    const gnewsKey = process.env.GNEWS_API_KEY;
    let articles: any[] = [];

    // 1. Fetch live articles from NewsAPI/GNews (with cache matching api/news)
    if (newsApiKey && newsApiKey !== "your_newsapi_key_here") {
      try {
        const query = "React OR Next.js OR Rust OR Python OR TypeScript OR Kubernetes OR PostgreSQL OR Docker OR Terraform OR Cloudflare OR LLM OR AI Agents";
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=40&language=en&apiKey=${newsApiKey}`;
        const res = await fetch(url, { next: { revalidate: 1800 } });
        if (res.ok) {
          const data = await res.json();
          if (data.articles) {
            articles = data.articles;
          }
        }
      } catch (e) {
        console.error("Trends API: NewsAPI error:", e);
      }
    }

    if (articles.length === 0 && gnewsKey && gnewsKey !== "your_gnews_key_here") {
      try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent("technology programming development")}&lang=en&max=25&token=${gnewsKey}`;
        const res = await fetch(url, { next: { revalidate: 1800 } });
        if (res.ok) {
          const data = await res.json();
          if (data.articles) {
            articles = data.articles;
          }
        }
      } catch (e) {
        console.error("Trends API: GNews error:", e);
      }
    }

    if (articles.length === 0) {
      articles = mockNewsArticles;
    }

    // 2. Perform text analysis to count mentions of tech stacks in live articles
    const textCorpus = articles.map(a => `${a.title || ""} ${a.description || ""} ${a.content || ""}`.toLowerCase()).join(" ");

    const analyzedTech = TRACKED_TECH.map(tech => {
      let liveMentions = 0;
      tech.keywords.forEach(kw => {
        const regex = new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "gi");
        const matches = textCorpus.match(regex);
        if (matches) {
          liveMentions += matches.length;
        }
      });

      // Calculate dynamic stats
      const mentions = Math.round(tech.baseScore * 18 + liveMentions * 6 + Math.floor(Math.random() * 15));
      const growthRate = (tech.baseGrowth + liveMentions * 2) / 1000;
      const prev = Math.round(mentions / (1 + growthRate));
      const calculatedScore = Math.min(99, Math.round(tech.baseScore + Math.min(12, liveMentions * 0.7)));
      const growthPct = Math.round(((mentions - prev) / prev) * 100);

      return {
        name: tech.name,
        score: calculatedScore,
        growth: `+${growthPct}%`,
        growthVal: growthPct,
        mentions,
        prev,
        category: tech.category,
        color: tech.color
      };
    });

    // Sort by trend score desc
    analyzedTech.sort((a, b) => b.score - a.score);

    // 3. Compute domain radar chart data
    const domainCounts: Record<string, { count: number; total: number }> = {
      "AI/ML": { count: 0, total: 0 },
      "Cloud": { count: 0, total: 0 },
      "DevOps": { count: 0, total: 0 },
      "Web Dev": { count: 0, total: 0 },
      "Languages": { count: 0, total: 0 },
      "Databases": { count: 0, total: 0 },
    };

    // Distribute scores based on mentions in categories
    analyzedTech.forEach(tech => {
      let subject = "AI/ML";
      if (tech.category === "Cloud") subject = "Cloud";
      else if (tech.category === "DevOps") subject = "DevOps";
      else if (tech.category === "Web Dev") subject = "Web Dev";
      else if (tech.category === "Language") subject = "Languages";
      else if (tech.category === "Database") subject = "Databases";

      if (domainCounts[subject]) {
        domainCounts[subject].count += tech.mentions;
        domainCounts[subject].total += 1;
      }
    });

    const radarData = Object.entries(domainCounts).map(([subject, data]) => {
      let baseRadarScore = 70;
      if (subject === "AI/ML") baseRadarScore = 94;
      else if (subject === "Cloud") baseRadarScore = 86;
      else if (subject === "DevOps") baseRadarScore = 83;
      else if (subject === "Web Dev") baseRadarScore = 88;
      else if (subject === "Languages") baseRadarScore = 85;
      else if (subject === "Databases") baseRadarScore = 81;

      const computedScore = Math.min(99, Math.round(baseRadarScore + Math.min(10, data.count / 2000)));
      return {
        subject,
        score: computedScore
      };
    });

    // 4. Compute Stack Analytics (Bar Chart data)
    const techStackChart = analyzedTech.slice(0, 12).map(t => ({
      tech: t.name,
      mentions: t.mentions,
      prev: t.prev
    }));

    return NextResponse.json({
      trendingTech: analyzedTech,
      techStackChart,
      radarData,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Trends API Exception:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
