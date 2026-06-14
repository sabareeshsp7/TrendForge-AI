"use client";

import { useState } from "react";
import {
  Sparkles, User, Target, Clock, Loader2, CheckCircle,
  BookOpen, GitBranch, Play, FileText, TrendingUp, Zap, Award, Brain,
  MessageSquare, ChevronRight, ArrowRight
} from "lucide-react";

interface RoadmapStep {
  week: string;
  title: string;
  skills: string[];
  projects: string[];
  urgency: number;
}

interface RoadmapResult {
  summary: string;
  hiringProbability: number;
  roadmap: RoadmapStep[];
  suggestedTechStack: string[];
  learningResources: { title: string; url: string; type: string }[];
  trendContext: string;
}

const resourceIcons: Record<string, React.ReactNode> = {
  Course:  <BookOpen size={14} color="#06b6d4" />,
  Docs:    <FileText size={14} color="#3b82f6" />,
  YouTube: <Play size={14} color="#f43f5e" />,
  GitHub:  <GitBranch size={14} color="#94a3b8" />,
};

const roles = [
  "AI Engineer",
  "Full Stack AI Developer",
  "Cloud Engineer",
  "Data Analyst",
  "AI Product Developer",
  "ML Engineer",
  "AI Workflow Architect",
  "Backend Developer",
];

const domains = [
  "AI & Machine Learning",
  "Cloud & DevOps",
  "Full Stack Development",
  "Data Engineering",
  "Cybersecurity",
  "Mobile Development",
];

const learningStyles = [
  "Project-based learning",
  "Video courses + docs",
  "Reading books / papers",
  "Bootcamp-style sprints",
];

const PROMPT_SUGGESTIONS = [
  "I know Python and SQL. I want to become an AI Engineer in 3 months.",
  "I'm a frontend dev wanting to add AI skills for better job prospects.",
  "I'm a student with basic ML knowledge targeting AI internships.",
  "I have cloud experience and want to specialise in Azure AI Foundry.",
  "I want to switch from data analysis to building LLM applications.",
];

export default function RoadmapPage() {
  const [screen, setScreen] = useState<"prompt" | "form" | "result">("prompt");
  const [promptText, setPromptText] = useState("");
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState("3 months");
  const [level, setLevel] = useState("intermediate");
  const [domain, setDomain] = useState("AI & Machine Learning");
  const [learningStyle, setLearningStyle] = useState("Project-based learning");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [error, setError] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customizing, setCustomizing] = useState(false);

  const handleCustomize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || !result) return;
    setCustomizing(true);
    setError("");

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          goal,
          timeline,
          level,
          customPrompt,
          currentRoadmap: result
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to customize roadmap");
      }

      const data = await res.json();
      setResult(data);
      setCustomPrompt("");
    } catch (err: any) {
      setError(err.message || "Customization failed. Please try again.");
    } finally {
      setCustomizing(false);
    }
  };

  const handlePromptSubmit = () => {
    if (!promptText.trim()) return;
    // Auto-parse the prompt to pre-fill fields
    const lower = promptText.toLowerCase();
    if (lower.includes("python")) setSkills(prev => prev || "Python");
    if (lower.includes("sql")) setSkills(prev => prev ? prev + ", SQL" : "SQL");
    if (lower.includes("frontend") || lower.includes("react")) setSkills(prev => prev ? prev + ", React, JavaScript" : "React, JavaScript");
    if (lower.includes("ml") || lower.includes("machine learning")) setSkills(prev => prev ? prev + ", Machine Learning" : "Machine Learning basics");
    if (lower.includes("cloud") || lower.includes("azure")) setSkills(prev => prev ? prev + ", Azure, Cloud" : "Azure, Cloud");
    if (lower.includes("data")) setSkills(prev => prev ? prev + ", Data Analysis" : "Data Analysis");

    // Set goal from prompt
    if (lower.includes("ai engineer")) setGoal("AI Engineer");
    else if (lower.includes("full stack")) setGoal("Full Stack AI Developer");
    else if (lower.includes("intern")) setGoal("AI Engineer");
    else if (lower.includes("cloud")) setGoal("Cloud Engineer");
    else if (lower.includes("data")) setGoal("Data Analyst");
    else setGoal("AI Engineer");

    // Set timeline
    if (lower.includes("3 month")) setTimeline("3 months");
    else if (lower.includes("6 month")) setTimeline("6 months");
    else if (lower.includes("1 year")) setTimeline("1 year");
    else if (lower.includes("1 month")) setTimeline("1 month");

    setScreen("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim() || !goal.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, goal, timeline, level }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate roadmap");
      }

      const data = await res.json();
      setResult(data);
      setScreen("result");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Check your AI engine configuration.");
    } finally {
      setLoading(false);
    }
  };

  const urgencyColor = (u: number) =>
    u >= 90 ? "#f43f5e" : u >= 80 ? "#f59e0b" : "#10b981";
  const urgencyLabel = (u: number) =>
    u >= 90 ? "Critical" : u >= 80 ? "High Priority" : "Recommended";

  return (
    <div style={{ minHeight: "100vh", background: "#0B1020" }}>

      {/* Header */}
      <div style={{ background: "rgba(17,24,39,0.6)", borderBottom: "1px solid rgba(99,179,237,0.1)", padding: "24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p className="section-label" style={{ marginBottom: 6 }}>AI Career Intelligence</p>
            <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              🧠 AI Roadmap Generator
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
              Powered by Advanced LLM Reasoning · Live technology trend awareness
            </p>
          </div>
          {screen !== "prompt" && (
            <button onClick={() => { setScreen("prompt"); setResult(null); setError(""); }} className="btn-ghost">
              ← New Roadmap
            </button>
          )}
        </div>
      </div>

      {/* ── SCREEN 1: PROMPT ── */}
      {screen === "prompt" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }} className="fade-in">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 0 40px rgba(6,182,212,0.35)" }}>
              <MessageSquare size={30} color="#fff" />
            </div>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: 32, fontWeight: 800, color: "#f1f5f9", marginBottom: 14, letterSpacing: "-0.02em" }}>
              Tell me about yourself &{" "}
              <span className="gradient-text">your goal</span>
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7 }}>
              Describe your current skills and where you want to go. I'll analyze live tech trends and build you a personalized roadmap.
            </p>
          </div>

          {/* Prompt Input */}
          <div className="glow-card" style={{ padding: 28, marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 10 }}>
              Your situation in plain English
            </label>
            <textarea
              className="tf-input"
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder="e.g. I know Python and SQL. I want to become an AI Engineer in 3 months and land a job at a tech startup..."
              rows={4}
              style={{ resize: "none", fontSize: 15, lineHeight: 1.7 }}
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handlePromptSubmit(); }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>Ctrl+Enter to continue</span>
              <button
                onClick={handlePromptSubmit}
                disabled={!promptText.trim()}
                className="btn-primary"
                style={{ padding: "10px 24px" }}
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Suggestion chips */}
          <div>
            <p style={{ fontSize: 12, color: "#475569", marginBottom: 12, textAlign: "center" }}>Or try one of these:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PROMPT_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setPromptText(s); }}
                  style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, padding: "12px 16px", textAlign: "left", cursor: "pointer",
                    fontSize: 13, color: "#94a3b8", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.3)"; (e.currentTarget as HTMLElement).style.color = "#f1f5f9"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                >
                  <Sparkles size={13} color="#06b6d4" style={{ flexShrink: 0 }} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SCREEN 2: FORM ── */}
      {screen === "form" && (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 28, alignItems: "start" }}>

            {/* LEFT: Input Panel */}
            <div style={{ position: "sticky", top: 88 }}>
              <div className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(6,182,212,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(6,182,212,0.2)" }}>
                    <User size={18} color="#06b6d4" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Your Profile</h2>
                    <p style={{ fontSize: 12, color: "#64748b" }}>Review and adjust your details</p>
                  </div>
                </div>

                {/* Prompt preview */}
                {promptText && (
                  <div className="insight-box" style={{ marginBottom: 20, padding: "10px 14px" }}>
                    <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                      <strong style={{ color: "#06b6d4" }}>Your prompt: </strong>{promptText}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Current Skills *</label>
                    <textarea className="tf-input" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Python, SQL, basic ML..." rows={3} required style={{ resize: "vertical" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                      <Target size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                      Target Role *
                    </label>
                    <select className="tf-input" value={goal} onChange={e => setGoal(e.target.value)} required>
                      <option value="">Select a target role...</option>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Custom goal (optional)</label>
                    <textarea className="tf-input" placeholder="Or describe your own goal..." rows={2} onChange={e => { if (e.target.value) setGoal(e.target.value); }} style={{ resize: "vertical" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                        <Clock size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                        Time Available
                      </label>
                      <select className="tf-input" value={timeline} onChange={e => setTimeline(e.target.value)}>
                        <option value="1 month">1 Month</option>
                        <option value="2 months">2 Months</option>
                        <option value="3 months">3 Months</option>
                        <option value="6 months">6 Months</option>
                        <option value="1 year">1 Year</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                        <TrendingUp size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                        Experience
                      </label>
                      <select className="tf-input" value={level} onChange={e => setLevel(e.target.value)}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Preferred Domain</label>
                    <select className="tf-input" value={domain} onChange={e => setDomain(e.target.value)}>
                      {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Learning Style</label>
                    <select className="tf-input" value={learningStyle} onChange={e => setLearningStyle(e.target.value)}>
                      {learningStyles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {error && (
                    <div style={{ padding: "12px 16px", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, fontSize: 13, color: "#fb7185" }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>
                    {loading
                      ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating with AI...</>
                      : <><Sparkles size={16} /> Generate My Roadmap</>
                    }
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: Preview / Loading */}
            <div>
              {loading && (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(6,182,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 0 32px rgba(6,182,212,0.2)" }}>
                    <Brain size={32} color="#06b6d4" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>Azure AI is Working...</h3>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>Fetching live tech trends → Reasoning with GPT-4o → Building your personalized roadmap</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                    {["Analyzing trends...", "Mapping skill gaps...", "Generating roadmap..."].map((s, i) => (
                      <span key={i} style={{ fontSize: 12, color: "#06b6d4", background: "rgba(6,182,212,0.08)", padding: "4px 14px", borderRadius: 999, border: "1px solid rgba(6,182,212,0.2)" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !result && (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                  <Sparkles size={36} color="rgba(6,182,212,0.3)" style={{ marginBottom: 16 }} />
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>Your Roadmap Will Appear Here</h3>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>Fill in your profile on the left and click <strong style={{ color: "#06b6d4" }}>Generate My Roadmap</strong></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SCREEN 3: RESULT ── */}
      {screen === "result" && result && (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }} className="fade-in">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Summary + Hiring Score */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 20 }}>
              <div className="glass-card" style={{ padding: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Zap size={18} color="#06b6d4" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>AI Analysis Summary</h2>
                </div>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75 }}>{result.summary}</p>
                {result.trendContext && (
                  <div className="insight-box" style={{ marginTop: 14 }}>
                    <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>
                      <strong style={{ color: "#06b6d4" }}>Live Trend Context: </strong>{result.trendContext}
                    </p>
                  </div>
                )}
              </div>

              <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
                <Award size={20} color="#f59e0b" style={{ marginBottom: 10 }} />
                <div style={{
                  width: 90, height: 90, borderRadius: "50%", margin: "0 auto 12px",
                  background: `conic-gradient(#06b6d4 ${result.hiringProbability * 3.6}deg, rgba(255,255,255,0.04) 0deg)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 0 8px rgba(17,24,39,1) inset, 0 0 24px rgba(6,182,212,0.3)",
                }}>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>
                    {result.hiringProbability}%
                  </span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>Hiring Probability</p>
                <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Based on market data</p>
              </div>
            </div>

            {/* Roadmap Steps */}
            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <TrendingUp size={18} color="#06b6d4" />
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>📍 Your Personalized Roadmap</h2>
              </div>
              {result.roadmap.map((step, i) => (
                <div key={i} className="roadmap-step">
                  <div className="roadmap-dot">{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>{step.week}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${urgencyColor(step.urgency)}15`, color: urgencyColor(step.urgency), border: `1px solid ${urgencyColor(step.urgency)}30` }}>
                        {urgencyLabel(step.urgency)} · {step.urgency}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{step.title}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Skills to Learn</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {step.skills.map(s => <span key={s} className="tag tag-cyan">{s}</span>)}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Projects to Build</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {step.projects.map(p => (
                            <div key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <CheckCircle size={12} color="#10b981" />
                              <span style={{ fontSize: 12, color: "#94a3b8" }}>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Stack + Resources */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>⚙️ Suggested Tech Stack</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.suggestedTechStack.map(t => (
                    <span key={t} style={{ padding: "6px 14px", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#06b6d4" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>📚 Learning Resources</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {result.learningResources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {resourceIcons[r.type] || <BookOpen size={14} />}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{r.title}</p>
                        <p style={{ fontSize: 11, color: "#475569" }}>{r.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Customization Panel */}
            <div className="glow-card" style={{ padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Brain size={18} color="#06b6d4" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>⚙️ Request AI Roadmap Customization</h3>
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16 }}>
                Ask the AI to adjust the pacing (e.g. "make it slower"), focus on a specific language (e.g. "focus more on Python/Rust"), or target a specific concept.
              </p>
              <form onSubmit={handleCustomize} style={{ display: "flex", gap: 12 }}>
                <input
                  type="text"
                  className="tf-input"
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Focus more on Python backend and Docker deployments..."
                  disabled={customizing}
                  style={{ flex: 1 }}
                />
                <button type="submit" disabled={customizing || !customPrompt.trim()} className="btn-primary" style={{ padding: "0 24px", minWidth: 150, justifyContent: "center" }}>
                  {customizing ? (
                    <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Adapting...</>
                  ) : (
                    "Apply Changes"
                  )}
                </button>
              </form>
            </div>

            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <button onClick={() => { setScreen("prompt"); setResult(null); setError(""); setPromptText(""); }} className="btn-secondary">
                Generate Another Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 1024px) {
          .roadmap-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
