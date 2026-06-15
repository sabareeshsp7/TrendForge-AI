"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, User, Target, Clock, Loader2, CheckCircle,
  BookOpen, Play, FileText, TrendingUp, Zap, Award, Brain,
  MessageSquare, ArrowRight, ShieldAlert, Users, Layers,
  Settings, Database, Calendar, ChevronRight, RefreshCw, BarChart2
} from "lucide-react";
import {
  SYNTHETIC_WORK_SIGNALS,
  SYNTHETIC_SEMANTIC_MODEL,
  SYNTHETIC_KNOWLEDGE_DOCS,
  SYNTHETIC_LEARNER_PERFORMANCE,
  WorkActivitySignal,
  SemanticCertification
} from "@/lib/syntheticData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

interface SimulatedResult {
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
    questions: {
      id: string;
      certification: string;
      question: string;
      options: string[];
      correctAnswerIndex: number;
      citation: string;
      explanation: string;
    }[];
  };
  manager: {
    reasoning: string;
    teamRisk: "High" | "Medium" | "Low";
    completionLikelihood: number;
    readinessSummary: string;
  };
}

export default function AgentsPage() {
  const [selectedEmpId, setSelectedEmpId] = useState("EMP-001");
  const [selectedCertId, setSelectedCertId] = useState("AZ-204");
  const [customNotes, setCustomNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"agents" | "analytics" | "docs">("agents");
  const [result, setResult] = useState<SimulatedResult | null>(null);
  
  // Agent simulation status steps
  const [curatorStatus, setCuratorStatus] = useState<"idle" | "running" | "completed">("idle");
  const [plannerStatus, setPlannerStatus] = useState<"idle" | "running" | "completed">("idle");
  const [engagementStatus, setEngagementStatus] = useState<"idle" | "running" | "completed">("idle");
  const [assessmentStatus, setAssessmentStatus] = useState<"idle" | "running" | "completed">("idle");
  const [managerStatus, setManagerStatus] = useState<"idle" | "running" | "completed">("idle");
  
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

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
    setExecutionLogs([]);
    
    // Initialize statuses
    setCuratorStatus("running");
    setPlannerStatus("idle");
    setEngagementStatus("idle");
    setAssessmentStatus("idle");
    setManagerStatus("idle");

    const addLog = (msg: string) => {
      setExecutionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    addLog("Initiating Multi-Agent Orchestration Pipeline...");
    
    // Simulate curator agent delay
    addLog("Learning Path Curator Agent: Activating...");
    addLog("Foundry IQ: Grounding queries in 'Engineering Certification Enablement Guide'...");
    await new Promise(r => setTimeout(r, 1200));
    setCuratorStatus("completed");
    setPlannerStatus("running");
    addLog("Learning Path Curator Agent: Mapping certification skills successfully.");

    // Simulate planner agent delay
    addLog("Study Plan Generator Agent: Activating...");
    addLog("Fabric IQ: Mapping ontology structure 'learner -> role -> certification -> skills'...");
    await new Promise(r => setTimeout(r, 1200));
    setPlannerStatus("completed");
    setEngagementStatus("running");
    addLog("Study Plan Generator Agent: Weekly learning milestones allocated.");

    // Simulate engagement agent delay
    addLog("Engagement Agent: Activating...");
    addLog("Work IQ: Analyzing Microsoft Graph signals (meeting volumes & focus schedules)...");
    await new Promise(r => setTimeout(r, 1200));
    setEngagementStatus("completed");
    setAssessmentStatus("running");
    addLog("Engagement Agent: Personalized reminder intervals determined.");

    // Simulate assessment agent delay
    addLog("Assessment Agent: Activating...");
    addLog("Foundry IQ: Retrieving grounded exam simulator questions with sources...");
    await new Promise(r => setTimeout(r, 1200));
    setAssessmentStatus("completed");
    setManagerStatus("running");
    addLog("Assessment Agent: Questions cached for readiness verification.");

    // Simulate manager agent delay
    addLog("Manager Insights Agent: Activating...");
    addLog("Fabric IQ: Running semantic outcome predictions using prior candidate models...");
    await new Promise(r => setTimeout(r, 1200));
    setManagerStatus("completed");
    addLog("Manager Insights Agent: Organizational risk parameters computed.");
    addLog("All agents synchronized. Compiling results structure...");

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
      const data = await response.json();
      setResult(data);
      addLog("Pipeline complete! Displaying results dashboard.");
    } catch (err: any) {
      console.error(err);
      addLog("Error executing pipeline. Safe local recovery models utilized.");
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
    setQuizScore(Math.round((correctCount / result.assessment.questions.length) * 100));
    setQuizSubmitted(true);
  };

  // Prepare chart data
  const barChartData = SYNTHETIC_LEARNER_PERFORMANCE.map(p => ({
    name: p.name,
    hours: p.hours_studied,
    score: p.practice_score_avg,
    outcome: p.exam_outcome
  }));

  const pieData = [
    { name: "Pass Rate", value: 68, color: "#10b981" },
    { name: "Fail/Retake Rate", value: 32, color: "#f43f5e" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0B1020", color: "#f1f5f9" }}>
      {/* Title Header */}
      <div style={{ background: "rgba(17,24,39,0.6)", borderBottom: "1px solid rgba(99,179,237,0.1)", padding: "24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.08em" }}>Microsoft Foundry Challenge</span>
            <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 30, fontWeight: 800, letterSpacing: "-0.2px", marginTop: 4 }}>
              🧠 Multi-Agent <span className="gradient-text">Reasoning Agents</span> Workspace
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
              Orchestrating Curator, Study Planner, Engagement, Assessment, and Manager Insights AI layers.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setActiveTab("agents")}
              className={activeTab === "agents" ? "btn-primary" : "btn-ghost"}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
            >
              <Brain size={14} /> Agent Sandbox
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={activeTab === "analytics" ? "btn-primary" : "btn-ghost"}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
            >
              <BarChart2 size={14} /> Manager Insights
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={activeTab === "docs" ? "btn-primary" : "btn-ghost"}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
            >
              <Database size={14} /> Grounding Docs
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        
        {/* Tab 1: Agent Sandbox */}
        {activeTab === "agents" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 28, alignItems: "start" }}>
            
            {/* Input Selection Side */}
            <div className="glass-card" style={{ padding: 24, position: "sticky", top: 88 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <Settings size={18} color="#06b6d4" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Simulation Controls</h2>
              </div>

              {/* Employee Selection */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                  Select Fictional Learner (Work IQ Data)
                </label>
                <select
                  className="tf-input"
                  value={selectedEmpId}
                  onChange={e => setSelectedEmpId(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {SYNTHETIC_WORK_SIGNALS.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Selected Employee Stats */}
              {(() => {
                const emp = SYNTHETIC_WORK_SIGNALS.find(e => e.employee_id === selectedEmpId);
                if (!emp) return null;
                return (
                  <div className="insight-box" style={{ padding: 12, marginBottom: 18, fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#64748b" }}>Weekly Meetings:</span>
                      <span style={{ fontWeight: 600, color: emp.meeting_hours_per_week > 20 ? "#f43f5e" : "#f1f5f9" }}>
                        {emp.meeting_hours_per_week} hrs
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#64748b" }}>Weekly Focus Time:</span>
                      <span style={{ fontWeight: 600, color: "#10b981" }}>{emp.focus_hours_per_week} hrs</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Preferred Slot:</span>
                      <span style={{ fontWeight: 600, color: "#06b6d4" }}>{emp.preferred_learning_slot}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Certification Selection */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                  Target Certification (Fabric IQ Alignment)
                </label>
                <select
                  className="tf-input"
                  value={selectedCertId}
                  onChange={e => setSelectedCertId(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {SYNTHETIC_SEMANTIC_MODEL.certifications.map(cert => (
                    <option key={cert.id} value={cert.id}>
                      {cert.id} — {cert.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom notes for simulation */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                  Orchestrator Directive / Notes
                </label>
                <textarea
                  className="tf-input"
                  rows={3}
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="e.g. adjust pacing for slower timelines, focus specifically on cloud native containerization, etc."
                  style={{ resize: "none", width: "100%" }}
                />
              </div>

              {/* Launch button */}
              <button
                onClick={runOrchestration}
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                    Orchestrating...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Run Multi-Agent Loop
                  </>
                )}
              </button>
            </div>

            {/* Orchestration Stage / Logs / Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Agent Orchestration Nodes Layout */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Agent Collaboration Graph</h3>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center", position: "relative" }}>
                  
                  {/* curator */}
                  <div style={{
                    flex: "1 1 150px", border: curatorStatus === "completed" ? "1px solid rgba(16,185,129,0.3)" : curatorStatus === "running" ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.05)",
                    background: curatorStatus === "running" ? "rgba(6,182,212,0.06)" : curatorStatus === "completed" ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    borderRadius: 12, padding: 14, textAlign: "center", transition: "all 0.3s",
                    boxShadow: curatorStatus === "running" ? "0 0 16px rgba(6,182,212,0.15)" : ""
                  }}>
                    <BookOpen size={20} color={curatorStatus === "completed" ? "#10b981" : curatorStatus === "running" ? "#06b6d4" : "#64748b"} style={{ margin: "0 auto 8px" }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700 }}>Curator</h4>
                    <span style={{ fontSize: 10, color: curatorStatus === "completed" ? "#10b981" : curatorStatus === "running" ? "#06b6d4" : "#475569" }}>
                      {curatorStatus === "completed" ? "✓ Grounded" : curatorStatus === "running" ? "Querying IQ..." : "Idle"}
                    </span>
                  </div>

                  <ChevronRight size={16} color="#475569" />

                  {/* planner */}
                  <div style={{
                    flex: "1 1 150px", border: plannerStatus === "completed" ? "1px solid rgba(16,185,129,0.3)" : plannerStatus === "running" ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.05)",
                    background: plannerStatus === "running" ? "rgba(6,182,212,0.06)" : plannerStatus === "completed" ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    borderRadius: 12, padding: 14, textAlign: "center", transition: "all 0.3s",
                    boxShadow: plannerStatus === "running" ? "0 0 16px rgba(6,182,212,0.15)" : ""
                  }}>
                    <Calendar size={20} color={plannerStatus === "completed" ? "#10b981" : plannerStatus === "running" ? "#06b6d4" : "#64748b"} style={{ margin: "0 auto 8px" }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700 }}>Planner</h4>
                    <span style={{ fontSize: 10, color: plannerStatus === "completed" ? "#10b981" : plannerStatus === "running" ? "#06b6d4" : "#475569" }}>
                      {plannerStatus === "completed" ? "✓ Scheduled" : plannerStatus === "running" ? "Planning..." : "Idle"}
                    </span>
                  </div>

                  <ChevronRight size={16} color="#475569" />

                  {/* engagement */}
                  <div style={{
                    flex: "1 1 150px", border: engagementStatus === "completed" ? "1px solid rgba(16,185,129,0.3)" : engagementStatus === "running" ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.05)",
                    background: engagementStatus === "running" ? "rgba(6,182,212,0.06)" : engagementStatus === "completed" ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    borderRadius: 12, padding: 14, textAlign: "center", transition: "all 0.3s",
                    boxShadow: engagementStatus === "running" ? "0 0 16px rgba(6,182,212,0.15)" : ""
                  }}>
                    <Clock size={20} color={engagementStatus === "completed" ? "#10b981" : engagementStatus === "running" ? "#06b6d4" : "#64748b"} style={{ margin: "0 auto 8px" }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700 }}>Engagement</h4>
                    <span style={{ fontSize: 10, color: engagementStatus === "completed" ? "#10b981" : engagementStatus === "running" ? "#06b6d4" : "#475569" }}>
                      {engagementStatus === "completed" ? "✓ Buffered" : engagementStatus === "running" ? "Syncing Work IQ..." : "Idle"}
                    </span>
                  </div>

                  <ChevronRight size={16} color="#475569" />

                  {/* assessment */}
                  <div style={{
                    flex: "1 1 150px", border: assessmentStatus === "completed" ? "1px solid rgba(16,185,129,0.3)" : assessmentStatus === "running" ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.05)",
                    background: assessmentStatus === "running" ? "rgba(6,182,212,0.06)" : assessmentStatus === "completed" ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    borderRadius: 12, padding: 14, textAlign: "center", transition: "all 0.3s",
                    boxShadow: assessmentStatus === "running" ? "0 0 16px rgba(6,182,212,0.15)" : ""
                  }}>
                    <Award size={20} color={assessmentStatus === "completed" ? "#10b981" : assessmentStatus === "running" ? "#06b6d4" : "#64748b"} style={{ margin: "0 auto 8px" }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700 }}>Assessment</h4>
                    <span style={{ fontSize: 10, color: assessmentStatus === "completed" ? "#10b981" : assessmentStatus === "running" ? "#06b6d4" : "#475569" }}>
                      {assessmentStatus === "completed" ? "✓ Quiz Ready" : assessmentStatus === "running" ? "Retrieving..." : "Idle"}
                    </span>
                  </div>

                  <ChevronRight size={16} color="#475569" />

                  {/* manager insights */}
                  <div style={{
                    flex: "1 1 150px", border: managerStatus === "completed" ? "1px solid rgba(16,185,129,0.3)" : managerStatus === "running" ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.05)",
                    background: managerStatus === "running" ? "rgba(6,182,212,0.06)" : managerStatus === "completed" ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    borderRadius: 12, padding: 14, textAlign: "center", transition: "all 0.3s",
                    boxShadow: managerStatus === "running" ? "0 0 16px rgba(6,182,212,0.15)" : ""
                  }}>
                    <Users size={20} color={managerStatus === "completed" ? "#10b981" : managerStatus === "running" ? "#06b6d4" : "#64748b"} style={{ margin: "0 auto 8px" }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700 }}>Manager</h4>
                    <span style={{ fontSize: 10, color: managerStatus === "completed" ? "#10b981" : managerStatus === "running" ? "#06b6d4" : "#475569" }}>
                      {managerStatus === "completed" ? "✓ Evaluated" : managerStatus === "running" ? "Evaluating..." : "Idle"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time terminal output logs */}
              {(executionLogs.length > 0 || loading) && (
                <div style={{ background: "#060913", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 12, color: "#8ab4f8", maxHeight: 180, overflowY: "auto" }}>
                  <div style={{ borderBottom: "1px solid rgba(6,182,212,0.1)", paddingBottom: 8, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#06b6d4", fontWeight: 700 }}>Orchestrator Terminal Output</span>
                    {loading && <RefreshCw size={12} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />}
                  </div>
                  {executionLogs.map((log, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>
                      <span style={{ color: "#475569" }}>&gt;</span> {log}
                    </div>
                  ))}
                </div>
              )}

              {/* Simulation Result Output */}
              {result && (
                <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  
                  {/* Curator and Planner Output */}
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase" }}>Curator & Study planner results</span>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>📍 Personalized Certification Schedule</h3>
                      </div>
                      <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 99, paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, fontSize: 11, fontWeight: 700 }}>
                        Fabric IQ Grounded
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 18 }}>
                      <strong>Curator Reasoning:</strong> {result.curator.reasoning}
                    </p>

                    <div style={{ borderLeft: "2px solid rgba(6,182,212,0.2)", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 16, marginBottom: 18 }}>
                      {result.planner.schedule.map((step, idx) => (
                        <div key={idx}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#06b6d4", fontWeight: 700, fontSize: 12 }}>{step.week}</span>
                            <span style={{ background: "rgba(255,255,255,0.03)", paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, borderRadius: 4, fontSize: 11, color: "#64748b" }}>
                              {step.hours} Hours Alloc
                            </span>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{step.title}</h4>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                            {step.topics.map((t, index) => (
                              <span key={index} style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", color: "#06b6d4", fontSize: 11, paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 6 }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="insight-box" style={{ padding: 14 }}>
                      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                        <strong style={{ color: "#eab308" }}>Workload-Aware Adjustment (Work IQ):</strong> {result.planner.workloadAdjustment}
                      </p>
                    </div>
                  </div>

                  {/* Engagement & Reminders Output */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div className="glass-card" style={{ padding: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#06b6d4", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={16} /> Work IQ Engagement
                      </h4>
                      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12 }}>
                        {result.engagement.reasoning}
                      </p>
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 10, fontSize: 11 }}>
                        <div><strong style={{ color: "#f1f5f9" }}>Active Slots:</strong> {result.engagement.focusWindows}</div>
                        <div style={{ marginTop: 4 }}><strong style={{ color: "#f1f5f9" }}>Reminders:</strong> {result.engagement.reminderTiming}</div>
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                        <Users size={16} /> Manager Insights
                      </h4>
                      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12 }}>
                        {result.manager.reasoning}
                      </p>
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 10, fontSize: 11 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>Completion Likelihood:</strong>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>{result.manager.completionLikelihood}%</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          <strong>Team Readiness Risk:</strong>
                          <span style={{ color: result.manager.teamRisk === "High" ? "#f43f5e" : result.manager.teamRisk === "Medium" ? "#f59e0b" : "#10b981", fontWeight: 700 }}>
                            {result.manager.teamRisk}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grounded Assessment Quiz */}
                  <div className="glow-card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#a855f7", textTransform: "uppercase" }}>Assessment Agent</span>
                        <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>🧠 Grounded Practice Assessment</h3>
                      </div>
                      <span style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 99, paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, fontSize: 11, fontWeight: 700 }}>
                        Foundry IQ Grounded
                      </span>
                    </div>

                    <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
                      Select the correct answers. These questions are programmatically retrieved from our approved organizational guides with citations.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 20 }}>
                      {result.assessment.questions.map((q, idx) => (
                        <div key={q.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 16 }}>
                          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#f1f5f9" }}>
                            {idx + 1}. {q.question}
                          </h4>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {q.options.map((opt, oIdx) => {
                              const selected = quizAnswers[q.id] === oIdx;
                              const isCorrect = q.correctAnswerIndex === oIdx;
                              let btnBg = "rgba(255,255,255,0.02)";
                              let btnBorder = "rgba(255,255,255,0.06)";
                              if (selected) {
                                btnBg = "rgba(6,182,212,0.1)";
                                btnBorder = "#06b6d4";
                              }
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  btnBg = "rgba(16,185,129,0.1)";
                                  btnBorder = "#10b981";
                                } else if (selected) {
                                  btnBg = "rgba(244,63,94,0.1)";
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
                                    textAlign: "left", cursor: quizSubmitted ? "default" : "pointer"
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <div style={{ marginTop: 12, fontSize: 11, color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 8 }}>
                              <div style={{ display: "flex", gap: 4, alignItems: "center", color: "#10b981", fontWeight: 600 }}>
                                <CheckCircle size={12} /> Source Citation: {q.citation}
                              </div>
                              <div style={{ marginTop: 4, color: "#94a3b8" }}>
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
                      <div style={{ padding: 16, background: quizScore >= 75 ? "rgba(16,185,129,0.05)" : "rgba(244,63,94,0.05)", border: `1px solid ${quizScore >= 75 ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`, borderRadius: 10, textAlign: "center" }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: quizScore >= 75 ? "#10b981" : "#f43f5e" }}>
                          Assessment Result: {quizScore}% {quizScore >= 75 ? "Passed" : "Failed"}
                        </h4>
                        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                          {quizScore >= 75
                            ? "Congratulations! You have satisfied the 75% score readiness criteria mapped by Fabric IQ rules. Recommended next step: Schedule exam."
                            : "Your practice score is below the 75% target designated in the certification guides. We recommend reviewing study modules and retaking the preparation flow."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!result && !loading && (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                  <Brain size={40} color="rgba(6,182,212,0.2)" style={{ marginBottom: 16 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Awaiting Orchestration Loop</h3>
                  <p style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>Select the parameters on the left and click **Run Multi-Agent Loop** to trigger the Orchestration Pipeline.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Manager Insights Dashboard */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">
            
            {/* Upper Metric Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
              <div className="glass-card" style={{ padding: 20 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Average Study Time</span>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>21.0 hrs</h3>
                <span style={{ fontSize: 11, color: "#10b981" }}>Based on Q1 Performance Summary</span>
              </div>
              <div className="glass-card" style={{ padding: 20 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Pass Probability Target</span>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>92%</h3>
                <span style={{ fontSize: 11, color: "#10b981" }}>For candidates studying &gt; 20 hrs</span>
              </div>
              <div className="glass-card" style={{ padding: 20 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Risk Factor Correlation</span>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>-40%</h3>
                <span style={{ fontSize: 11, color: "#f43f5e" }}>Failure drop for meeting-heavy roles</span>
              </div>
              <div className="glass-card" style={{ padding: 20 }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Active Candidates</span>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>6 Employees</h3>
                <span style={{ fontSize: 11, color: "#06b6d4" }}>Tracking team readiness</span>
              </div>
            </div>

            {/* Graphs Display Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
              
              {/* Bar Chart */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Historical Learner Outlines (Study Hours vs Score)</h3>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" style={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#0B1020", borderColor: "rgba(255,255,255,0.1)", fontSize: 12 }} />
                      <Legend style={{ fontSize: 11 }} />
                      <Bar dataKey="hours" name="Study Hours" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="score" name="Practice Score %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart / Pass Rates */}
              <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Aggregated Q1 Certification Success</h3>
                  <p style={{ fontSize: 12, color: "#64748b" }}>Outcomes for team readiness audits</p>
                </div>
                <div style={{ width: "100%", height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0B1020", borderColor: "rgba(255,255,255,0.1)", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                    <span>Pass (68%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f43f5e" }} />
                    <span>Fail / Retry (32%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grounded Performance Insights */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <ShieldAlert size={18} color="#eab308" />
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Analytics Correlation Notes (Fabric IQ groundings)</h3>
              </div>
              <ul style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, paddingLeft: 20 }}>
                <li>Candidates logging **&gt; 20 study hours** achieve a **92% pass probability** compared to only **29%** for those under 18 hours.</li>
                <li>Meeting-heavy roles (e.g., Solutions Architects with &gt; 20 meeting hours per week) demonstrate **40% lower study completions** due to fragmented schedules.</li>
                <li>**Manager Recommendation**: Allocate protected focus windows of at least **15 hours per week** for active learners to secure team-level certifications.</li>
              </ul>
            </div>

          </div>
        )}

        {/* Tab 3: Grounding Docs Viewer */}
        {activeTab === "docs" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }} className="fade-in">
            <div className="glass-card" style={{ padding: 20, maxHeight: 500, overflowY: "auto" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#06b6d4", marginBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 6 }}>
                Guide: Engineering Enablement
              </h4>
              <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "pre-line", fontFamily: "monospace", lineHeight: 1.6 }}>
                {SYNTHETIC_KNOWLEDGE_DOCS.certification_guide}
              </p>
            </div>

            <div className="glass-card" style={{ padding: 20, maxHeight: 500, overflowY: "auto" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 6 }}>
                Report: Quarterly Learning Summary
              </h4>
              <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "pre-line", fontFamily: "monospace", lineHeight: 1.6 }}>
                {SYNTHETIC_KNOWLEDGE_DOCS.learning_report}
              </p>
            </div>

            <div className="glass-card" style={{ padding: 20, maxHeight: 500, overflowY: "auto" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#eab308", marginBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 6 }}>
                Report: Workload Insights
              </h4>
              <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "pre-line", fontFamily: "monospace", lineHeight: 1.6 }}>
                {SYNTHETIC_KNOWLEDGE_DOCS.workload_insights}
              </p>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 1024px) {
          .roadmap-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
