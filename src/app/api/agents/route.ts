import { NextRequest, NextResponse } from "next/server";
import {
  SYNTHETIC_WORK_SIGNALS,
  SYNTHETIC_SEMANTIC_MODEL,
  SYNTHETIC_KNOWLEDGE_DOCS,
  SYNTHETIC_GROUNDED_QUESTIONS,
  SYNTHETIC_LEARNER_PERFORMANCE,
  GroundedQuestion,
  WorkActivitySignal,
  SemanticCertification
} from "@/lib/syntheticData";

const SYSTEM_PROMPT = `You are a Multi-Agent Enterprise Learning Orchestrator powered by advanced LLM reasoning.
Your job is to simulate a collaborative session among 5 specialized AI agents representing Microsoft Foundry IQ layers:

1. Learning Path Curator Agent (Grounding: Foundry IQ)
   - Suggests certification skills and content. Must cite approved source documents (e.g., Engineering Certification Enablement Guide).

2. Study Plan Generator Agent (Grounding: Fabric IQ semantic rules)
   - Converts content into a weekly study schedule. Must budget hours and adjust pacing based on role requirements.

3. Engagement Agent (Grounding: Work IQ context)
   - Personalizes study reminders and timing around employee's meetings and focus hours.

4. Assessment Agent (Grounding: Foundry IQ + Fabric IQ)
   - Provides grounded quiz questions based on the selected certification and cites source documents.

5. Manager Insights Agent (Grounding: Work IQ + Fabric IQ)
   - Summarizes team readiness, highlights completion risk, and calculates pass likelihood.

Always respond with valid JSON matching the exact schema provided. Do not output markdown, notes, or extra characters. Pure JSON only.`;

const RESPONSE_SCHEMA = `{
  "agentChatLog": [
    {
      "agent": "Name of the Agent (e.g., Curator Agent, Planner Agent)",
      "message": "Dialogue expressing reasoning, references, and collaboration details"
    }
  ],
  "curator": {
    "reasoning": "Detailed reasoning explaining how certification targets map to the role",
    "skills": ["array of skills/tools to focus on"],
    "citations": ["Exact citations from the Engineering Certification Enablement Guide"]
  },
  "planner": {
    "reasoning": "Reasoning explaining how the schedule was distributed and optimized",
    "schedule": [
      {
        "week": "Week 1",
        "title": "Phase title",
        "hours": 5,
        "topics": ["array of specific topics"]
      }
    ],
    "workloadAdjustment": "Detailed explanation of how the schedule was adapted to workload"
  },
  "engagement": {
    "reasoning": "Reasoning about focus windows and timing adjustments",
    "reminderTiming": "Detailed plan of when and how reminders are sent",
    "focusWindows": "Designated study slots based on Work IQ signals"
  },
  "assessment": {
    "reasoning": "Reasoning about why these specific practice questions are selected for readiness checking",
    "questions": [
      {
        "id": "question-id",
        "question": "question text",
        "options": ["option 1", "option 2", "option 3", "option 4"],
        "correctAnswerIndex": 0,
        "citation": "Source document citation",
        "explanation": "Detailed explanation of the correct answer"
      }
    ]
  },
  "manager": {
    "reasoning": "Summary of team learning trends and workload correlations",
    "teamRisk": "High | Medium | Low",
    "completionLikelihood": 85,
    "readinessSummary": "High-level summary for managers detailing readiness risks and workload recommendations without exposing PII"
  }
}`;

export async function POST(req: NextRequest) {
  let employeeId = "EMP-001";
  let certificationId = "AZ-204";
  let customNotes = "";

  try {
    const body = await req.json();
    employeeId = body.employeeId || "EMP-001";
    certificationId = body.certificationId || "AZ-204";
    customNotes = body.customNotes || "";
  } catch (err: any) {
    console.error("Failed to parse request JSON:", err);
    return NextResponse.json({ error: "Invalid request JSON" }, { status: 400 });
  }

  // Gather employee and certification contexts
  const employee = SYNTHETIC_WORK_SIGNALS.find(s => s.employee_id === employeeId) || SYNTHETIC_WORK_SIGNALS[0];
  const certification = SYNTHETIC_SEMANTIC_MODEL.certifications.find(c => c.id === certificationId) || SYNTHETIC_SEMANTIC_MODEL.certifications[0];

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    // If Azure OpenAI is not configured, fall back to local high-fidelity simulation
    if (!endpoint || !apiKey) {
      return NextResponse.json(getLocalSimulation(employee, certification, customNotes));
    }

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const userPrompt = `
Orchestrate a multi-agent simulation for:
- Employee: ${employee.name} (ID: ${employee.employee_id}, Role: ${employee.role})
- Target Certification: ${certification.title} (ID: ${certification.id})
- Work IQ Signals: ${employee.meeting_hours_per_week} meeting hours/week, ${employee.focus_hours_per_week} focus hours/week, preferred learning slot is "${employee.preferred_learning_slot}".
- Custom Pacing Notes: "${customNotes}"

Grounded Knowledge Sources (Foundry IQ):
1. Engineering Certification Enablement Guide:
${SYNTHETIC_KNOWLEDGE_DOCS.certification_guide}
2. Quarterly Learning Performance Summary:
${SYNTHETIC_KNOWLEDGE_DOCS.learning_report}
3. Workload and Learning Correlation Report:
${SYNTHETIC_KNOWLEDGE_DOCS.workload_insights}

Fabric IQ Semantic Model rules:
- Certification ID: ${certification.id}
- Required skills: ${certification.skills.join(", ")}
- Recommended study hours: ${certification.recommended_hours} hours
- Pass threshold: ${certification.pass_threshold_percent}% on practice assessments

Grounded Questions Database (select 2-3 relevant questions matching this certification ID):
${JSON.stringify(SYNTHETIC_GROUNDED_QUESTIONS.filter(q => q.certification === certification.id), null, 2)}

Please execute the reasoning loop for the 5 agents sequentially.
Have each agent add a chat entry in the "agentChatLog" array showing their conversation/debate about how they adjusted Alex's plan to fit meetings and focus times.
Return the response in this exact JSON schema:
${RESPONSE_SCHEMA}
`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 3500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Azure OpenAI error in agents endpoint, falling back to simulation:", errText);
      return NextResponse.json(getLocalSimulation(employee, certification, customNotes));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.warn("No response content in agents endpoint, falling back to simulation");
      return NextResponse.json(getLocalSimulation(employee, certification, customNotes));
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);

  } catch (err: any) {
    console.warn("Agents API exception, falling back to simulation:", err);
    return NextResponse.json(getLocalSimulation(employee, certification, customNotes));
  }
}

// High-fidelity fallback simulation matching the exact JSON schema
function getLocalSimulation(employee: WorkActivitySignal, certification: SemanticCertification, customNotes: string) {
  // Pacing modification based on custom notes or workload
  let recommendedHours = certification.recommended_hours;
  let pacingModifier = 1.0;
  let workloadReasoning = "";

  const notesLower = customNotes.toLowerCase();
  if (notesLower.includes("slow") || notesLower.includes("extend") || notesLower.includes("longer")) {
    pacingModifier = 1.5;
    workloadReasoning = "Pacing extended by 50% due to user request for a slower learning schedule.";
  } else if (notesLower.includes("fast") || notesLower.includes("accelerate") || notesLower.includes("quick")) {
    pacingModifier = 0.75;
    workloadReasoning = "Pacing compressed by 25% due to user request for an accelerated path.";
  }

  // Work IQ Adjustment based on meetings
  const hasHighMeetings = employee.meeting_hours_per_week > 20;
  if (hasHighMeetings) {
    pacingModifier *= 1.25; // needs more calendar weeks to distribute hours
    workloadReasoning += (workloadReasoning ? " Also, a" : "A") + `dditional weekly buffers added since candidate has high meeting load (${employee.meeting_hours_per_week}h/week) which limits daily study blocks.`;
  } else {
    workloadReasoning += (workloadReasoning ? " Furthermore, the" : "The") + ` low meeting load of ${employee.meeting_hours_per_week}h/week allows for dense daily study windows.`;
  }

  // Calculate study plan distribution
  const totalWeeks = Math.max(3, Math.round(4 * pacingModifier));
  const hoursPerWeek = Math.max(2, Math.round(recommendedHours / totalWeeks));

  const schedule = [];
  const skillsSliceSize = Math.max(1, Math.ceil(certification.skills.length / totalWeeks));

  for (let i = 0; i < totalWeeks; i++) {
    const weekStart = i + 1;
    const startIdx = i * skillsSliceSize;
    const endIdx = Math.min(certification.skills.length, (i + 1) * skillsSliceSize);
    const weekSkills = certification.skills.slice(startIdx, endIdx);

    schedule.push({
      week: `Week ${weekStart}`,
      title: `Focus on ${weekSkills[0] || "Advanced Core Practice"}`,
      hours: hoursPerWeek,
      topics: weekSkills.map(s => `${s} core principles & integration scenarios`)
    });
  }

  // Filter grounded questions for assessment
  let questions = SYNTHETIC_GROUNDED_QUESTIONS.filter(q => q.certification === certification.id);
  if (questions.length === 0) {
    questions = [
      {
        id: `Q-${certification.id}-01`,
        certification: certification.id,
        question: `According to the Engineering Certification Guide, what is the primary recommendation for scheduling study blocks?`,
        options: [
          "Study only on weekends",
          "Programmatically schedule blocks within focus-heavy windows and protect them",
          "Complete all training within a single 24-hour block",
          "Rely on managers to assign daily study times"
        ],
        correctAnswerIndex: 1,
        citation: "Engineering Certification Enablement Guide (CERT-GD-2026) & Workload Insights Report (REPT-WKL-04)",
        explanation: "The reports recommend scheduling study blocks within focus-heavy calendar slots to protect them from meeting encroachments."
      },
      {
        id: `Q-${certification.id}-02`,
        certification: certification.id,
        question: `What practice assessment target score is recommended before booking the official certification exam?`,
        options: [
          "A minimum of 50%",
          "At least 60%",
          "A minimum of 75%",
          "A perfect score of 100%"
        ],
        correctAnswerIndex: 2,
        citation: "Engineering Certification Enablement Guide (CERT-GD-2026) - Section 2",
        explanation: "The guide states that candidates should target achieving at least a 75% score on practice assessments before scheduling the official exam."
      }
    ];
  }

  // Manager Insights scoring
  let completionLikelihood = 80;
  let teamRisk: "High" | "Medium" | "Low" = "Medium";

  if (hasHighMeetings) {
    completionLikelihood = 60;
    teamRisk = "High";
  } else if (employee.focus_hours_per_week >= 20) {
    completionLikelihood = 95;
    teamRisk = "Low";
  }

  // Construct dialogue log
  const agentChatLog = [
    {
      agent: "Curator Agent",
      message: `Analyzing profile for ${employee.name}. Role: ${employee.role}. Grounded in CERT-GD-2026, the primary target is ${certification.title} (${certification.id}). The key learning blocks are: ${certification.skills.slice(0, 3).join(", ")}. Checking with Planner on workload pacing.`
    },
    {
      agent: "Planner Agent",
      message: `Thanks Curator. Checking ${employee.name}'s Work IQ metrics: meeting load is ${employee.meeting_hours_per_week}h/week, focus hours are ${employee.focus_hours_per_week}h/week. Recommended certification study time is ${certification.recommended_hours} hours. ${hasHighMeetings ? "Because meeting density is high, I am stretching the schedule to avoid calendar fragmentation." : "Since meetings are moderate, we can schedule an efficient timeline."} Let's structure a ${totalWeeks}-week program.`
    },
    {
      agent: "Engagement Agent",
      message: `Reviewing plan. Since ${employee.name}'s preferred learning window is '${employee.preferred_learning_slot}', I will schedule active reminders at the beginning of these slots and hook them to Teams. I'll also trigger Outlook calendar blocks to protect focus windows.`
    },
    {
      agent: "Assessment Agent",
      message: `Assessment targets prepared. Fabric IQ rules require a ${certification.pass_threshold_percent}% passing threshold to verify readiness. Grounding questions retrieved for ${certification.id} with source citations from approved material.`
    },
    {
      agent: "Manager Insights Agent",
      message: `Analyzing risk metrics. Candidates with high meeting loads have a 40% higher dropout rate. However, with the protected morning block rules established by Engagement, ${employee.name}'s completion probability is estimated at ${completionLikelihood}%. Overall team risk parameter set to ${teamRisk}.`
    }
  ];

  return {
    agentChatLog,
    curator: {
      reasoning: `Curator mapped ${employee.name}'s role (${employee.role}) to the recommended certification ${certification.title} (${certification.id}). Grounded in the Engineering Certification Enablement Guide.`,
      skills: certification.skills,
      citations: ["Engineering Certification Enablement Guide (CERT-GD-2026) - Section 1: Role Alignment"]
    },
    planner: {
      reasoning: `Planner distributed the required ${recommendedHours} recommended study hours into a ${totalWeeks}-week plan at ${hoursPerWeek} hours/week. Adjusted dynamically.`,
      schedule,
      workloadAdjustment: workloadReasoning
    },
    engagement: {
      reasoning: `Engagement Agent evaluated focus schedules and aligned reminders during the employee's preferred slot ("${employee.preferred_learning_slot}").`,
      reminderTiming: `Notifications scheduled to trigger at the beginning of the employee's ${employee.preferred_learning_slot} focus slots.`,
      focusWindows: `${employee.preferred_learning_slot} sessions protected on Microsoft Outlook/Teams.`
    },
    assessment: {
      reasoning: `Assessment Agent retrieved practice questions from the grounded questions database matching ${certification.id} to verify candidate readiness.`,
      questions
    },
    manager: {
      reasoning: `Manager Insights Agent aggregated metrics from similar profiles. Learners with similar workloads (${employee.meeting_hours_per_week}h meeting, ${employee.focus_hours_per_week}h focus) show strong correlations with exam outcomes.`,
      teamRisk,
      completionLikelihood,
      readinessSummary: `This candidate has a ${completionLikelihood}% likelihood of completing the certification plan successfully. ${hasHighMeetings ? "High meeting volumes indicate scheduling risk. We recommend blocking calendar times explicitly." : "Low workload conflict indicates high readiness. Candidate is on track."}`
    }
  };
}
