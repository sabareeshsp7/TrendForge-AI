// Synthetic Data & Documents for the Microsoft Foundry Reasoning Agents Challenge (Challenge A)

// 1. Work IQ: Work Activity Signals (Fictional Employee Work Schedules)
export interface WorkActivitySignal {
  employee_id: string;
  name: string;
  role: string;
  meeting_hours_per_week: number;
  focus_hours_per_week: number;
  preferred_learning_slot: "Morning" | "Afternoon" | "Evening" | "Friday Focus Window";
}

export const SYNTHETIC_WORK_SIGNALS: WorkActivitySignal[] = [
  {
    employee_id: "EMP-001",
    name: "Alex Rivera",
    role: "Cloud Engineer",
    meeting_hours_per_week: 22,
    focus_hours_per_week: 10,
    preferred_learning_slot: "Morning",
  },
  {
    employee_id: "EMP-002",
    name: "Sarah Chen",
    role: "DevOps Engineer",
    meeting_hours_per_week: 12,
    focus_hours_per_week: 22,
    preferred_learning_slot: "Afternoon",
  },
  {
    employee_id: "EMP-003",
    name: "Marcus Johnson",
    role: "Data Engineer",
    meeting_hours_per_week: 18,
    focus_hours_per_week: 15,
    preferred_learning_slot: "Friday Focus Window",
  },
  {
    employee_id: "EMP-004",
    name: "Elena Rostova",
    role: "Solutions Architect",
    meeting_hours_per_week: 28,
    focus_hours_per_week: 6,
    preferred_learning_slot: "Evening",
  },
];

// 2. Fabric IQ: Semantic Model Seed (Fictional Certifications & Paths)
export interface SemanticCertification {
  id: string;
  title: string;
  roleAlignment: string;
  skills: string[];
  recommended_hours: number;
  prerequisites: string[];
  pass_threshold_percent: number;
}

export const SYNTHETIC_SEMANTIC_MODEL: { certifications: SemanticCertification[] } = {
  certifications: [
    {
      id: "AZ-204",
      title: "Microsoft Certified: Azure Developer Associate",
      roleAlignment: "Cloud Engineer",
      skills: ["API Development", "Azure Functions", "Azure Cosmos DB", "Container Deployments", "App Service Configuration"],
      recommended_hours: 20,
      prerequisites: ["Cloud Computing Basics"],
      pass_threshold_percent: 75,
    },
    {
      id: "AZ-400",
      title: "Microsoft Certified: DevOps Engineer Expert",
      roleAlignment: "DevOps Engineer",
      skills: ["CI/CD pipelines", "Infrastructure as Code", "Azure Resource Manager", "GitHub Actions", "Application Monitoring"],
      recommended_hours: 25,
      prerequisites: ["AZ-204", "AZ-104"],
      pass_threshold_percent: 80,
    },
    {
      id: "DP-203",
      title: "Microsoft Certified: Azure Data Engineer Associate",
      roleAlignment: "Data Engineer",
      skills: ["Data Pipelines", "Azure Synapse Analytics", "Azure Databricks", "Data Lake Storage", "Stream Analytics"],
      recommended_hours: 22,
      prerequisites: ["SQL Databases Core"],
      pass_threshold_percent: 75,
    },
    {
      id: "AZ-305",
      title: "Microsoft Certified: Azure Solutions Architect Expert",
      roleAlignment: "Solutions Architect",
      skills: ["Architectural Design", "Identity & Security", "High Availability Systems", "Migration Infrastructure"],
      recommended_hours: 30,
      prerequisites: ["AZ-104"],
      pass_threshold_percent: 80,
    },
  ],
};

// 3. Learner Performance Dataset (Fictional past records for analytics training)
export interface LearnerPerformance {
  learner_id: string;
  name: string;
  role: string;
  certification: string;
  practice_score_avg: number;
  hours_studied: number;
  exam_outcome: "Pass" | "Fail";
}

export const SYNTHETIC_LEARNER_PERFORMANCE: LearnerPerformance[] = [
  {
    learner_id: "L-1001",
    name: "John Miller",
    role: "Cloud Engineer",
    certification: "AZ-204",
    practice_score_avg: 67,
    hours_studied: 18,
    exam_outcome: "Fail",
  },
  {
    learner_id: "L-1002",
    name: "Tariq Mahmood",
    role: "DevOps Engineer",
    certification: "AZ-400",
    practice_score_avg: 82,
    hours_studied: 24,
    exam_outcome: "Pass",
  },
  {
    learner_id: "L-1003",
    name: "Emma Watson",
    role: "Data Engineer",
    certification: "DP-203",
    practice_score_avg: 74,
    hours_studied: 20,
    exam_outcome: "Pass",
  },
  {
    learner_id: "L-1004",
    name: "Lucas Perez",
    role: "Cloud Engineer",
    certification: "AZ-204",
    practice_score_avg: 88,
    hours_studied: 22,
    exam_outcome: "Pass",
  },
  {
    learner_id: "L-1005",
    name: "Chloe Dupont",
    role: "Solutions Architect",
    certification: "AZ-305",
    practice_score_avg: 68,
    hours_studied: 15,
    exam_outcome: "Fail",
  },
  {
    learner_id: "L-1006",
    name: "Hana Tanaka",
    role: "Solutions Architect",
    certification: "AZ-305",
    practice_score_avg: 84,
    hours_studied: 32,
    exam_outcome: "Pass",
  },
];

// 4. Foundry IQ: Grounded Knowledge Sources (Approved Documents)
export const SYNTHETIC_KNOWLEDGE_DOCS = {
  certification_guide: `
Engineering Certification Enablement Guide (Synthetic Document Ref: CERT-GD-2026)

This official reference details the certification expectations for technical teams:

1. Alignment of Roles to Certifications:
   - Cloud Engineer: Primary Target is AZ-204 (Azure Developer Associate). Secondary Target is AZ-305 (Solutions Architect Expert).
   - DevOps Engineer: Primary Target is AZ-400 (DevOps Engineer Expert).
   - Data Engineer: Primary Target is DP-203 (Azure Data Engineer Associate).

2. Recommended Study Patterns:
   - Daily Study: 1 to 2 hours of focused daily study is recommended.
   - Assessments: Weekly practice checkpoints should be completed.
   - Readiness Target: We recommend attaining at least a 75% average score on practice assessments before scheduling the official exam.
  `,
  learning_report: `
Quarterly Learning Performance Summary (Synthetic Document Ref: REPT-LRN-Q1)

Analysis of Q1 Team Outcomes:
- The average study time across candidates was 21 hours.
- The overall team pass rate was 68%.
- Core Observation: Learners who logged more than 20 study hours and attained greater than 75% average scores on practice assessments demonstrated significantly higher pass rates (92% pass probability) on official exams. Candidates with fewer than 18 study hours had a 71% fail rate.
  `,
  workload_insights: `
Workload and Learning Correlation Report (Synthetic Document Ref: REPT-WKL-04)

Key Scheduling Insights:
- Team members logging more than 20 meeting hours per week showed a 40% lower study plan completion rate due to schedule fragmentation.
- Optimal learning and retention occur when candidates have 12-18 meeting hours and at least 15 designated focus hours per week.
- Recommendation: Learning blocks should be programmatically scheduled directly inside focus-heavy calendar windows and protected from meeting encroachments. Reminders should trigger during the employee's self-selected focus slot (e.g. morning, afternoon) to minimize workflow disruptions.
  `,
};

// 5. Grounded Questions Database (Used by Assessment Agent with Citations)
export interface GroundedQuestion {
  id: string;
  certification: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  citation: string; // The exact document citation grounding the answer
  explanation: string;
}

export const SYNTHETIC_GROUNDED_QUESTIONS: GroundedQuestion[] = [
  // AZ-204
  {
    id: "Q-AZ204-01",
    certification: "AZ-204",
    question: "According to the Engineering Certification Guide, what is the primary certification target for a Cloud Engineer, and what readiness threshold is recommended before scheduling the exam?",
    options: [
      "Primary: AZ-305; Readiness Target: 70% practice score",
      "Primary: AZ-204; Readiness Target: 75% practice score",
      "Primary: AZ-400; Readiness Target: 80% practice score",
      "Primary: AZ-204; Readiness Target: 90% practice score"
    ],
    correctAnswerIndex: 1,
    citation: "Engineering Certification Enablement Guide (CERT-GD-2026) - Section 1 & 2",
    explanation: "The guide states that the primary certification target for a Cloud Engineer is AZ-204, and candidates should achieve at least a 75% score on practice assessments before scheduling the exam.",
  },
  {
    id: "Q-AZ204-02",
    certification: "AZ-204",
    question: "Under which workload conditions do optimal learning completion rates occur, based on historical work-study correlations?",
    options: [
      "When meeting hours exceed 25 per week and focus hours are under 10",
      "When meeting hours are between 12-18 and focus hours are at least 15 per week",
      "When meeting hours are completely zero and focus hours are 40 per week",
      "When meeting hours are 20 per week regardless of focus hours"
    ],
    correctAnswerIndex: 1,
    citation: "Workload and Learning Correlation Report (REPT-WKL-04) - Section 'Key Scheduling Insights'",
    explanation: "The Workload Insights report demonstrates that optimal learning completion and retention occur when team members have 12-18 meeting hours and at least 15 focus hours per week.",
  },
  // AZ-400
  {
    id: "Q-AZ400-01",
    certification: "AZ-400",
    question: "Based on the Q1 Team Learning Report, what correlation was observed between study hours, practice assessment scores, and eventual certification outcomes?",
    options: [
      "Study hours and scores had no measurable impact on official exam outcomes",
      "Logging over 10 study hours and a 50% score resulted in a 90% pass rate",
      "Logging more than 20 study hours and achieving over 75% on practice assessments yielded a 92% pass probability",
      "Logging 30+ study hours resulted in a 100% pass rate, regardless of practice scores"
    ],
    correctAnswerIndex: 2,
    citation: "Quarterly Learning Performance Summary (REPT-LRN-Q1) - Section 'Analysis of Q1 Team Outcomes'",
    explanation: "The report states that learners with more than 20 study hours and scores above 75% showed a 92% pass probability, whereas those with under 18 hours faced a 71% fail rate.",
  },
  {
    id: "Q-AZ400-02",
    certification: "AZ-400",
    question: "What is the primary certification target designated for DevOps Engineers in the engineering enabling document?",
    options: [
      "AZ-204 (Azure Developer Associate)",
      "AZ-305 (Solutions Architect Expert)",
      "AZ-400 (DevOps Engineer Expert)",
      "DP-203 (Azure Data Engineer Associate)"
    ],
    correctAnswerIndex: 2,
    citation: "Engineering Certification Enablement Guide (CERT-GD-2026) - Section 1",
    explanation: "The guide designates AZ-400 (DevOps Engineer Expert) as the primary target certification for the DevOps Engineer role.",
  },
  // DP-203
  {
    id: "Q-DP203-01",
    certification: "DP-203",
    question: "According to the Workload Insights report, what is the primary recommendation to prevent meeting encroachment on study time for learners?",
    options: [
      "Cancel all weekly standups for the team during study cycles",
      "Schedule study blocks programmatically inside focus-heavy calendar windows and protect them",
      "Force learners to study only outside standard working hours",
      "Delegate study scheduling completely to project managers"
    ],
    correctAnswerIndex: 1,
    citation: "Workload and Learning Correlation Report (REPT-WKL-04) - Section 'Recommendation'",
    explanation: "The report recommends programmatically scheduling study blocks inside focus-heavy windows and protecting them from meeting encroachments.",
  },
];
