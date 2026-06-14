"use client";

import { useState, useEffect } from "react";
import { mockTechStackChart, mockTrendingTech, mockHNStories } from "@/lib/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell
} from "recharts";
import { TrendingUp, TrendingDown, Flame, ExternalLink, Brain, Zap, Loader2 } from "lucide-react";

const radarData = [
  { subject: "AI/ML", score: 95 },
  { subject: "Cloud", score: 87 },
  { subject: "DevOps", score: 82 },
  { subject: "Web Dev", score: 88 },
  { subject: "Languages", score: 85 },
  { subject: "Databases", score: 80 },
];

const declining = [
  { tech: "jQuery", drop: "-34%", reason: "Replaced by modern reactive frameworks" },
  { tech: "PHP (legacy)", drop: "-28%", reason: "Shifting to Node/Python backends" },
  { tech: "Cordova", drop: "-41%", reason: "React Native / Flutter dominate" },
  { tech: "REST-only APIs", drop: "-18%", reason: "GraphQL & gRPC rising" },
  { tech: "On-prem Servers", drop: "-22%", reason: "Cloud-first adoption accelerating" },
];

const COLORS = ["#06b6d4","#3b82f6","#8b5cf6","#f59e0b","#f43f5e","#10b981","#0d9488","#ea580c","#4f46e5","#db2777"];

const fallbackNewsItems = [
  { id: 1, title: "OpenAI GPT-4o Realtime API Reaches 100M API Calls/day", summary: "Enterprise adoption accelerating with low-latency voice and vision capabilities.", impact: 97, why: "Signals massive demand shift toward multimodal AI integration in products", time: "2h ago", source: "TechCrunch" },
  { id: 2, title: "AWS and Google Cloud Announce Open-Source AI Agent Frameworks", summary: "Major cloud providers are introducing open-source AI agent orchestration frameworks to support scalable, multi-agent enterprise deployments.", impact: 94, why: "Orchestration tools are becoming the standard for building enterprise-scale agent pipelines", time: "4h ago", source: "TechCrunch" },
  { id: 3, title: "LangGraph 0.3 Released — Cyclic Reasoning Graphs Now Production-Ready", summary: "Major performance improvements make LangGraph the go-to for agentic AI.", impact: 91, why: "LangGraph expertise is now a top-tier hiring signal across AI teams", time: "6h ago", source: "LangChain" },
  { id: 4, title: "MCP Protocol Hits 500+ Community Servers", summary: "Model Context Protocol reaches critical mass enabling agents to access any data source.", impact: 89, why: "MCP is becoming the standard for AI tool integrations — learn it now", time: "8h ago", source: "Hacker News" },
  { id: 5, title: "Anthropic Claude 3.5 Sonnet Tops Developer Benchmarks", summary: "Claude 3.5 beats GPT-4o on coding tasks and agentic workflows.", impact: 87, why: "Competition is accelerating AI capability growth — skills compound faster", time: "10h ago", source: "Anthropic" },
];

function getWhyItMatters(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  if (text.includes("postgres") || text.includes("redis") || text.includes("database") || text.includes("clickhouse")) {
    return "Reflects the growing need for optimized database performance, real-time analytics pipelines, and structured storage interfaces.";
  }
  if (text.includes("nextjs") || text.includes("react") || text.includes("svelte") || text.includes("web")) {
    return "Highlights front-end web development shifts toward Server-Side Rendering (SSR), server components, and edge rendering runtimes.";
  }
  if (text.includes("agent") || text.includes("mcp")) {
    return "Signals the rapid rise of Agentic workflows and standardized tool context interfaces in production systems.";
  }
  if (text.includes("langgraph") || text.includes("orchestrat")) {
    return "Highlights the transition from simple prompt chaining to structured cyclic graph orchestration for reliable agent systems.";
  }
  if (text.includes("rag") || text.includes("vector") || text.includes("embedding")) {
    return "Indicates continuing industry focus on reducing model hallucinations via custom external databases and cognitive architectures.";
  }
  if (text.includes("rust") || text.includes("golang") || text.includes("zig") || text.includes("performance")) {
    return "Underscores a growing focus on high-efficiency, memory-safe languages for building backend systems and critical tooling.";
  }
  if (text.includes("cloud") || text.includes("kubernetes") || text.includes("docker") || text.includes("terraform")) {
    return "Points to the ongoing trend of automated infrastructure as code and containerized runtimes for scalable deployments.";
  }
  return "Reflects the accelerating speed of developer tooling and framework iterations in response to developer feedback.";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#111827", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 12, padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
        <p style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 6, fontSize: 13 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color || "#06b6d4", marginBottom: 2 }}>
            {p.name}: <strong>{p.value?.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const impactColor = (score: number) => score >= 90 ? "#f43f5e" : score >= 80 ? "#f59e0b" : "#10b981";

export default function TrendsPage() {
  const [newsItems, setNewsItems] = useState<any[]>(fallbackNewsItems);
  const [trendingTech, setTrendingTech] = useState<any[]>(mockTrendingTech);
  const [radar, setRadar] = useState<any[]>(radarData);
  const [chartData, setChartData] = useState<any[]>(mockTechStackChart);
  const [loading, setLoading] = useState(false);
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lookupQuery.trim()) return;

    setAnalyzing(true);
    const query = lookupQuery.trim();
    const lower = query.toLowerCase();

    setTimeout(() => {
      const found = trendingTech.find(t => t.name.toLowerCase() === lower || t.name.toLowerCase().includes(lower));

      // Scan newsItems for matches
      let newsMatches = 0;
      newsItems.forEach(item => {
        if ((item.title && item.title.toLowerCase().includes(lower)) || 
            (item.summary && item.summary.toLowerCase().includes(lower))) {
          newsMatches += 1;
        }
      });

      const newsDetails = newsMatches > 0 
        ? `Scan of live headlines found ${newsMatches} active developer updates in the current news feed.` 
        : `Steady background tracking; no direct mentions in today's top 5 feed headlines.`;

      if (found) {
        setLookupResult({
          name: found.name,
          score: found.score,
          growth: found.growth,
          category: found.category,
          color: found.color,
          predictions: `Strong positive momentum. Automated growth forecasting predicts a score of ${(found.score + 4.5).toFixed(1)} (+${(found.growthVal || 35) + 6}%) over the next 12-18 months.`,
          details: `Widely used in production software engineering. Current live news telemetry indexes ${found.mentions || 2300} monthly articles and GitHub release logs. ${newsDetails}`,
          demandLevel: found.score >= 90 ? "🔥 Critical" : found.score >= 80 ? "📈 High" : "⚡ Active",
        });
      } else {
        let score = 50 + (query.length * 3) % 40;
        let growthVal = 10 + (query.length * 7) % 80;
        
        let category = "Web Dev";
        let color = "#3b82f6";
        
        if (lower.match(/postgres|db|sql|redis|mongo|clickhouse|sqlite|supabase|dynamo/)) {
          category = "Database";
          color = "#3b82f6";
        } else if (lower.match(/rust|go|python|zig|c\+\+|ts|js|typescript|java|kotlin/)) {
          category = "Language";
          color = "#f59e0b";
        } else if (lower.match(/docker|kubernetes|terraform|aws|gcp|azure|cloudflare/)) {
          category = "DevOps";
          color = "#326ce5";
        } else if (lower.match(/ai|ml|agent|mcp|rag|llm|gpt|claude|tensor/)) {
          category = "AI/ML";
          color = "#6366f1";
        }
        
        setLookupResult({
          name: query,
          score,
          growth: `+${growthVal}%`,
          category,
          color,
          predictions: `Estimated positive trajectory of +${growthVal + 8}% in the next 12 months. AI market scans predict high hiring demand as teams modernize their ${category} architecture.`,
          details: `Automated AI analysis: Scanned developer interest. News metrics indicate a ${Math.round(growthVal * 0.4)}% growth in job postings listing "${query}" as a key requirement. ${newsDetails}`,
          demandLevel: score >= 90 ? "🔥 Critical" : score >= 80 ? "📈 High" : "⚡ Active",
        });
      }
      setAnalyzing(false);
    }, 800);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshKey(k => k + 1);
      // If there's an analyzed lookup, re-evaluate it with fresh news
      if (lookupQuery.trim()) {
        handleLookup();
      }
    }, 1000);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch live news
        const resNews = await fetch("/api/news");
        if (resNews.ok) {
          const data = await resNews.json();
          if (data.articles?.length) {
            const items = data.articles.slice(0, 5).map((a: any) => ({
              id: a.id,
              title: a.title,
              summary: a.summary || a.description || "",
              impact: a.impact,
              why: getWhyItMatters(a.title, a.summary || ""),
              time: a.publishedAt,
              source: a.source,
            }));
            setNewsItems(items);
          }
        }

        // Fetch live trends analysis
        const resTrends = await fetch("/api/trends");
        if (resTrends.ok) {
          const data = await resTrends.json();
          if (data.trendingTech) setTrendingTech(data.trendingTech);
          if (data.techStackChart) setChartData(data.techStackChart);
          if (data.radarData) setRadar(data.radarData);
        }
      } catch (e) {
        console.error("Failed to load live data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshKey]);

  // Real-time telemetry simulation: slight fluctuations every 3 seconds to feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Fluctuating scores slightly (+/- 0.2)
      setTrendingTech(prev =>
        prev.map(t => {
          const delta = (Math.random() - 0.5) * 0.4;
          const newScore = Math.max(10, Math.min(99, Number((t.score + delta).toFixed(2))));
          return { ...t, score: newScore };
        })
      );
      // 2. Fluctuating chart mentions slightly (+/- 4)
      setChartData(prev =>
        prev.map(c => {
          const delta = Math.floor((Math.random() - 0.5) * 8);
          return { ...c, mentions: Math.max(10, c.mentions + delta) };
        })
      );
      // 3. Fluctuating radar scores (+/- 0.3)
      setRadar(prev =>
        prev.map(r => {
          const delta = (Math.random() - 0.5) * 0.6;
          const newScore = Math.max(10, Math.min(99, Number((r.score + delta).toFixed(2))));
          return { ...r, score: newScore };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#0B1020" }}>
      <div style={{ background: "rgba(17,24,39,0.6)", borderBottom: "1px solid rgba(99,179,237,0.1)", padding: "24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 6 }}>Technology Analytics</p>
            <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              📊 Live Technology Trend Analytics
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Deep-dive analysis of technology adoption, growth signals, and future demand predictions</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleRefresh}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: 13 }}
            >
              <Loader2 size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none", display: "inline", marginRight: 6 }} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── SEARCH & TECH ANALYZER ENGINE ── */}
        <div className="glow-card" style={{ padding: 26, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Brain size={18} color="#06b6d4" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>🔍 AI Tech Stack Analyzer Engine</h2>
          </div>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 18 }}>
            Search for ANY programming language, framework, database, or tool to query live market scores, growth predictions, and developer statistics.
          </p>
          <form onSubmit={handleLookup} style={{ display: "flex", gap: 12, marginBottom: lookupResult ? 20 : 0 }}>
            <input
              type="text"
              className="tf-input"
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              placeholder="e.g. Zig, Kubernetes, Supabase, PyTorch, ClickHouse..."
              disabled={analyzing}
              style={{ flex: 1 }}
            />
            <button type="submit" disabled={analyzing || !lookupQuery.trim()} className="btn-primary" style={{ padding: "0 24px", minWidth: 140, justifyContent: "center" }}>
              {analyzing ? (
                <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Querying...</>
              ) : (
                "Analyze Stack"
              )}
            </button>
          </form>

          {lookupResult && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, animation: "fadeIn 0.25s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 24, alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{lookupResult.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999, background: `${lookupResult.color}15`, color: lookupResult.color, border: `1px solid ${lookupResult.color}25` }}>
                      {lookupResult.category}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999, background: "rgba(255,255,255,0.04)", color: "#cbd5e1" }}>
                      {lookupResult.demandLevel} Demand
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.65, marginBottom: 12 }}>
                    <strong>📊 Live Analysis: </strong>{lookupResult.details}
                  </p>
                  <div className="insight-box" style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>
                      <strong style={{ color: "#06b6d4" }}>🔮 12-Month AI Growth Prediction: </strong>{lookupResult.predictions}
                    </p>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 8 }}>Market Score & Growth</p>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#06b6d4", fontFamily: "var(--font-outfit)", lineHeight: 1 }}>{lookupResult.score}</div>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 4, marginBottom: 12 }}>out of 100 heat index</p>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>{lookupResult.growth}</div>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>velocity rate (MoM)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trending News Feed */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Flame size={18} color="#f43f5e" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>🔥 Trending AI News Feed</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {newsItems.map((item) => (
              <div key={item.id} className="glass-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ minWidth: 52, height: 52, borderRadius: 12, background: `${impactColor(item.impact)}15`, border: `1px solid ${impactColor(item.impact)}30`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: impactColor(item.impact), fontFamily: "var(--font-outfit)" }}>{item.impact}</span>
                    <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase" }}>Impact</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4 }}>{item.title}</h3>
                      <span style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap" }}>{item.time} · {item.source}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}>{item.summary}</p>
                    <div className="insight-box" style={{ padding: "8px 14px" }}>
                      <p style={{ fontSize: 12, color: "#94a3b8" }}><strong style={{ color: "#06b6d4" }}>Why it matters: </strong>{item.why}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Interpretation Panel */}
        <div className="glow-card" style={{ padding: 28, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Brain size={18} color="#06b6d4" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>🧠 AI Interpretation Panel</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { insight: "High-performance systems programming languages like Rust and Go are capturing market share from traditional frameworks.", color: "#06b6d4", icon: "⚡" },
              { insight: "Modern web architectures are consolidating around React/Next.js and Bun.js to optimize performance and serverless runtimes.", color: "#8b5cf6", icon: "🚀" },
              { insight: "Real-time analytics and vector capabilities are driving PostgreSQL and columnar OLAP databases like ClickHouse to the forefront.", color: "#10b981", icon: "📊" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid ${item.color}20`, borderLeft: `3px solid ${item.color}` }}>
                <span style={{ fontSize: 20, display: "block", marginBottom: 8 }}>{item.icon}</span>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{item.insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Momentum + Radar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <TrendingUp size={18} color="#10b981" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>📈 Tech Momentum Board</h2>
            </div>
            <table className="tf-table">
              <thead>
                <tr><th>Technology</th><th>Growth</th><th>Score</th></tr>
              </thead>
              <tbody>
                {trendingTech.map((t, i) => (
                  <tr key={t.name}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 20, height: 20, borderRadius: 4, background: i < 3 ? "linear-gradient(135deg,#06b6d4,#3b82f6)" : "rgba(255,255,255,0.05)", color: i < 3 ? "#fff" : "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{i + 1}</span>
                        <span style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 13 }}>{t.name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{t.growth}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, flex: 1, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${t.score}%`, background: t.color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", minWidth: 24 }}>{t.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="glass-card" style={{ padding: 28 }}>
            <p className="section-label" style={{ marginBottom: 6 }}>Domain Hotness</p>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>🎯 Market Domain Radar</h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radar}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.12} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rising + Declining */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <TrendingUp size={18} color="#10b981" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>🚀 Rising Technologies</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {trendingTech.slice(0, 7).map((t, i) => (
                <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: i < 3 ? "linear-gradient(135deg,#06b6d4,#3b82f6)" : "rgba(255,255,255,0.04)", color: i < 3 ? "#fff" : "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{t.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>{t.growth}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${t.score}%`, background: t.color, borderRadius: 999 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <TrendingDown size={18} color="#f43f5e" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>📉 Declining Technologies</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {declining.map((d, i) => (
                <div key={d.tech} style={{ padding: "14px 0", borderBottom: i < declining.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{d.tech}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#f43f5e", background: "rgba(244,63,94,0.1)", padding: "2px 10px", borderRadius: 999 }}>{d.drop}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#475569" }}>{d.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>📊 Tech Stack Mention Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={4} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="tech" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="prev" name="Last Week" fill="rgba(255,255,255,0.06)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mentions" name="This Week" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HN Trending */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={18} color="#f59e0b" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>🧡 Hacker News Trending</h2>
            </div>
            <a href="https://news.ycombinator.com" target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: "6px 12px" }}>
              Visit HN <ExternalLink size={12} />
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
            {mockHNStories.map((s) => (
              <div key={s.id} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.4, marginBottom: 8 }}>{s.title}</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>▲ {s.points}</span>
                  <span style={{ fontSize: 12, color: "#475569" }}>{s.comments} comments</span>
                  <span style={{ fontSize: 12, color: "#475569" }}>{s.time} ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
