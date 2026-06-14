import Link from "next/link";
import {
  Zap, TrendingUp, Brain, Newspaper, BarChart3,
  ArrowRight, Sparkles, Globe, Activity, ChevronRight
} from "lucide-react";

const trendCards = [
  { name: "AI Agents", badge: "📈 Trending", score: 98, color: "#06b6d4", grow: "+142%" },
  { name: "MCP Servers", badge: "🔥 Rapid Growth", score: 94, color: "#3b82f6", grow: "+118%" },
  { name: "LangGraph", badge: "🚀 AI Workflow", score: 89, color: "#8b5cf6", grow: "+96%" },
  { name: "Vector Databases", badge: "⭐ Data & Retrieval", score: 87, color: "#f59e0b", grow: "+88%" },
  { name: "Multimodal AI", badge: "🧠 Rising Fast", score: 82, color: "#10b981", grow: "+71%" },
  { name: "OpenAI APIs", badge: "⚡ High Demand", score: 79, color: "#f43f5e", grow: "+63%" },
];

const marketCards = [
  {
    title: "Fastest Growing AI Skills",
    icon: <TrendingUp size={20} color="#06b6d4" />,
    color: "#06b6d4",
    items: ["Agentic AI Development", "RAG Systems & Vector DBs", "LangGraph Orchestration", "Prompt Engineering", "AI Workflow Automation"],
  },
  {
    title: "Most In-Demand Roles",
    icon: <Brain size={20} color="#8b5cf6" />,
    color: "#8b5cf6",
    items: ["AI Engineer", "AI Product Engineer", "AI Workflow Architect", "LLM Systems Engineer", "Cloud AI Developer"],
  },
  {
    title: "Technology Shift Alerts",
    icon: <Activity size={20} color="#f43f5e" />,
    color: "#f43f5e",
    items: ["Traditional frontend-only slowing", "Legacy enterprise SW declining", "Manual testing replaced by AI", "On-prem infra shifting to cloud", "REST-only APIs being replaced"],
  },
];

const features = [
  {
    icon: <TrendingUp size={22} color="#06b6d4" />,
    title: "Live Trend Intelligence",
    desc: "Real-time data from NewsAPI, Hacker News, GitHub Trending — surfacing what's exploding in tech right now.",
    badge: "Real-Time",
    accentColor: "rgba(6,182,212,0.1)",
    borderColor: "rgba(6,182,212,0.2)",
  },
  {
    icon: <Brain size={22} color="#8b5cf6" />,
    title: "Advanced AI Reasoning",
    desc: "State-of-the-art LLMs reason over live news to generate hyper-relevant, unbiased career strategies for you.",
    badge: "AI-Powered",
    accentColor: "rgba(139,92,246,0.1)",
    borderColor: "rgba(139,92,246,0.2)",
  },
  {
    icon: <Zap size={22} color="#f59e0b" />,
    title: "Adaptive Roadmaps",
    desc: "No static templates. Your roadmap updates dynamically based on today's hiring signals and market shifts.",
    badge: "Personalized",
    accentColor: "rgba(245,158,11,0.1)",
    borderColor: "rgba(245,158,11,0.2)",
  },
  {
    icon: <BarChart3 size={22} color="#10b981" />,
    title: "Tech Stack Analytics",
    desc: "Visual analytics of rising and declining technologies with Trend Heat Scores and Future Demand predictions.",
    badge: "Analytics",
    accentColor: "rgba(16,185,129,0.1)",
    borderColor: "rgba(16,185,129,0.2)",
  },
  {
    icon: <Newspaper size={22} color="#f43f5e" />,
    title: "News Intelligence Feed",
    desc: "Every article is impact-scored, tagged by technology, and filtered for career relevance in seconds.",
    badge: "Live News",
    accentColor: "rgba(244,63,94,0.1)",
    borderColor: "rgba(244,63,94,0.2)",
  },
  {
    icon: <Globe size={22} color="#06b6d4" />,
    title: "Hiring Probability Score",
    desc: "Based on market direction and your skill profile, get a % prediction of landing your target role.",
    badge: "Career Intel",
    accentColor: "rgba(6,182,212,0.1)",
    borderColor: "rgba(6,182,212,0.2)",
  },
];

const steps = [
  { n: "01", title: "Explore Live Trends", desc: "Browse real-time AI & tech signals from across the web" },
  { n: "02", title: "Enter Your Profile", desc: "Tell us your skills, target role, and available time" },
  { n: "03", title: "Azure AI Reasons", desc: "GPT-4o reasons over live trends + your profile" },
  { n: "04", title: "Get Your Roadmap", desc: "Week-by-week plan with projects, resources & hiring score" },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0B1020" }}>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "96px 24px 112px",
          background: "linear-gradient(160deg, #0B1020 0%, #0d1a2e 50%, #0B1020 100%)",
        }}
      >
        {/* Background glows */}
        <div style={{
          position: "absolute", top: -200, left: "10%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -100, right: "5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}>

            {/* Left — Text */}
            <div className="fade-in-up">
              {/* Live badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.25)",
                borderRadius: 999,
                padding: "6px 16px", marginBottom: 28,
              }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#06b6d4" }}>
                  Live — Tracking 47 tech signals right now
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  lineHeight: 1.1,
                  marginBottom: 24,
                  letterSpacing: "-0.03em",
                }}
              >
                Real-Time AI Career &{" "}
                <span className="gradient-text">Technology Intelligence</span>
              </h1>

              <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>
                TrendForge AI analyzes live technology trends, industry shifts, and AI innovations
                to generate{" "}
                <strong style={{ color: "#f1f5f9" }}>personalized future-ready learning roadmaps</strong>.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/roadmap" className="btn-primary" style={{ fontSize: 15 }}>
                  <Sparkles size={16} />
                  Generate My Roadmap
                </Link>
                <Link href="/trends" className="btn-secondary" style={{ fontSize: 15 }}>
                  Explore Live Trends
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
                {[
                  { val: "500+", label: "Signals Tracked" },
                  { val: "GPT-4o/Claude", label: "AI Reasoning Engine" },
                  { val: "Real-Time", label: "News Intel" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "var(--font-outfit)", fontSize: 22, fontWeight: 800, color: "#06b6d4" }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Animated Cards */}
            <div style={{ position: "relative", height: 460 }} className="hide-mobile">
              {/* Grid of floating tech cards */}
              {trendCards.map((card, i) => {
                const cols = [0, 1, 0, 1, 0, 1];
                const colX = cols[i] === 0 ? "8%" : "52%";
                const rowY = `${i < 2 ? (i * 48) : i < 4 ? (i * 44 + 10) : (i * 40 + 20)}px`;
                const animClass = i % 3 === 0 ? "float-a" : i % 3 === 1 ? "float-b" : "float-c";
                const delay = `${i * 0.4}s`;

                return (
                  <div
                    key={card.name}
                    className={animClass}
                    style={{
                      position: "absolute",
                      left: colX,
                      top: rowY,
                      width: "44%",
                      animationDelay: delay,
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(17,24,39,0.9)",
                        border: `1px solid ${card.color}30`,
                        borderRadius: 14,
                        padding: "14px 18px",
                        backdropFilter: "blur(10px)",
                        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${card.color}20`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: "#f1f5f9" }}>{card.name}</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: card.color, fontFamily: "var(--font-outfit)" }}>
                          {card.score}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{card.badge}</div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${card.score}%`,
                          background: `linear-gradient(90deg, ${card.color}88, ${card.color})`,
                          borderRadius: 99,
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginTop: 6 }}>{card.grow}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE TRENDING SECTION ── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(99,179,237,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Live Intelligence</p>
            <h2 style={{
              fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em",
            }}>
              🔥 Live Trending Technologies
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 10 }}>
              Updated in real-time from thousands of tech signals across the web
            </p>
          </div>

          {/* Horizontal scroll cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {trendCards.map((card) => (
              <div
                key={card.name}
                className="glass-card"
                style={{ padding: 22 }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>{card.name}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                    background: `${card.color}18`, color: card.color,
                    border: `1px solid ${card.color}30`,
                  }}>
                    {card.badge}
                  </span>
                </div>

                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{
                    height: "100%", width: `${card.score}%`,
                    background: `linear-gradient(90deg, ${card.color}80, ${card.color})`,
                    borderRadius: 99,
                  }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Trend Score: <strong style={{ color: "#f1f5f9" }}>{card.score}/100</strong></span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{card.grow}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/trends" className="btn-ghost">
              View Full Trend Analysis <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI MARKET INTELLIGENCE ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.03) 50%, transparent 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Market Intelligence</p>
            <h2 style={{
              fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em",
            }}>
              📊 AI Market Intelligence
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {marketCards.map((card) => (
              <div key={card.title} className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${card.color}15`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    border: `1px solid ${card.color}25`,
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{card.title}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {card.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: card.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Platform Features</p>
            <h2 style={{
              fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em",
            }}>
              Everything You Need to Stay{" "}
              <span className="gradient-text">Ahead of the Curve</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: f.accentColor, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    border: `1px solid ${f.borderColor}`,
                  }}>
                    {f.icon}
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 999, fontSize: 11,
                    fontWeight: 700, background: f.accentColor, color: "#94a3b8",
                    border: `1px solid ${f.borderColor}`,
                  }}>
                    {f.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        background: "linear-gradient(135deg, rgba(6,182,212,0.04) 0%, rgba(139,92,246,0.04) 100%)",
        borderTop: "1px solid rgba(99,179,237,0.08)",
        borderBottom: "1px solid rgba(99,179,237,0.08)",
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p className="section-label" style={{ marginBottom: 12 }}>How It Works</p>
          <h2 style={{
            fontFamily: "var(--font-outfit)", fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 800, color: "#f1f5f9", marginBottom: 56, letterSpacing: "-0.02em",
          }}>
            From Live News to Your Roadmap in Minutes
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "var(--gradient-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 20px rgba(6,182,212,0.4)",
                }}>
                  <span style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, fontSize: 16, color: "#fff" }}>{s.n}</span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.12) 100%)",
            border: "1px solid rgba(6,182,212,0.25)",
            borderRadius: 24, padding: "64px 40px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
              width: 600, height: 300,
              background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <p className="section-label" style={{ marginBottom: 16 }}>Get Started Free</p>
            <h2 style={{
              fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 4vw, 44px)",
              fontWeight: 800, color: "#f1f5f9", marginBottom: 16, letterSpacing: "-0.02em",
            }}>
              Ready to Forge Your{" "}
              <span className="gradient-text">AI-Powered Career?</span>
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 40, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 40px" }}>
              Stop guessing what to learn next. Let live market intelligence guide every step of your career.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/roadmap" className="btn-primary" style={{ fontSize: 15 }}>
                <Sparkles size={16} />
                Generate My Roadmap — Free
              </Link>
              <Link href="/trends" className="btn-secondary" style={{ fontSize: 15 }}>
                Explore Trends <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(99,179,237,0.08)", background: "rgba(0,0,0,0.2)", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#475569" }}>
          TrendForge AI · Powered by{" "}
          <strong style={{ color: "#06b6d4" }}>Advanced LLM Reasoning</strong> ·{" "}
          Real-Time Career & Technology Intelligence
        </p>
      </footer>
    </div>
  );
}
