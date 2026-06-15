"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, User, Target, Clock, Loader2, CheckCircle,
  BookOpen, Play, FileText, TrendingUp, Zap, Award, Brain,
  MessageSquare, ArrowRight, ShieldAlert, Users, Layers,
  Settings, Database, Calendar, ChevronRight, RefreshCw, BarChart2, Check, Lock, AlertCircle
} from "lucide-react";
import {
  SYNTHETIC_WORK_SIGNALS,
  SYNTHETIC_SEMANTIC_MODEL,
  SYNTHETIC_KNOWLEDGE_DOCS,
  SYNTHETIC_LEARNER_PERFORMANCE,
  GroundedQuestion,
  WorkActivitySignal,
  SemanticCertification
} from "@/lib/syntheticData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

interface SimulatedResult {
  agentChatLog: { agent: string; message: string }[];
  curator: {
    reasoning: string;
    skills: string[];
    citations: string[];
  };
  planner: {
    reasoning: string;
    schedule: { week: string; title: string; hours: number; topics: string[] }[];
    workloadAdjustment: string;
  };
  engagement: {
    reasoning: string;
    reminderTiming: string;
    focusWindows: string;
  };
  assessment: {
    reasoning: string;
    questions: GroundedQuestion[];
  };
  manager: {
    reasoning: string;
    teamRisk: "High" | "Medium" | "Low";
    completionLikelihood: number;
    readinessSummary: string;
  };
}

const AGENT_META: Record<string, { color: string; icon: React.ReactNode }> = {
  "Curator Agent": { color: "#06b6d4", icon: <BookOpen size={14} /> },
  "Planner Agent": { color: "#3b82f6", icon: <Calendar size={14} /> },
  "Engagement Agent": { color: "#eab308", icon: <Clock size={14} /> },
  "Assessment Agent": { color: "#a855f7", icon: <Award size={14} /> },
  "Manager Insights Agent": { color: "#10b981", icon: <Users size={14} /> }
};

export default function AgentsPage() {
  const [selectedEmpId, setSelectedEmpId] = useState("EMP-001");
  const [selectedCertId, setSelectedCertId] = useState("AZ-204");
  const [customNotes, setCustomNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"agents" | "analytics" | "docs">("agents");
  const [result, setResult] = useState<SimulatedResult | null>(null);
  
  // Real-time animation states
  const [activeAgentNode, setActiveAgentNode] = useState<string | null>(null);
  const [visibleChatLogs, setVisibleChatLogs] = useState<{ agent: string; message: string }[]>([]);
  const [orchestratorStep, setOrchestratorStep] = useState<"idle" | "chatting" | "done">("idle");
  const [calendarSynced, setCalendarSynced] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Quiz interactive states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Live Manager Dashboard state
  const [managerMetrics, setManagerMetrics] = useState({
    avgStudyTime: 21.0,
    passRate: 68,
    failures: 32,
    activeCandidates: 6,
    performanceList: [...SYNTHETIC_LEARNER_PERFORMANCE]
  });

  // Sync selected cert alignment based on selected employee role
  useEffect(() => {
    const emp = SYNTHETIC_WORK_SIGNALS.find(e => e.employee_id === selectedEmpId);
    if (emp) {
      if (emp.role === "Cloud Engineer") setSelectedCertId("AZ-204");
      else if (emp.role === "DevOps Engineer") setSelectedCertId("AZ-400");
      else if (emp.role === "Data Engineer") setSelectedCertId("DP-203");
      else if (emp.role === "Solutions Architect") setSelectedCertId("AZ-305");
    }
  }, [selectedEmpId]);

  const runOrchestration = async () => {
    setLoading(true);
    setResult(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setCalendarSynced(false);
    setVisibleChatLogs([]);
    setOrchestratorStep("chatting");

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmpId,
          certificationId: selectedCertId,
          customNotes
        })
      });

      if (!response.ok) throw new Error("Failed to fetch orchestrator results");
      const data: SimulatedResult = await response.json();

      // Step-by-step real-time agent dialogue simulation
      for (let i = 0; i < data.agentChatLog.length; i++) {
        const log = data.agentChatLog[i];
        setActiveAgentNode(log.agent);
        setVisibleChatLogs(prev => [...prev, log]);
        await new Promise(r => setTimeout(r, 2000)); // 2s pause per agent step
      }

      setResult(data);
      setOrchestratorStep("done");
      setActiveAgentNode(null);
    } catch (err: any) {
      console.error(err);
      setOrchestratorStep("idle");
      setActiveAgentNode(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qId: string, idx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: idx }));
  };

  const submitQuiz = () => {
    if (!result) return;
    let correctCount = 0;
    result.assessment.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / result.assessment.questions.length) * 100);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    // Dynamic manager metrics update
    const candidateName = SYNTHETIC_WORK_SIGNALS.find(e => e.employee_id === selectedEmpId)?.name || "New Candidate";
    const passed = finalScore >= 75;
    
    // Check if employee already exists in list to avoid duplicates
    const listContains = managerMetrics.performanceList.some(p => p.name === candidateName);
    let newList = [...managerMetrics.performanceList];
    
    if (!listContains) {
      newList.push({
        learner_id: `L-MOCK-${Math.floor(Math.random() * 1000)}`,
        name: candidateName,
        role: SYNTHETIC_WORK_SIGNALS.find(e => e.employee_id === selectedEmpId)?.role || "Engineer",
        certification: selectedCertId,
        practice_score_avg: finalScore,
        hours_studied: passed ? 24 : 12,
        exam_outcome: passed ? "Pass" : "Fail"
      });
    } else {
      newList = newList.map(p => {
        if (p.name === candidateName) {
          return {
            ...p,
            practice_score_avg: finalScore,
            exam_outcome: passed ? "Pass" : "Fail"
          };
        }
        return p;
      });
    }

    const totalCount = newList.length;
    const passCount = newList.filter(p => p.exam_outcome === "Pass").length;
    const newPassRate = Math.round((passCount / totalCount) * 100);

    setManagerMetrics(prev => ({
      ...prev,
      passRate: newPassRate,
      failures: 100 - newPassRate,
      activeCandidates: totalCount,
      performanceList: newList
    }));
  };

  // Outlook block focus handler
  const blockOutlookSlots = () => {
    setCalendarSynced(true);
    setTimeout(() => {
      setShowCalendarModal(true);
    }, 400);
  };

  // Recharts configurations
  const barChartData = managerMetrics.performanceList.map(p => ({
    name: p.name,
    hours: p.hours_studied,
    score: p.practice_score_avg
  }));

  const pieData = [
    { name: "Pass Rate", value: managerMetrics.passRate, color: "#10b981" },
    { name: "Fail/Retake Rate", value: managerMetrics.failures, color: "#f43f5e" }
  ];

  const empContext = SYNTHETIC_WORK_SIGNALS.find(e => e.employee_id === selectedEmpId);
  const certContext = SYNTHETIC_SEMANTIC_MODEL.certifications.find(c => c.id === selectedCertId);

  return (
    <div style={{ minHeight: "100vh", background: "#0B1020", color: "#f1f5f9" }}>
      
      {/* Visual background elements */}
      <div style={{ position: "absolute", top: 100, left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: 300, right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(139,92,246,0.03) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Title Header */}
      <div style={{ background: "rgba(17, 24, 39, 0.7)", borderBottom: "1px solid rgba(99, 179, 237, 0.1)", padding: "28px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.15em" }}>Microsoft Foundry Challenge</span>
            <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginTop: 4 }}>
              🧠 Reasoning Agents <span className="gradient-text">Enterprise Workspace</span>
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
              State-of-the-art interactive workspace demonstrating real-time agent grounding and reasoning orchestration.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setActiveTab("agents")}
              className={activeTab === "agents" ? "btn-primary" : "btn-ghost"}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "10px 16px" }}
            >
              <Brain size={15} /> Agent Sandbox
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={activeTab === "analytics" ? "btn-primary" : "btn-ghost"}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "10px 16px" }}
            >
              <BarChart2 size={15} /> Manager Dashboard
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={activeTab === "docs" ? "btn-primary" : "btn-ghost"}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "10px 16px" }}
            >
              <Database size={15} /> Knowledge base
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 10 }}>
        
        {/* Tab 1: Agent Sandbox */}
        {activeTab === "agents" && (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 32, alignItems: "start" }}>
            
            {/* Control Sidebar */}
            <div className="glass-card" style={{ padding: 26, position: "sticky", top: 100 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                <Settings size={18} color="#06b6d4" />
                <h2 style={{ fontSize: 17, fontWeight: 700 }}>Orchestrator Settings</h2>
              </div>

              {/* Fictional Profile Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                  Select Learner (Work IQ context)
                </label>
                <select
                  className="tf-input"
                  value={selectedEmpId}
                  onChange={e => setSelectedEmpId(e.target.value)}
                  style={{ width: "100%" }}
                  disabled={orchestratorStep === "chatting"}
                >
                  {SYNTHETIC_WORK_SIGNALS.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Details of Selected Employee */}
              {empContext && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 12 }}>
                  <div style={{ color: "#64748b", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                    Current Workload Telemetry
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#94a3b8" }}>Meeting Volume:</span>
                    <span style={{ fontWeight: 600, color: empContext.meeting_hours_per_week > 20 ? "#f43f5e" : "#f1f5f9" }}>
                      {empContext.meeting_hours_per_week}h/week
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#94a3b8" }}>Focus Hours Available:</span>
                    <span style={{ fontWeight: 600, color: "#10b981" }}>{empContext.focus_hours_per_week}h/week</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Preferred Focus slot:</span>
                    <span style={{ fontWeight: 600, color: "#06b6d4" }}>{empContext.preferred_learning_slot}</span>
                  </div>
                </div>
              )}

              {/* Target Certification */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                  Target Certification (Fabric IQ semantic match)
                </label>
                <select
                  className="tf-input"
                  value={selectedCertId}
                  onChange={e => setSelectedCertId(e.target.value)}
                  style={{ width: "100%" }}
                  disabled={orchestratorStep === "chatting"}
                >
                  {SYNTHETIC_SEMANTIC_MODEL.certifications.map(cert => (
                    <option key={cert.id} value={cert.id}>
                      {cert.id} — {cert.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Directives */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                  Pacing Directive (Custom Prompts)
                </label>
                <textarea
                  className="tf-input"
                  rows={3}
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="e.g., extend study time buffer, focus on security elements..."
                  style={{ resize: "none", width: "100%" }}
                  disabled={orchestratorStep === "chatting"}
                />
              </div>

              {/* Trigger Button */}
              <button
                onClick={runOrchestration}
                disabled={orchestratorStep === "chatting"}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 14 }}
              >
                {orchestratorStep === "chatting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                    Running Orchestration...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Run Real-Time Pipeline
                  </>
                )}
              </button>
            </div>

            {/* Simulation Canvas */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              
              {/* Node Graph Visualization */}
              <div className="glass-card" style={{ padding: 24, background: "rgba(11,16,32,0.4)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Agent Coordination topology</h3>
                
                {/* SVG Visual Lines Container */}
                <div style={{ position: "relative", height: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
                  <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
                    <defs>
                      <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 50,50 Q 150,20 280,50 T 500,50 T 720,50"
                      fill="none"
                      stroke="url(#gradient-line)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      style={{ animation: orchestratorStep === "chatting" ? "pulseFlow 2s linear infinite" : "" }}
                    />
                  </svg>

                  {Object.entries(AGENT_META).map(([agentName, meta]) => {
                    const isActive = activeAgentNode === agentName;
                    return (
                      <div
                        key={agentName}
                        style={{
                          position: "relative", zIndex: 1, width: 64, height: 64, borderRadius: "50%",
                          background: "#0f172a", border: `2px solid ${isActive ? meta.color : "rgba(255,255,255,0.08)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: isActive ? `0 0 20px ${meta.color}50` : "none",
                          transition: "all 0.3s"
                        }}
                      >
                        <div style={{ color: isActive ? meta.color : "#64748b" }}>
                          {meta.icon}
                        </div>
                        <span style={{ position: "absolute", bottom: -22, width: 80, textAlign: "center", fontSize: 9, fontWeight: 700, color: isActive ? meta.color : "#475569" }}>
                          {agentName.replace(" Agent", "")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Agent Chat Logs */}
              {visibleChatLogs.length > 0 && (
                <div className="glass-card" style={{ padding: 24, background: "rgba(11, 16, 32, 0.6)", display: "flex", flexDirection: "column", gap: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 8 }}>
                    <MessageSquare size={16} color="#06b6d4" /> Agentic Negotiation Dialogue
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: 300, overflowY: "auto" }}>
                    {visibleChatLogs.map((log, idx) => {
                      const meta = AGENT_META[log.agent];
                      return (
                        <div key={idx} className="fade-in" style={{ display: "flex", gap: 12, alignItems: "start" }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${meta?.color}15`, border: `1px solid ${meta?.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: meta?.color }}>{meta?.icon}</span>
                          </div>
                          <div style={{ flex: 1, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: meta?.color }}>{log.agent}</span>
                              <span style={{ fontSize: 9, color: "#475569" }}>Reasoning Step</span>
                            </div>
                            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{log.message}</p>
                          </div>
                        </div>
                      );
                    })}
                    {orchestratorStep === "chatting" && (
                      <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: "#64748b", paddingLeft: 40 }}>
                        <Loader2 size={12} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                        <span>Next agent formulating response...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Simulation Result Output */}
              {result && orchestratorStep === "done" && (
                <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  
                  {/* Calendar and planner schedule outputs */}
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 18 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.04em" }}>Study Plan Generator</span>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>📍 Grounded Learning Path Overview</h3>
                      </div>
                      <span style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 99, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>
                        Fabric IQ Grounded
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 20 }}>
                      {result.planner.reasoning}
                    </p>

                    {/* Schedule timelines */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, borderLeft: "2px solid rgba(59,130,246,0.2)", paddingLeft: 18, marginBottom: 20 }}>
                      {result.planner.schedule.map((step, idx) => (
                        <div key={idx}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ color: "#3b82f6", fontWeight: 800, fontSize: 12 }}>{step.week}</span>
                            <span style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", color: "#3b82f6", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                              {step.hours} Hours study
                            </span>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{step.title}</h4>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                            {step.topics.map((t, index) => (
                              <span key={index} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#94a3b8", fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Work IQ Adjustment Notes */}
                    <div className="insight-box" style={{ padding: 14, marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <ShieldAlert size={14} color="#eab308" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#eab308" }}>Work IQ Constraints Adjusted</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{result.planner.workloadAdjustment}</p>
                    </div>

                    {/* Curator Grounding Citations */}
                    <div style={{ fontSize: 11, color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <strong>Foundry IQ Grounding Citations:</strong>
                      {result.curator.citations.map((c, i) => (
                        <span key={i} style={{ color: "#06b6d4" }}>[{c}]</span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Workflow Actions */}
                  <div className="glass-card" style={{ padding: 24, border: "1px solid rgba(234,179,8,0.2)", background: "rgba(234,179,8,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#eab308", textTransform: "uppercase" }}>Work IQ Action required</span>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>📅 Outlook Calendar Protection Loop</h3>
                      </div>
                      {calendarSynced ? (
                        <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          <Check size={12} /> Protected
                        </span>
                      ) : (
                        <span style={{ background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          <AlertCircle size={12} /> Pending Sync
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 18 }}>
                      To protect study windows from meeting encroachments, programmatically block the calculated **{result.planner.schedule[0].hours} hours/week** in your Outlook Calendar during preferred **{empContext?.preferred_learning_slot}** slots.
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={blockOutlookSlots} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Calendar size={14} /> Block Focus Windows in Outlook
                      </button>
                      {calendarSynced && (
                        <button onClick={() => setShowCalendarModal(true)} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          View Blocked Calendar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grounded Assessment Quiz */}
                  <div className="glow-card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 18 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#a855f7", textTransform: "uppercase" }}>Assessment Agent</span>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>🧠 Grounded Practice Assessment</h3>
                      </div>
                      <span style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 99, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>
                        Pass criteria: {certContext?.pass_threshold_percent}%
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
                      Complete the practice quiz below. These questions are mapped from approved training documents by the Assessment Agent.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 20 }}>
                      {result.assessment.questions.map((q, idx) => (
                        <div key={q.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10, padding: 18 }}>
                          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#f1f5f9" }}>
                            {idx + 1}. {q.question}
                          </h4>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {q.options.map((opt, oIdx) => {
                              const selected = quizAnswers[q.id] === oIdx;
                              const isCorrect = q.correctAnswerIndex === oIdx;
                              let btnBg = "rgba(255,255,255,0.02)";
                              let btnBorder = "rgba(255,255,255,0.05)";
                              if (selected) {
                                btnBg = "rgba(6,182,212,0.08)";
                                btnBorder = "#06b6d4";
                              }
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  btnBg = "rgba(16,185,129,0.08)";
                                  btnBorder = "#10b981";
                                } else if (selected) {
                                  btnBg = "rgba(244,63,94,0.08)";
                                  btnBorder = "#f43f5e";
                                }
                              }
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => !quizSubmitted && handleSelectAnswer(q.id, oIdx)}
                                  disabled={quizSubmitted}
                                  style={{
                                    background: btnBg, border: `1px solid ${btnBorder}`,
                                    borderRadius: 8, padding: 12, fontSize: 12, color: "#94a3b8",
                                    textAlign: "left", cursor: quizSubmitted ? "default" : "pointer",
                                    transition: "all 0.2s"
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <div style={{ marginTop: 14, fontSize: 12, color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 10 }}>
                              <div style={{ display: "flex", gap: 6, alignItems: "center", color: "#10b981", fontWeight: 600 }}>
                                <CheckCircle size={13} /> Grounding Citation: {q.citation}
                              </div>
                              <div style={{ marginTop: 6, color: "#94a3b8", lineHeight: 1.6 }}>
                                <strong>Explanation:</strong> {q.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length < result.assessment.questions.length}
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ padding: 18, background: quizScore >= 75 ? "rgba(16,185,129,0.04)" : "rgba(244,63,94,0.04)", border: `1px solid ${quizScore >= 75 ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)"}`, borderRadius: 10, textAlign: "center" }}>
                          <h4 style={{ fontSize: 17, fontWeight: 700, color: quizScore >= 75 ? "#10b981" : "#f43f5e" }}>
                            Practice Outcome: {quizScore}% {quizScore >= 75 ? "Pass" : "Fail"}
                          </h4>
                          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
                            {quizScore >= 75
                              ? "Excellent! Candidate satisfied the readiness pass rate criteria."
                              : "Readiness score threshold not achieved. Re-evaluation loops triggered."}
                          </p>
                        </div>

                        {/* Dynamic Certification Advancement Paths */}
                        {quizScore >= 75 && certContext && (
                          <div className="glass-card" style={{ padding: 18, border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.02)" }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#a855f7", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                              <Award size={16} /> Recommended Next Step
                            </h4>
                            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                              Since **{empContext?.name}** passed the **{selectedCertId}** practice assessment, the semantic rules suggest advancing to:
                              <strong style={{ color: "#a855f7", display: "block", marginTop: 6 }}>
                                🚀 AZ-305 (Microsoft Certified: Azure Solutions Architect Expert)
                              </strong>
                              Prerequisites verified. Next learning block scheduled.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!result && orchestratorStep === "idle" && (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                  <Brain size={44} color="rgba(6,182,212,0.15)" style={{ marginBottom: 18 }} />
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>Awaiting Orchestrator Pipeline</h3>
                  <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>
                    Fill in your settings on the left sidebar, and click **Run Real-Time Pipeline** to start agent collaboration.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Manager Dashboard */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }} className="fade-in">
            
            {/* Metric Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
              <div className="glass-card" style={{ padding: 22 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Average study hours</span>
                <h3 style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>21.0 hrs</h3>
                <span style={{ fontSize: 11, color: "#10b981" }}>Stable study outcomes</span>
              </div>
              <div className="glass-card" style={{ padding: 22 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Grounded pass rate</span>
                <h3 style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }} className="gradient-text">{managerMetrics.passRate}%</h3>
                <span style={{ fontSize: 11, color: "#10b981" }}>Live metrics updated</span>
              </div>
              <div className="glass-card" style={{ padding: 22 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Active candidates</span>
                <h3 style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{managerMetrics.activeCandidates} Employees</h3>
                <span style={{ fontSize: 11, color: "#06b6d4" }}>Dynamic program trackers</span>
              </div>
              <div className="glass-card" style={{ padding: 22 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Workload conflicts</span>
                <h3 style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>2 High Risk</h3>
                <span style={{ fontSize: 11, color: "#f43f5e" }}>Meetings blocking focus time</span>
              </div>
            </div>

            {/* Visual Graphs */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 28 }}>
              
              {/* Bar Chart */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Team Study Performance Analytics</h3>
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" style={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#0f172a", borderColor: "rgba(255,255,255,0.1)", fontSize: 12, color: "#f1f5f9" }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="hours" name="Hours Logged" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="score" name="Readiness score %" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Program Completion Ratios</h3>
                  <p style={{ fontSize: 12, color: "#64748b" }}>Calculations grounded in team performance history</p>
                </div>
                <div style={{ width: "100%", height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0f172a", borderColor: "rgba(255,255,255,0.1)", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                    <span>Pass Target ({managerMetrics.passRate}%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f43f5e" }} />
                    <span>Fail / Retry ({managerMetrics.failures}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <ShieldAlert size={18} color="#eab308" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Management Directives (Semantic Grounding)</h3>
              </div>
              <ul style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, paddingLeft: 20 }}>
                <li>**Workload Barrier**: High-frequency meetings (&gt;20h/week) create fragmented calendars. Programmatic calendar locks are strongly advised.</li>
                <li>**Success Criteria**: Prior team data logs confirm that studying **&gt;20 hours** combined with practice quiz scores of **&gt;75%** yields a **92% passing probability** on Microsoft official exams.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Grounding Docs Viewer */}
        {activeTab === "docs" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }} className="fade-in">
            <div className="glass-card" style={{ padding: 22, maxHeight: 520, overflowY: "auto" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#06b6d4", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 6 }}>
                Engineering Certification Guide
              </h4>
              <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "pre-line", fontFamily: "monospace", lineHeight: 1.7 }}>
                {SYNTHETIC_KNOWLEDGE_DOCS.certification_guide}
              </p>
            </div>

            <div className="glass-card" style={{ padding: 22, maxHeight: 520, overflowY: "auto" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 6 }}>
                Quarterly Learning Summary
              </h4>
              <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "pre-line", fontFamily: "monospace", lineHeight: 1.7 }}>
                {SYNTHETIC_KNOWLEDGE_DOCS.learning_report}
              </p>
            </div>

            <div className="glass-card" style={{ padding: 22, maxHeight: 520, overflowY: "auto" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#eab308", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 6 }}>
                Workload Insights Report
              </h4>
              <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "pre-line", fontFamily: "monospace", lineHeight: 1.7 }}>
                {SYNTHETIC_KNOWLEDGE_DOCS.workload_insights}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ── OUTLOOK CALENDAR MODAL ── */}
      {showCalendarModal && empContext && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex",
          alignItems: "center", justifyContent: "center"
        }} className="fade-in">
          <div className="glass-card" style={{ width: 680, padding: 26, background: "#0f172a", border: "1px solid rgba(99,179,237,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <Calendar size={18} color="#06b6d4" /> Outlook Calendar Block (Work IQ Protected)
                </h3>
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Learner: {empContext.name} · Target: {selectedCertId}</p>
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                style={{ background: "rgba(255,255,255,0.04)", border: "none", color: "#94a3b8", cursor: "pointer", borderRadius: "50%", width: 24, height: 24 }}
              >
                ✕
              </button>
            </div>

            {/* Outlook Weekly Layout Mockup */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden" }}>
              
              {/* Header Days */}
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 1fr 1fr", background: "rgba(255,255,255,0.02)", textAlign: "center", fontSize: 11, fontWeight: 700, paddingTop: 8, paddingBottom: 8 }}>
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}>Time</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
              </div>

              {/* Slots Row 1: Morning (9 AM - 12 PM) */}
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 1fr 1fr", height: 75, fontSize: 10, color: "#64748b" }}>
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.01)" }}>
                  09:00 AM
                </div>
                
                {/* Mon */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Morning" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>

                {/* Tue */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Morning" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ background: "rgba(255,255,255,0.02)", height: "100%", border: "1px solid rgba(255,255,255,0.04)", padding: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>Sync Standup</span>
                    </div>
                  )}
                </div>

                {/* Wed */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Morning" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>

                {/* Thu */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Morning" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>

                {/* Fri */}
                <div style={{ padding: 4 }}>
                  {empContext.preferred_learning_slot === "Morning" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>
              </div>

              {/* Slots Row 2: Afternoon (1 PM - 4 PM) */}
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 1fr 1fr", height: 75, fontSize: 10, color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.01)" }}>
                  01:00 PM
                </div>
                
                {/* Mon */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Afternoon" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>

                {/* Tue */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Afternoon" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>

                {/* Wed */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Afternoon" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ background: "rgba(255,255,255,0.02)", height: "100%", border: "1px solid rgba(255,255,255,0.04)", padding: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>Design Review</span>
                    </div>
                  )}
                </div>

                {/* Thu */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: 4 }}>
                  {empContext.preferred_learning_slot === "Afternoon" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>

                {/* Fri */}
                <div style={{ padding: 4 }}>
                  {empContext.preferred_learning_slot === "Afternoon" || empContext.preferred_learning_slot === "Friday Focus Window" ? (
                    <div style={{ height: "100%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 4, padding: 4, color: "#06b6d4", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span>📚 {selectedCertId} Study</span>
                      <span style={{ fontSize: 8, fontWeight: 400 }}>Protected Block</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", opacity: 0.3, display: "flex", alignItems: "center", justifyContent: "center" }}>Open slot</div>
                  )}
                </div>
              </div>

            </div>

            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button onClick={() => setShowCalendarModal(false)} className="btn-primary" style={{ padding: "8px 18px" }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseFlow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
