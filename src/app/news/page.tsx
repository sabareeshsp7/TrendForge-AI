"use client";

import { useState, useEffect, useCallback } from "react";
import { mockNewsArticles } from "@/lib/mockData";
import { Newspaper, Search, Clock, ExternalLink, TrendingUp, RefreshCw, Loader2, Activity, Zap, BarChart2 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

const CATEGORIES = ["All", "AI", "Cloud", "Dev Tools", "Language", "Web", "Database"];

type TimeRange = "3h" | "24h" | "1w" | "1m";

interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  impact: number;
  tags: string[];
  summary: string;
  category: string;
  imageUrl: string | null;
  description?: string;
}

// Generate realistic trend data based on time range
function generateTrendData(range: TimeRange) {
  const now = Date.now();
  const points: { time: string; AI: number; Cloud: number; DevTools: number; Language: number; Database: number; peak?: boolean }[] = [];

  if (range === "3h") {
    for (let i = 18; i >= 0; i--) {
      const t = new Date(now - i * 10 * 60 * 1000);
      points.push({
        time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        AI: Math.round(60 + Math.sin(i * 0.5) * 25 + Math.random() * 20),
        Cloud: Math.round(35 + Math.cos(i * 0.4) * 15 + Math.random() * 12),
        DevTools: Math.round(22 + Math.sin(i * 0.6) * 10 + Math.random() * 8),
        Language: Math.round(45 + Math.sin(i * 0.3) * 15 + Math.random() * 10),
        Database: Math.round(30 + Math.cos(i * 0.5) * 12 + Math.random() * 8),
        peak: i === 5 || i === 12,
      });
    }
  } else if (range === "24h") {
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 60 * 60 * 1000);
      points.push({
        time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        AI: Math.round(80 + Math.sin(i * 0.4) * 40 + Math.random() * 25),
        Cloud: Math.round(50 + Math.cos(i * 0.35) * 20 + Math.random() * 15),
        DevTools: Math.round(30 + Math.sin(i * 0.5) * 12 + Math.random() * 10),
        Language: Math.round(60 + Math.sin(i * 0.3) * 25 + Math.random() * 18),
        Database: Math.round(45 + Math.cos(i * 0.45) * 18 + Math.random() * 12),
        peak: i === 8 || i === 18,
      });
    }
  } else if (range === "1w") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach((d, i) => {
      points.push({
        time: d,
        AI: Math.round(200 + i * 30 + Math.random() * 60),
        Cloud: Math.round(120 + i * 15 + Math.random() * 40),
        DevTools: Math.round(80 + i * 10 + Math.random() * 25),
        Language: Math.round(150 + i * 20 + Math.random() * 45),
        Database: Math.round(110 + i * 12 + Math.random() * 30),
        peak: i === 4,
      });
    });
  } else {
    const weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
    weeks.forEach((w, i) => {
      points.push({
        time: w,
        AI: Math.round(800 + i * 200 + Math.random() * 150),
        Cloud: Math.round(400 + i * 80 + Math.random() * 100),
        DevTools: Math.round(250 + i * 50 + Math.random() * 70),
        Language: Math.round(600 + i * 120 + Math.random() * 110),
        Database: Math.round(450 + i * 90 + Math.random() * 80),
        peak: i === 3,
      });
    });
  }
  return points;
}

// Peak analysis by time range
const PEAK_INSIGHTS: Record<TimeRange, { peak: string; growth: string; hotTech: string; insight: string }> = {
  "3h": {
    peak: "Last 30 min",
    growth: "+23%",
    hotTech: "AI Agents",
    insight: "AI Agents mentions spiked 23% in the last 30 minutes — likely triggered by a major product announcement.",
  },
  "24h": {
    peak: "9–11 AM UTC",
    growth: "+41%",
    hotTech: "MCP Servers",
    insight: "MCP Server discussion peaked during morning hours — correlates with GitHub repo launches and HN discussions.",
  },
  "1w": {
    peak: "Friday",
    growth: "+67%",
    hotTech: "LangGraph",
    insight: "LangGraph dominated this week following the v0.3 release — job postings for LangGraph rose 34% in 48 hours.",
  },
  "1m": {
    peak: "Week 4",
    growth: "+142%",
    hotTech: "AI Agents",
    insight: "AI Agents grew 142% this month. Orchestration frameworks like LangGraph and protocols like MCP are driving the surge in enterprise adoption.",
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#111827", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
        <p style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 6, fontSize: 12 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const impactColor = (score: number) => {
  if (score >= 90) return { color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.25)", label: "🔥 Critical" };
  if (score >= 80) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "📈 High" };
  return { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", label: "✅ Medium" };
};

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>(mockNewsArticles);
  const [filtered, setFiltered] = useState<Article[]>(mockNewsArticles);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveLoaded, setLiveLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [trendData, setTrendData] = useState(generateTrendData("24h"));
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchLiveNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        if (data.articles?.length) {
          setArticles(data.articles);
          setLiveLoaded(true);
        }
      }
    } catch {
      // fallback to mock
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  useEffect(() => { fetchLiveNews(); }, [fetchLiveNews]);

  // Auto-refresh every 60s if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLiveNews, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLiveNews]);

  // Update trend data when range changes
  useEffect(() => {
    setTrendData(generateTrendData(timeRange));
  }, [timeRange]);

  useEffect(() => {
    let result = articles;
    if (category !== "All") result = result.filter(a => a.category === category);
    if (search) result = result.filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
    setFiltered(result);
  }, [category, search, articles]);

  const peak = PEAK_INSIGHTS[timeRange];
  const ranges: { key: TimeRange; label: string }[] = [
    { key: "3h", label: "Last 3h" },
    { key: "24h", label: "Last 24h" },
    { key: "1w", label: "1 Week" },
    { key: "1m", label: "1 Month" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0B1020" }}>

      {/* Header */}
      <div style={{ background: "rgba(17,24,39,0.6)", borderBottom: "1px solid rgba(99,179,237,0.1)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Real-Time Intelligence</p>
            <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              📰 Tech News Intelligence Feed
            </h1>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
              {liveLoaded ? "✅ Live data" : "Curated signals"} · {filtered.length} articles ·
              Last updated {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => setAutoRefresh(v => !v)}
              style={{
                padding: "8px 14px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer",
                background: autoRefresh ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                color: autoRefresh ? "#10b981" : "#64748b",
                border: autoRefresh ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.2s",
              }}
            >
              <span className={autoRefresh ? "pulse-dot" : ""} style={{ marginRight: 6, display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: autoRefresh ? "#10b981" : "#475569", verticalAlign: "middle" }} />
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh"}
            </button>
            <button onClick={fetchLiveNews} disabled={loading} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }}>
              {loading ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Refreshing</> : <><RefreshCw size={13} /> Refresh</>}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px" }}>

        {/* ── TREND GRAPH PANEL ── */}
        <div className="glass-card" style={{ padding: 26, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(6,182,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={18} color="#06b6d4" />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>📊 News Signal Volume Analysis</h2>
                <p style={{ fontSize: 11, color: "#475569" }}>Mentions per category over time</p>
              </div>
            </div>

            {/* Time Range Selector */}
            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, border: "1px solid rgba(255,255,255,0.06)" }}>
              {ranges.map(r => (
                <button
                  key={r.key}
                  onClick={() => setTimeRange(r.key)}
                  style={{
                    padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: timeRange === r.key ? 700 : 500,
                    background: timeRange === r.key ? "rgba(6,182,212,0.15)" : "transparent",
                    color: timeRange === r.key ? "#06b6d4" : "#64748b",
                    cursor: "pointer",
                    border: timeRange === r.key ? "1px solid rgba(6,182,212,0.25)" : "1px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Peak insight */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginBottom: 20 }}>
            <div style={{ padding: "12px 16px", background: "rgba(6,182,212,0.06)", borderRadius: 10, border: "1px solid rgba(6,182,212,0.15)" }}>
              <p style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>📍 Peak Period</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#06b6d4" }}>{peak.peak}</p>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.06)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.15)" }}>
              <p style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>📈 Growth</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#10b981" }}>{peak.growth}</p>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(245,158,11,0.06)", borderRadius: 10, border: "1px solid rgba(245,158,11,0.15)" }}>
              <p style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>🔥 In Peak</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b" }}>{peak.hotTech}</p>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(244,63,94,0.06)", borderRadius: 10, border: "1px solid rgba(244,63,94,0.15)" }}>
              <p style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Articles</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f43f5e" }}>{filtered.length}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gAI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLang" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="AI" name="AI" stroke="#06b6d4" strokeWidth={2} fill="url(#gAI)" />
              <Area type="monotone" dataKey="Cloud" name="Cloud" stroke="#8b5cf6" strokeWidth={2} fill="url(#gCloud)" />
              <Area type="monotone" dataKey="DevTools" name="Dev Tools" stroke="#10b981" strokeWidth={2} fill="url(#gDev)" />
              <Area type="monotone" dataKey="Language" name="Language" stroke="#f59e0b" strokeWidth={2} fill="url(#gLang)" />
              <Area type="monotone" dataKey="Database" name="Database" stroke="#3b82f6" strokeWidth={2} fill="url(#gDb)" />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            {[{ color: "#06b6d4", label: "AI" }, { color: "#8b5cf6", label: "Cloud" }, { color: "#10b981", label: "Dev Tools" }, { color: "#f59e0b", label: "Language" }, { color: "#3b82f6", label: "Database" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 3, background: l.color, borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* AI Insight box */}
          <div className="insight-box" style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>
              <Zap size={13} color="#06b6d4" style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              <strong style={{ color: "#06b6d4" }}>AI Insight ({timeRange}): </strong>{peak.insight}
            </p>
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
            <input className="tf-input" style={{ paddingLeft: 36 }} placeholder="Search articles or technologies..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, border: "1px solid rgba(255,255,255,0.06)" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 14px", border: category === cat ? "1px solid rgba(6,182,212,0.25)" : "1px solid transparent",
                  borderRadius: 7, fontSize: 13, fontWeight: category === cat ? 700 : 400,
                  background: category === cat ? "rgba(6,182,212,0.15)" : "transparent",
                  color: category === cat ? "#06b6d4" : "#64748b", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── ARTICLE GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
          {filtered.map((article) => {
            const ic = impactColor(article.impact);
            return (
              <div key={article.id} className="glass-card" style={{ padding: 22, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: ic.bg, color: ic.color, border: `1px solid ${ic.border}` }}>
                    {ic.label}
                  </span>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.45, marginBottom: 10 }}>
                  {article.title}
                </h3>

                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, marginBottom: 14, flex: 1 }}>
                  {article.summary || article.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {article.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{article.source}</span>
                    <span style={{ fontSize: 12, color: "#1e293b" }}>·</span>
                    <span style={{ fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock size={11} /> {article.publishedAt}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <TrendingUp size={12} color={ic.color} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: ic.color }}>{article.impact}</span>
                    </div>
                    <a href={article.url} target="_blank" rel="noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#06b6d4", fontWeight: 600, textDecoration: "none", padding: "4px 10px", background: "rgba(6,182,212,0.08)", borderRadius: 6, border: "1px solid rgba(6,182,212,0.2)" }}>
                      Read <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <Newspaper size={40} color="#1e293b" style={{ marginBottom: 16 }} />
            <p style={{ color: "#475569", fontSize: 15 }}>No articles match your search.</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
