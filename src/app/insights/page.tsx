"use client";

import { TrendingUp, TrendingDown, Brain, Zap, AlertTriangle, Layers } from "lucide-react";

const risingSkills = [
  { skill: "AI Agent Development & MLOps", growth: "+142%", demand: 98, category: "AI/ML", hot: true },
  { skill: "Rust Systems Programming", growth: "+95%", demand: 92, category: "Languages", hot: true },
  { skill: "Kubernetes & Cloud-Native DevOps", growth: "+88%", demand: 89, category: "DevOps", hot: true },
  { skill: "Next.js 15 & React Server Components", growth: "+82%", demand: 94, category: "Web Dev", hot: false },
  { skill: "ClickHouse & OLAP Analytics Databases", growth: "+78%", demand: 85, category: "Databases", hot: false },
  { skill: "Go Microservices & gRPC APIs", growth: "+74%", demand: 87, category: "Languages", hot: false },
  { skill: "Vector Database Tuning & RAG Architecture", growth: "+89%", demand: 90, category: "AI/ML", hot: false },
  { skill: "Cloudflare Workers & Serverless Edge Run", growth: "+86%", demand: 88, category: "Cloud", hot: false },
];

const decliningSkills = [
  { skill: "Cordova / PhoneGap Mobile Wrappers", decline: "-41%", risk: 88 },
  { skill: "Traditional jQuery DOM Manipulation", decline: "-34%", risk: 82 },
  { skill: "Manual CI/CD Scripting & Build Pipelines", decline: "-31%", risk: 79 },
  { skill: "Legacy PHP 5.x Backend Systems", decline: "-28%", risk: 76 },
  { skill: "On-premise Hardware Server Administration", decline: "-22%", risk: 65 },
  { skill: "REST-only APIs without GraphQL or gRPC", decline: "-18%", risk: 58 },
];

const automationRisks = [
  { area: "Boilerplate code generation", risk: 91, label: "Critical Risk", color: "#f43f5e" },
  { area: "Unit test skeleton writing", risk: 88, label: "High Risk", color: "#f43f5e" },
  { area: "Basic CRUD database handlers", risk: 78, label: "High Risk", color: "#f43f5e" },
  { area: "API documentation & typing", risk: 72, label: "High Risk", color: "#f43f5e" },
  { area: "Manual PR code review checkoffs", risk: 65, label: "Medium Risk", color: "#f59e0b" },
  { area: "Figma to HTML/CSS translation", risk: 55, label: "Medium Risk", color: "#f59e0b" },
  { area: "Distributed system database clustering", risk: 28, label: "Low Risk", color: "#10b981" },
  { area: "Orchestration & cloud-native topology", risk: 15, label: "Low Risk", color: "#10b981" },
];

const emergingStacks = [
  {
    name: "Modern Full-Stack",
    color: "#10b981",
    techs: ["Next.js 15", "TypeScript", "React Server Components", "Supabase / PostgreSQL", "TailwindCSS"],
    desc: "Highly-performant web applications with responsive design and serverless edge databases.",
    growth: "+88%",
  },
  {
    name: "High-Performance Systems",
    color: "#ff9900",
    techs: ["Rust / Go", "WebAssembly", "ClickHouse", "gRPC / Protobuf", "Docker"],
    desc: "Low-latency systems optimized for high throughput, telemetry, and columnar OLAP analytics.",
    growth: "+94%",
  },
  {
    name: "AI & Data Orchestration",
    color: "#06b6d4",
    techs: ["Python / FastAPI", "LangGraph", "MCP Protocols", "pgvector / SQLite", "PyTorch"],
    desc: "Agentic context platforms and cognitive loops backed by vectorized database engines.",
    growth: "+142%",
  },
  {
    name: "Cloud-Native DevOps",
    color: "#8b5cf6",
    techs: ["Kubernetes (k8s)", "Terraform IaC", "Docker Containers", "Cloudflare Workers", "AWS S3/EC2"],
    desc: "Scalable infrastructure and edge networks with automated multi-region deployment paths.",
    growth: "+86%",
  },
];

const rolePredictions = [
  { role: "AI Orchestration Systems Engineer", trajectory: "🚀 Explosive Growth", forecast: "+340% job postings in 12 months, building agentic pipelines", color: "#06b6d4" },
  { role: "Rust / Go Platform Systems Engineer", trajectory: "🔥 Hottest New Role", forecast: "+240% demand for writing memory-safe, ultra-low-latency backend architectures", color: "#f43f5e" },
  { role: "Cloud-Native DevOps Architect", trajectory: "⭐ Enterprise Focus", forecast: "+195% demand for multi-cloud Kubernetes orchestration and security mesh", color: "#8b5cf6" },
  { role: "OLAP & Data Infrastructure Engineer", trajectory: "📈 Rapid Rise", forecast: "+180% demand for ClickHouse, pgvector, and distributed databases", color: "#f59e0b" },
  { role: "Traditional Frontend Dev (no AI tooling)", trajectory: "⚠️ Slowing", forecast: "+12% growth, prompt automation reducing manual layout boilerplate writing", color: "#64748b" },
  { role: "Junior CRUD Developer", trajectory: "📉 Declining", forecast: "-15% as LLMs fully generate basic REST API boilerplate and mock tests", color: "#475569" },
];

export default function InsightsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0B1020" }}>

      {/* Header */}
      <div style={{ background: "rgba(17,24,39,0.6)", borderBottom: "1px solid rgba(99,179,237,0.1)", padding: "24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: 6 }}>Enterprise Intelligence</p>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            📊 AI Career Insights
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
            Future skill predictions, automation risks, and emerging tech stacks — powered by market intelligence
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

        {/* Rising vs Declining Skills */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>

          {/* Rising */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={18} color="#10b981" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>🚀 Rising Skills — Learn These Now</h2>
                <p style={{ fontSize: 11, color: "#475569" }}>Highest market velocity & hiring demand</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {risingSkills.map((s) => (
                <div key={s.skill}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{s.skill}</span>
                      {s.hot && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: "rgba(244,63,94,0.15)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.25)" }}>
                          🔥 HOT
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>{s.growth}</span>
                      <span style={{ fontSize: 11, color: "#475569", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 6 }}>{s.category}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.demand}%`, background: "linear-gradient(90deg, #10b981, #06b6d4)", borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>Demand score: {s.demand}/100</div>
                </div>
              ))}
            </div>
          </div>

          {/* Declining */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(244,63,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingDown size={18} color="#f43f5e" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>📉 Declining Skills — Pivot Away</h2>
                <p style={{ fontSize: 11, color: "#475569" }}>Market interest & hiring demand falling</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {decliningSkills.map((s) => (
                <div key={s.skill}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{s.skill}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#f43f5e", background: "rgba(244,63,94,0.1)", padding: "2px 10px", borderRadius: 999 }}>{s.decline}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${100 - s.risk}%`, background: "rgba(244,63,94,0.3)", borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>Relevance remaining: {100 - s.risk}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Automation Risk */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={18} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>⚠️ AI Automation Risk Assessment</h2>
              <p style={{ fontSize: 11, color: "#475569" }}>Which tasks are most at risk of AI replacement in the next 2 years</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {automationRisks.map((item) => (
              <div key={item.area} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid ${item.color}20` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{item.area}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: item.color, background: `${item.color}15`, padding: "2px 8px", borderRadius: 999, border: `1px solid ${item.color}25` }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.risk}%`, background: item.color, borderRadius: 99, opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 5 }}>Automation probability: {item.risk}%</div>
              </div>
            ))}
          </div>
          <div className="insight-box" style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
              <strong style={{ color: "#06b6d4" }}>Key Insight: </strong>
              Basic repetitive coding tasks show increasing automation risk, but higher-level skills like system architecture and AI orchestration remain low-risk and increasingly valuable. Focus on skills that require judgment, creativity, and domain expertise.
            </p>
          </div>
        </div>

        {/* Emerging Tech Stacks */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Layers size={18} color="#06b6d4" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>⚙️ Emerging Tech Stack Suggestions</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {emergingStacks.map((stack) => (
              <div key={stack.name} className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{stack.name}</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>{stack.growth}</span>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 14 }}>{stack.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {stack.techs.map(t => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: `${stack.color}12`, color: stack.color, border: `1px solid ${stack.color}25` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Trajectory Predictions */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <Brain size={18} color="#8b5cf6" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>🔮 Role Trajectory Predictions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {rolePredictions.map((r, i) => (
              <div key={r.role} style={{ padding: "18px 0", borderBottom: i < rolePredictions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: r.color }}>{r.role}</span>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{r.trajectory}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{r.forecast}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Zap size={14} color={r.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
