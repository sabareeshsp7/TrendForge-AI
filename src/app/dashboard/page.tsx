"use client";

import { useEffect, useState } from "react";
import { mockTrendingTech, mockNewsArticles, mockTechStackChart } from "@/lib/mockData";
import {
  TrendingUp, Flame, Brain, Zap, ArrowUpRight,
  BarChart3, Newspaper, RefreshCw, Clock, ExternalLink
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart
} from "recharts";
import Link from "next/link";

const weeklyData = [
  { day: "Mon", ai: 1200, web: 900, db: 600 },
  { day: "Tue", ai: 1400, web: 1050, db: 680 },
  { day: "Wed", ai: 1900, web: 1200, db: 750 },
  { day: "Thu", ai: 1700, web: 1350, db: 820 },
  { day: "Fri", ai: 2100, web: 1600, db: 900 },
  { day: "Sat", ai: 2400, web: 1900, db: 980 },
  { day: "Sun", ai: 2800, web: 2100, db: 1100 },
];

function HeatBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="heat-bar">
        <div
          className="heat-bar-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

function TrendCard({ item, rank }: { item: typeof mockTrendingTech[0]; rank: number }) {
  const urgency = item.score >= 90 ? "🔥 Exploding" : item.score >= 80 ? "📈 Rising" : "⚡ Active";
  return (
    <div
      className="glass-card"
      style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}
    >
      <span style={{
        width: 28, height: 28, borderRadius: 8,
        background: rank <= 3 ? "linear-gradient(135deg,#6366f1,#06b6d4)" : "#f1f5f9",
        color: rank <= 3 ? "#fff" : "#64748b",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800, flexShrink: 0,
      }}>
        {rank}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>{item.name}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: item.color, background: `${item.color}18`, padding: "2px 8px", borderRadius: 999 }}>
            {urgency}
          </span>
        </div>
        <HeatBar score={item.score} color={item.color} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.category}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>{item.growth}</span>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#111827", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 12,
        padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}>
        <p style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 6, fontSize: 13 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newsItems, setNewsItems] = useState<any[]>(mockNewsArticles);
  const [trendingTech, setTrendingTech] = useState<any[]>(mockTrendingTech);
  const [chartData, setChartData] = useState<any[]>(mockTechStackChart);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch news
        const resNews = await fetch("/api/news");
        if (resNews.ok) {
          const data = await resNews.json();
          if (data.articles?.length) setNewsItems(data.articles);
        }

        // Fetch trends
        const resTrends = await fetch("/api/trends");
        if (resTrends.ok) {
          const data = await resTrends.json();
          if (data.trendingTech) setTrendingTech(data.trendingTech);
          if (data.techStackChart) setChartData(data.techStackChart);
        }
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      }
    }
    loadDashboardData();
  }, [refreshKey]);

  // Telemetry simulation: slight real-time fluctuations every 2.5 seconds to feel live
  useEffect(() => {
    const interval = setInterval(() => {
      setTrendingTech(prev =>
        prev.map(t => {
          const delta = (Math.random() - 0.5) * 0.4;
          const newScore = Math.max(10, Math.min(99, Number((t.score + delta).toFixed(2))));
          return { ...t, score: newScore };
        })
      );
      setChartData(prev =>
        prev.map(c => {
          const delta = Math.floor((Math.random() - 0.5) * 6);
          return { ...c, mentions: Math.max(10, c.mentions + delta) };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setRefreshKey(k => k + 1); }, 1200);
  };

  const topTech = trendingTech[0] || mockTrendingTech[0];
  const stats = [
    { label: "Trending Technologies", value: "47", change: "+12 today", icon: <TrendingUp size={18} color="#6366f1" />, bg: "#eef2ff", color: "#6366f1" },
    { label: "News Articles Analyzed", value: "1,284", change: "+89 this hour", icon: <Newspaper size={18} color="#0891b2" />, bg: "#ecfeff", color: "#0891b2" },
    { label: "AI Signals Processed", value: "8,921", change: "+340 today", icon: <Brain size={18} color="#d97706" />, bg: "#fffbeb", color: "#d97706" },
    { label: "Top Heat Score", value: `${topTech.score}`, change: topTech.name, icon: <Flame size={18} color="#dc2626" />, bg: "#fff1f2", color: "#dc2626" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0B1020" }}>

      {/* Header */}
      <div style={{ background: "rgba(17,24,39,0.6)", borderBottom: "1px solid rgba(99,179,237,0.1)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Live Intelligence</p>
            <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              Trend Dashboard
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Live</span>
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4 }}>
                <Clock size={12} style={{ display: "inline", marginRight: 4 }} />
                {time.toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: 13 }}
            >
              <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              Refresh
            </button>
            <Link href="/planner" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
              <Zap size={13} />
              Get Roadmap
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", fontFamily: "var(--font-outfit)" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginBottom: 1 }}>{s.change}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

          {/* Trending Tech Heat List */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p className="section-label" style={{ marginBottom: 2 }}>Heat Rankings</p>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>🔥 Trending Technologies</h2>
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Updated live</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }} key={refreshKey}>
              {trendingTech.slice(0, 8).map((item, i) => (
                <TrendCard key={item.name} item={item} rank={i + 1} />
              ))}
            </div>
          </div>

          {/* Weekly Trend Line Chart */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <p className="section-label" style={{ marginBottom: 4 }}>7-Day Signal Volume</p>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>📈 Tech Trend Wave</h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="gradAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradWeb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradDb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ai" name="AI & ML" stroke="#6366f1" strokeWidth={2} fill="url(#gradAI)" />
                  <Area type="monotone" dataKey="web" name="Web Dev" stroke="#0891b2" strokeWidth={2} fill="url(#gradWeb)" />
                  <Area type="monotone" dataKey="db" name="Databases" stroke="#059669" strokeWidth={2} fill="url(#gradDb)" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                {[{ color: "#6366f1", label: "AI & ML" }, { color: "#0891b2", label: "Web Dev" }, { color: "#059669", label: "Databases" }].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 3, background: l.color, borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Shift */}
            <div className="glass-card" style={{ padding: 24 }}>
              <p className="section-label" style={{ marginBottom: 4 }}>Industry Shift</p>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>⚡ Tech Relevance Meters</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "AI Agentic Development", score: 95, color: "#7c3aed" },
                  { label: "Modern Web Dev (RSC & Next.js)", score: 90, color: "#0891b2" },
                  { label: "Languages & Systems Programming (Rust/Go)", score: 86, color: "#6366f1" },
                  { label: "OLAP & Real-Time Databases (ClickHouse/Postgres)", score: 82, color: "#d97706" },
                  { label: "Cloud-Native DevOps (Kubernetes/IaC)", score: 84, color: "#10b981" },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#f1f5f9" }}>{m.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.score}%</span>
                    </div>
                    <HeatBar score={m.score} color={m.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Tech Stack Bar Chart + Latest News */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>

          {/* Bar chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <p className="section-label" style={{ marginBottom: 4 }}>Stack Analytics</p>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>📊 Tech Stack Mentions (This Week)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="tech" type="category" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="prev" name="Last Week" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                <Bar dataKey="mentions" name="This Week" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, background: "#6366f1", borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>This Week</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, background: "#e2e8f0", borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>Last Week</span>
              </div>
            </div>
          </div>

          {/* Latest News Ticker */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p className="section-label" style={{ marginBottom: 2 }}>Breaking</p>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>📰 Latest Signals</h2>
              </div>
              <Link href="/news" style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                All News <ArrowUpRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {newsItems.slice(0, 5).map((a, i) => (
                <div key={a.id} style={{
                  padding: "14px 0",
                  borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.4, flex: 1 }}>{a.title}</p>
                    <span style={{
                      flexShrink: 0, padding: "2px 8px", borderRadius: 999, fontSize: 11,
                      fontWeight: 700, background: a.impact >= 90 ? "#fff1f2" : "#f0fdf4",
                      color: a.impact >= 90 ? "#e11d48" : "#059669",
                    }}>
                      {a.impact}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{a.source}</span>
                    <span style={{ fontSize: 11, color: "#cbd5e1" }}>·</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{a.publishedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
