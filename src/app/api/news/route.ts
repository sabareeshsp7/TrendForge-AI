import { NextResponse } from "next/server";
import { mockNewsArticles } from "@/lib/mockData";

const AI_TECH_KEYWORDS = [
  "AI", "artificial intelligence", "machine learning", "LLM", "GPT", "agent", "MCP",
  "LangChain", "LangGraph", "RAG", "Azure", "OpenAI", "Anthropic", "Google AI",
  "cloud", "developer", "programming", "software", "framework", "API", "GitHub",
  "Python", "Rust", "TypeScript", "Next.js", "multimodal", "vector", "embedding"
];

function scoreImpact(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  let score = 50;
  const highImpact = ["openai", "gpt-4", "gpt-5", "claude-3", "ai agent", "mcp", "langgraph", "llama-3", "deepseek"];
  const medImpact = ["ai", "llm", "cloud", "developer", "github", "release", "launch", "foundry", "azure", "aws", "gcp"];
  highImpact.forEach(kw => { if (text.includes(kw)) score += 10; });
  medImpact.forEach(kw => { if (text.includes(kw)) score += 4; });
  return Math.min(99, score);
}

function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`;
  const found: string[] = [];
  const tagMap: Record<string, string> = {
    "openai": "OpenAI", "gpt": "GPT-4o", "mcp": "MCP",
    "langgraph": "LangGraph", "langchain": "LangChain", "rag": "RAG",
    "agent": "AI Agents", "claude": "Anthropic", "gemini": "Google AI",
    "deepseek": "DeepSeek", "rust": "Rust", "typescript": "TypeScript",
    "nextjs": "Next.js", "react": "React", "python": "Python",
    "github": "GitHub", "copilot": "Copilot", "kubernetes": "Kubernetes",
    "docker": "Docker", "terraform": "Terraform", "cloudflare": "Cloudflare",
    "postgres": "PostgreSQL", "redis": "Redis", "sqlite": "SQLite",
    "svelte": "Svelte", "bun": "Bun.js", "golang": "Go", "zig": "Zig"
  };
  const lower = text.toLowerCase();
  Object.entries(tagMap).forEach(([key, label]) => {
    if (lower.includes(key) && !found.includes(label)) found.push(label);
  });
  return found.slice(0, 4);
}

function categorize(title: string): string {
  const lower = title.toLowerCase();
  if (lower.match(/ai|llm|gpt|agent|mcp|rag|langchain|langgraph|openai|anthropic|gemini|deepseek/)) return "AI";
  if (lower.match(/azure|aws|gcp|cloud|kubernetes|docker|terraform|serverless|cloudflare/)) return "Cloud";
  if (lower.match(/postgres|pgvector|redis|mongo|clickhouse|sqlite|supabase|sql|database|db/)) return "Database";
  if (lower.match(/github|vscode|copilot|devops|ci\/cd|git|bun/)) return "Dev Tools";
  if (lower.match(/rust|python|typescript|javascript|golang|java|c\+\+|zig/)) return "Language";
  if (lower.match(/react|nextjs|vue|svelte|angular|css|html|tailwindcss/)) return "Web";
  return "Language";
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const published = new Date(dateString);
  const diffMs = now.getTime() - published.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHrs / 24);
  if (diffHrs < 1) return "just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${diffDays}d ago`;
}

export async function GET() {
  const newsApiKey = process.env.NEWSAPI_KEY;
  const gnewsKey = process.env.GNEWS_API_KEY;

  // Try NewsAPI first
  if (newsApiKey && newsApiKey !== "your_newsapi_key_here") {
    try {
      const query = "React OR Next.js OR Rust OR Python OR TypeScript OR Kubernetes OR PostgreSQL OR Docker OR Terraform OR Cloudflare OR LLM OR AI Agents";
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=30&language=en&apiKey=${newsApiKey}`;

      const res = await fetch(url, { next: { revalidate: 1800 } });
      if (res.ok) {
        const data = await res.json();
        if (data.articles?.length) {
          const articles = data.articles
            .filter((a: any) => a.title && a.description && !a.title.includes("[Removed]"))
            .map((a: any, i: number) => ({
              id: `newsapi-${i}`,
              title: a.title,
              source: a.source?.name || "NewsAPI",
              publishedAt: formatTimeAgo(a.publishedAt),
              url: a.url,
              impact: scoreImpact(a.title, a.description),
              tags: extractTags(a.title, a.description),
              summary: a.description,
              category: categorize(a.title),
              imageUrl: a.urlToImage,
            }));
          return NextResponse.json({ articles, source: "newsapi" });
        }
      }
    } catch (e) {
      console.error("NewsAPI error:", e);
    }
  }

  // Try GNews
  if (gnewsKey && gnewsKey !== "your_gnews_key_here") {
    try {
      const url = `https://gnews.io/api/v4/search?q=artificial+intelligence+technology&lang=en&max=20&token=${gnewsKey}`;
      const res = await fetch(url, { next: { revalidate: 1800 } });
      if (res.ok) {
        const data = await res.json();
        if (data.articles?.length) {
          const articles = data.articles.map((a: any, i: number) => ({
            id: `gnews-${i}`,
            title: a.title,
            source: a.source?.name || "GNews",
            publishedAt: formatTimeAgo(a.publishedAt),
            url: a.url,
            impact: scoreImpact(a.title, a.description),
            tags: extractTags(a.title, a.description),
            summary: a.description,
            category: categorize(a.title),
            imageUrl: a.image,
          }));
          return NextResponse.json({ articles, source: "gnews" });
        }
      }
    } catch (e) {
      console.error("GNews error:", e);
    }
  }

  // Fallback to mock data
  return NextResponse.json({ articles: mockNewsArticles, source: "mock" });
}
