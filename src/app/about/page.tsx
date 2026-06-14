import Link from "next/link";
import { Zap, Brain, Globe, Users, Award, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0B1020" }}>

      {/* Header */}
      <div style={{ background: "rgba(17,24,39,0.6)", borderBottom: "1px solid rgba(99,179,237,0.1)", padding: "24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: 6 }}>About</p>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            About TrendForge AI
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
            Real-time career intelligence powered by advanced LLM reasoning
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

        {/* Mission */}
        <div className="glass-card" style={{ padding: 40, marginBottom: 24, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #06b6d4, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 32px rgba(6,182,212,0.4)" }}>
            <Zap size={28} color="#fff" fill="#fff" />
          </div>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: 26, fontWeight: 800, color: "#f1f5f9", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Our Mission
          </h2>
          <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.8, maxWidth: 640, margin: "0 auto" }}>
            TrendForge AI was built to eliminate the guesswork from career planning. By combining
            live technology trend analysis with advanced LLM reasoning, we help developers,
            students, and professionals know exactly what to learn next — and why.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          {[
            { icon: <Brain size={20} color="#06b6d4" />, title: "LLM Reasoning", desc: "Advanced LLM orchestration for intelligent decision-making", color: "#06b6d4" },
            { icon: <Globe size={20} color="#8b5cf6" />, title: "Real-Time Data", desc: "Live feeds from NewsAPI, GitHub Trending, and Hacker News", color: "#8b5cf6" },
            { icon: <Target size={20} color="#10b981" />, title: "Personalized", desc: "Roadmaps tailored to your exact skills, goals, and timeline", color: "#10b981" },
            { icon: <Users size={20} color="#f59e0b" />, title: "Built For You", desc: "Students, professionals, and career-switchers alike", color: "#f59e0b" },
            { icon: <Award size={20} color="#f43f5e" />, title: "Hiring Insights", desc: "Probability scores based on real market hiring signals", color: "#f43f5e" },
            { icon: <Zap size={20} color="#06b6d4" />, title: "Fast & Free", desc: "Generate a complete roadmap in under 10 seconds", color: "#06b6d4" },
          ].map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: 22 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, border: `1px solid ${f.color}25` }}>{f.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack Used */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🛠️ Built With</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Next.js 16", "TypeScript", "Advanced LLM APIs", "NewsAPI", "GNews API", "Recharts", "Tailwind CSS", "Vercel"].map(t => (
              <span key={t} style={{ padding: "6px 14px", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#06b6d4" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Ready to forge your career path?</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/roadmap" className="btn-primary">Get My Roadmap</Link>
            <Link href="/trends" className="btn-secondary">Explore Trends</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
