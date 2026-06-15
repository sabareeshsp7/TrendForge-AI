// Synthetic Data & Documents for the Microsoft Foundry Reasoning Agents Challenge (Challenge A)

// 1. Work IQ: Expanded Work Activity Signals
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
  {
    employee_id: "EMP-005",
    name: "Keith Vance",
    role: "AI Engineer",
    meeting_hours_per_week: 14,
    focus_hours_per_week: 20,
    preferred_learning_slot: "Morning",
  },
  {
    employee_id: "EMP-006",
    name: "Maya Lin",
    role: "Data Scientist",
    meeting_hours_per_week: 16,
    focus_hours_per_week: 18,
    preferred_learning_slot: "Afternoon",
  },
  {
    employee_id: "EMP-007",
    name: "David Kim",
    role: "IT Administrator",
    meeting_hours_per_week: 10,
    focus_hours_per_week: 25,
    preferred_learning_slot: "Morning",
  },
  {
    employee_id: "EMP-008",
    name: "Sophia Martinez",
    role: "Security Engineer",
    meeting_hours_per_week: 20,
    focus_hours_per_week: 12,
    preferred_learning_slot: "Friday Focus Window",
  },
];

// 2. Fabric IQ: Expanded 15-Cert Semantic Model Catalog
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
      prerequisites: ["AZ-900"],
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
      prerequisites: ["DP-900"],
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
    {
      id: "AI-102",
      title: "Microsoft Certified: Azure AI Engineer Associate",
      roleAlignment: "AI Engineer",
      skills: ["Azure AI Search", "Cognitive Services API", "Custom Vision", "Azure OpenAI Integration", "Responsible AI Guardrails"],
      recommended_hours: 24,
      prerequisites: ["AI-900"],
      pass_threshold_percent: 75,
    },
    {
      id: "DP-100",
      title: "Microsoft Certified: Azure Data Scientist Associate",
      roleAlignment: "Data Scientist",
      skills: ["Azure Machine Learning Studio", "Model Training & Pipelines", "Hyperparameter Tuning", "Data Modeling", "MLOps Lifecycle"],
      recommended_hours: 26,
      prerequisites: ["DP-900"],
      pass_threshold_percent: 75,
    },
    {
      id: "AZ-104",
      title: "Microsoft Certified: Azure Administrator Associate",
      roleAlignment: "IT Administrator",
      skills: ["Virtual Networking", "Azure Active Directory / Entra ID", "Virtual Machine Scale Sets", "Backup & Recovery"],
      recommended_hours: 22,
      prerequisites: ["AZ-900"],
      pass_threshold_percent: 75,
    },
    {
      id: "AZ-500",
      title: "Microsoft Certified: Azure Security Engineer Associate",
      roleAlignment: "Security Engineer",
      skills: ["Key Vault Management", "Network Security Groups", "Azure Sentinel", "Information Protection", "Privileged Identity"],
      recommended_hours: 28,
      prerequisites: ["AZ-104"],
      pass_threshold_percent: 78,
    },
    {
      id: "SC-200",
      title: "Microsoft Certified: Security Operations Analyst Associate",
      roleAlignment: "Security Operations Analyst",
      skills: ["Sentinel Threat Detection", "Defender for Endpoint", "Kusto Query Language (KQL)", "Incident Response"],
      recommended_hours: 22,
      prerequisites: ["AZ-900"],
      pass_threshold_percent: 75,
    },
    {
      id: "PL-300",
      title: "Microsoft Certified: Power BI Data Analyst",
      roleAlignment: "Business Intelligence Analyst",
      skills: ["DAX Query Building", "Data Cleansing", "Interactive Dashboards", "Row-Level Security Configuration"],
      recommended_hours: 18,
      prerequisites: ["DP-900"],
      pass_threshold_percent: 75,
    },
    {
      id: "DP-300",
      title: "Microsoft Certified: Azure Database Administrator Associate",
      roleAlignment: "Database Administrator",
      skills: ["Azure SQL Database tuning", "High Availability Clusters", "Security & Encryption", "Query Optimization"],
      recommended_hours: 24,
      prerequisites: ["DP-900"],
      pass_threshold_percent: 75,
    },
    {
      id: "AZ-900",
      title: "Microsoft Certified: Azure Fundamentals",
      roleAlignment: "Junior Engineer",
      skills: ["Cloud Architecture Core", "Azure Services Overview", "Cost Management & SLAs", "Privacy & Compliance"],
      recommended_hours: 10,
      prerequisites: [],
      pass_threshold_percent: 70,
    },
    {
      id: "AI-900",
      title: "Microsoft Certified: Azure AI Fundamentals",
      roleAlignment: "AI Enthusiast",
      skills: ["Machine Learning Basics", "Computer Vision Concepts", "Natural Language Processing", "Responsible AI Core"],
      recommended_hours: 10,
      prerequisites: [],
      pass_threshold_percent: 70,
    },
    {
      id: "DP-900",
      title: "Microsoft Certified: Azure Data Fundamentals",
      roleAlignment: "Junior Data Analyst",
      skills: ["Relational Core", "Non-Relational Concepts", "Modern Data Warehousing", "Power BI Basics"],
      recommended_hours: 10,
      prerequisites: [],
      pass_threshold_percent: 70,
    },
    {
      id: "MS-900",
      title: "Microsoft Certified: Microsoft 365 Fundamentals",
      roleAlignment: "IT Support Specialist",
      skills: ["SaaS Core Models", "Microsoft 365 Core Services", "Security & Compliance Essentials", "Licensing Options"],
      recommended_hours: 8,
      prerequisites: [],
      pass_threshold_percent: 70,
    },
  ],
};

// 3. Learner Performance Dataset
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

// 4. Grounding Docs
export const SYNTHETIC_KNOWLEDGE_DOCS = {
  certification_guide: `
Engineering Certification Enablement Guide (Synthetic Document Ref: CERT-GD-2026)

This official reference details the certification expectations for technical teams:

1. Alignment of Roles to Certifications:
   - Cloud Engineer: Primary Target is AZ-204. Secondary Target is AZ-305.
   - DevOps Engineer: Primary Target is AZ-400.
   - Data Engineer: Primary Target is DP-203.
   - AI Engineer: Primary Target is AI-102.
   - Data Scientist: Primary Target is DP-100.
   - IT Administrator: Primary Target is AZ-104.
   - Security Engineer: Primary Target is AZ-500.

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
- Recommendation: Learning blocks should be programmatically scheduled directly inside focus-heavy calendar windows and protected from meeting encroachments. Reminders should trigger during the employee's self-selected focus slot to minimize workflow disruptions.
  `,
};

// 5. Realistic Grounded Practice Questions (for all 15 Certifications)
export interface GroundedQuestion {
  id: string;
  certification: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  citation: string;
  explanation: string;
}

export const SYNTHETIC_GROUNDED_QUESTIONS: GroundedQuestion[] = [
  // AZ-204
  {
    id: "Q-AZ204-01",
    certification: "AZ-204",
    question: "You are designing an Azure Function to process message streams from an Azure Event Hub. The function requires high throughput and must scale automatically under spikes. Which hosting plan should you configure to support this scenario?",
    options: [
      "Consumption Plan",
      "App Service Plan (Shared)",
      "Premium Plan",
      "App Service Plan (Free)"
    ],
    correctAnswerIndex: 2,
    citation: "Azure Functions Documentation - Hosting Plans Scale Comparison",
    explanation: "The Premium Plan provides features like pre-warmed instances to avoid cold starts, virtual network connectivity, and rapid event-driven scaling, making it optimal for high-throughput Event Hub processing.",
  },
  {
    id: "Q-AZ204-02",
    certification: "AZ-204",
    question: "You are developing a web app that updates catalog listings in Azure Cosmos DB. You need to configure the partition key to optimize query performance and scale. Which property should you select?",
    options: [
      "A property with a low cardinality of values (e.g. 'Status')",
      "A unique transaction timestamp for every single record",
      "A property with a balanced, high-cardinality of values (e.g. 'ProductId')",
      "The default system physical partition ID"
    ],
    correctAnswerIndex: 2,
    citation: "Azure Cosmos DB Design Guidelines - Partition Key Selection",
    explanation: "A high-cardinality partition key like ProductId ensures that data and request throughput are distributed evenly across physical partitions, avoiding 'hot' partition bottlenecks.",
  },
  // AZ-400
  {
    id: "Q-AZ400-01",
    certification: "AZ-400",
    question: "You are setting up a CI/CD pipeline using GitHub Actions to deploy containerized services to Azure Kubernetes Service (AKS). You want to securely connect to Azure without storing long-lived credentials in GitHub Secrets. What should you configure?",
    options: [
      "Save Azure Subscription Service Principal Key in plain text in the workflow YAML",
      "Configure OpenID Connect (OIDC) federation between GitHub Actions and Azure Active Directory",
      "Disable security checks on the AKS cluster temporarily during deployment",
      "Store subscription passwords inside the repository's Git history"
    ],
    correctAnswerIndex: 1,
    citation: "GitHub Actions Security Guides - Configuring OIDC in Azure",
    explanation: "OIDC federation allows the GitHub Actions workflow runner to request short-lived access tokens from Azure AD via federated identity credentials, eliminating the need to manage permanent Azure Service Principal credentials.",
  },
  {
    id: "Q-AZ400-02",
    certification: "AZ-400",
    question: "You need to automate infrastructure provisioning for Azure environments using Infrastructure as Code (IaC). The team requires strict state validation, lock safety, and drift detection before updates are applied. Which tool satisfies this?",
    options: [
      "Manual Azure portal configuration steps",
      "Terraform with remote state stored in Azure Blob Storage with Lease Lock",
      "Raw Azure CLI scripts run from local terminals",
      "Custom PowerShell scheduling sheets"
    ],
    correctAnswerIndex: 1,
    citation: "Infrastructure as Code Best Practices - State Locking in Terraform",
    explanation: "Terraform remote state in Blob Storage combined with lock verification safeguards against concurrent executions overriding states, and allows drift analysis before applying updates.",
  },
  // DP-203
  {
    id: "Q-DP203-01",
    certification: "DP-203",
    question: "You are configuring a serverless SQL pool inside Azure Synapse Analytics to query CSV files in Azure Data Lake Storage Gen2. To optimize read speeds, which folder structure and query pattern should you apply?",
    options: [
      "Place all data files in a single root directory with no folders",
      "Partition files hierarchically by Year/Month/Day, and use the filepath() function in queries",
      "Store files in random compressed zip files containing varied structures",
      "Import data files into standard relational staging tables before running queries"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Synapse Serverless SQL Pool Performance Tuning Guide",
    explanation: "Partitioning files in hierarchical subfolders and using Synapse's filepath() function in queries filters out folders outside the range, reducing scanned file data volumes.",
  },
  {
    id: "Q-DP203-02",
    certification: "DP-203",
    question: "You need to design a high-velocity stream processing architecture that ingests telemetry events from thousands of IoT devices and aggregates metrics in 5-minute sliding windows. Which Azure services should you choose?",
    options: [
      "Azure Data Factory copy activities to Azure Storage",
      "Azure Event Hubs followed by Azure Stream Analytics",
      "Azure Logic Apps writing data to local Excel databases",
      "Azure Storage Queue writing data to local PostgreSQL instances"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Stream Analytics Architecture Blueprint",
    explanation: "Azure Event Hubs acts as the real-time event ingester, and Stream Analytics processes event streams natively with sliding/tumbling temporal windows.",
  },
  // AZ-305
  {
    id: "Q-AZ305-01",
    certification: "AZ-305",
    question: "You are designing an identity access management strategy for an organization with multiple business units. The security team demands that external vendor accounts have access to specific Azure resources, but must be managed inside their home directory without duplicating credentials. What should you recommend?",
    options: [
      "Create duplicate local Azure AD guest accounts for all vendor employees",
      "Implement Azure AD B2B collaboration and configure guest invitations",
      "Implement Azure AD B2C tenant and build custom vendor registries",
      "Instruct vendor users to share administrator account credentials"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Active Directory Design Principles - B2B vs B2C Roles",
    explanation: "Azure AD B2B collaboration permits organizations to invite guest users from vendor directories. The vendor manages their credentials, while the host organization handles resource access permissions.",
  },
  {
    id: "Q-AZ305-02",
    certification: "AZ-305",
    question: "You need to architect a storage redundancy strategy for a critical application database that requires 99.999% read availability and protection against regional disasters. Which storage account configuration should you select?",
    options: [
      "Locally Redundant Storage (LRS)",
      "Zone Redundant Storage (ZRS)",
      "Read-Access Geo-Zone Redundant Storage (RA-GZRS)",
      "Geo-Redundant Storage (GRS)"
    ],
    correctAnswerIndex: 2,
    citation: "Azure Storage Redundancy Design Guidelines",
    explanation: "RA-GZRS replicates data across three availability zones in the primary region, georeplicates it to a secondary region, and enables read-only operations on the secondary replica for high availability.",
  },
  // AI-102
  {
    id: "Q-AI102-01",
    certification: "AI-102",
    question: "You are implementing Azure AI Search to index custom PDF document repositories. The search engine needs to parse scanned document text and extract locations, key phrases, and organization names. Which component should you define in the indexer configuration?",
    options: [
      "A custom custom database analyzer mapping values",
      "An Azure AI Search Cognitive Search Skillset with OCR and Entity Recognition skills",
      "A scheduled Azure Function that manual scripts parsing actions",
      "An Azure Cosmos DB change feed listener track"
    ],
    correctAnswerIndex: 1,
    citation: "Azure AI Search Cognitive Enrichment Pipelines Guides",
    explanation: "Skillsets represent enrichment steps. OCR extracts scanned text, and Entity Recognition identifies entities like names, locations, and organizations.",
  },
  {
    id: "Q-AI102-02",
    certification: "AI-102",
    question: "You are building a chat assistant application using Azure OpenAI Service. The system must filter out inappropriate user prompts and model responses that match hate, sexual, violence, and self-harm categories. What should you configure?",
    options: [
      "Manually review every prompt in a middle service proxy layer",
      "Configure Azure OpenAI Custom Content Filters with appropriate threshold levels",
      "Rely on client-side JavaScript regex checks",
      "Write custom ML models to classify inputs locally"
    ],
    correctAnswerIndex: 1,
    citation: "Azure OpenAI Content Filtering documentation",
    explanation: "Azure OpenAI includes configurable content filters powered by safety models. Adjusting thresholds (Low, Medium, High) determines what triggers a block.",
  },
  // DP-100
  {
    id: "Q-DP100-01",
    certification: "DP-100",
    question: "You are configuring an Azure Machine Learning workspace pipeline to train a deep learning model. The process takes several hours and requires GPU compute. To minimize costs, what type of compute targets should you create?",
    options: [
      "A dedicated, always-on VM scale set",
      "An Azure Machine Learning Compute cluster configured with min_nodes = 0 and auto-scale idle timeouts",
      "Azure Kubernetes Service (AKS) always active nodes",
      "Local developer workstations"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Machine Learning Compute Clusters Configurations Guide",
    explanation: "Setting min_nodes to 0 ensures that virtual machines are dynamically spun up when a training job starts and terminated when idle, minimizing idle compute costs.",
  },
  {
    id: "Q-DP100-02",
    certification: "DP-100",
    question: "You need to find the best hyperparameters for a PyTorch classification model trained in Azure ML. The search space is large. Which Azure ML feature should you run to automate selection?",
    options: [
      "Manual batch runs with distinct parameters",
      "A HyperDrive sweep run defining parameter sampling (e.g. RandomSampling) and early termination policies",
      "Azure Data Factory copy activities checking logs",
      "Custom Python loops executing on local kernels"
    ],
    correctAnswerIndex: 1,
    citation: "Azure ML Hyperparameter Tuning (HyperDrive) Guide",
    explanation: "HyperDrive manages hyperparameter sweeps. It samples parameters, runs training jobs in parallel, and applies early termination policies to stop low-performing runs.",
  },
  // AZ-104
  {
    id: "Q-AZ104-01",
    certification: "AZ-104",
    question: "You have two virtual networks (VNet1 in East US and VNet2 in West US). You configure virtual network peering between VNet1 and VNet2. Virtual machines on VNet1 cannot ping virtual machines on VNet2. What should you check first in the peering settings?",
    options: [
      "The VM operating system licenses",
      "The 'Allow forwarded traffic' and 'Allow gateway transit' checkboxes on peering properties",
      "The virtual machine processor cores configuration",
      "Ensure VNet1 and VNet2 do not have overlapping IP address spaces"
    ],
    correctAnswerIndex: 3,
    citation: "Azure Virtual Network Peering Requirements Guide",
    explanation: "Virtual network peering requires that VNets have non-overlapping IP address ranges. Overlapping address spaces prevent peering configuration and routing.",
  },
  {
    id: "Q-AZ104-02",
    certification: "AZ-104",
    question: "You need to ensure that all resource groups created in your subscription are assigned a tag named 'Environment' with allowed values of 'Prod', 'Stage', or 'Dev'. What should you implement?",
    options: [
      "A recurring Azure Automation PowerShell script checking names",
      "An Azure Policy definition configured with the 'Require a tag and its value' effect",
      "Azure Active Directory user permission restrictions",
      "Weekly manual audits of resource group configurations"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Policy Tags Enforcement Documentation",
    explanation: "Azure Policy allows organizations to enforce rules on resources. The policy checks properties on creation and blocks non-compliant resource groups.",
  },
  // AZ-500
  {
    id: "Q-AZ500-01",
    certification: "AZ-500",
    question: "You are configuring Azure Key Vault to store database connection strings. Security rules dictate that developers can read keys only during staging deployments, and administrative access must be restricted to cloud operations managers. What should you configure?",
    options: [
      "Access control policies in the subscription level",
      "Key Vault Access Policies or Azure Role-Based Access Control (Azure RBAC) at key level",
      "Network security lists blocking specific IP ranges",
      "Lock databases to accept requests only from direct console users"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Key Vault Permissions & Security Guidelines",
    explanation: "Azure Key Vault access can be controlled using Access Policies or Azure RBAC. This enables granular permissions (Get, List, Set, Delete) on keys, secrets, or certificates.",
  },
  {
    id: "Q-AZ500-02",
    certification: "AZ-500",
    question: "You need to secure virtual machine command-line terminal management in Azure. The virtual machines are isolated on private subnets, and standard SSH/RDP ports must not be exposed to the public internet. What should you provision?",
    options: [
      "Deploy a public-facing virtual machine acting as an open proxy bridge",
      "Configure Azure Bastion subnet inside the virtual network",
      "Expose port 3389 publicly on all network security lists",
      "Establish a physical site-to-site VPN connection"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Bastion Deployment Architecture documentation",
    explanation: "Azure Bastion provides secure RDP/SSH access to VMs directly through the Azure portal over SSL. VMs do not require public IP addresses.",
  },
  // SC-200
  {
    id: "Q-SC200-01",
    certification: "SC-200",
    question: "You are setting up custom threat alerts in Microsoft Sentinel. You need to identify instances where an active user account logs in from two geographically distinct locations in under 1 hour. What should you write?",
    options: [
      "A manual review policy checking audit tables daily",
      "A Kusto Query Language (KQL) query calculating geodistances and filtering logins by timestamp differences",
      "An automated alert triggering emails on every successful login",
      "A logic app routing data to external SQL tracking systems"
    ],
    correctAnswerIndex: 1,
    citation: "Microsoft Sentinel KQL Analytics Rules documentation",
    explanation: "KQL queries in Microsoft Sentinel analyze security events. The query tracks user sign-ins, parses locations, and flags impossible travel times.",
  },
  {
    id: "Q-SC200-02",
    certification: "SC-200",
    question: "You need to investigate a malware incident on an enterprise workstation using Microsoft Defender for Endpoint. The security team wants to isolate the machine from network communications immediately. What action should you take?",
    options: [
      "Delete the workstation configuration record from active AD registries",
      "Trigger the 'Isolate device' response action from the Microsoft Defender portal",
      "Configure custom network adapter policies in the subnet routing tables",
      "Request local IT support to physically power down the workstation unit"
    ],
    correctAnswerIndex: 1,
    citation: "Microsoft Defender for Endpoint Response Actions documentation",
    explanation: "The 'Isolate device' action disconnects the machine from the network while maintaining connectivity to the Defender service, allowing security teams to investigate.",
  },
  // PL-300
  {
    id: "Q-PL-300-01",
    certification: "PL-300",
    question: "You are building a Power BI report using import storage mode. The source database contains tables with millions of rows. You need to optimize the semantic model to improve dashboard refresh rates and reduce size. What should you do?",
    options: [
      "Retain all source database columns, including unique GUIDs and raw timestamps",
      "Remove unnecessary columns, summarize data at the required granularity, and avoid high-cardinality keys",
      "Configure DirectQuery on all tables and reload metrics on every user click",
      "Increase the report memory size parameters in Power BI Desktop"
    ],
    correctAnswerIndex: 1,
    citation: "Power BI Performance Optimization - Modeling Best Practices",
    explanation: "The VertiPaq engine compresses imported data. Removing columns, minimizing cardinality, and avoiding columns like GUIDs optimizes model memory usage.",
  },
  {
    id: "Q-PL-300-02",
    certification: "PL-300",
    question: "You need to enforce row-level security (RLS) in a Power BI report so that managers can view sales records only for their assigned territory. What DAX filter expression should you apply?",
    options: [
      "CALCULATE(Sales[Amount], Sales[Territory] = USERNAME())",
      "Sales[Territory] = USERNAME() (or USERPRINCIPALNAME())",
      "Sales[Territory] = 'All Territories'",
      "FILTER(Sales, Sales[Territory] = USERNAME()) in data tables"
    ],
    correctAnswerIndex: 1,
    citation: "Power BI Row-Level Security Rules Guide",
    explanation: "In Power BI Desktop, RLS is configured by adding DAX filter expressions on tables. The expression dynamically filters rows based on the user's login principal.",
  },
  // DP-300
  {
    id: "Q-DP300-01",
    certification: "DP-300",
    question: "You are managing an Azure SQL Database that experiences temporary performance slowdowns. You want to identify historical execution plans, runtime statistics, and resource-consuming queries. Which feature should you enable?",
    options: [
      "SQL Server Agent alert logs",
      "Query Store",
      "Extended Events on local drives",
      "Database dynamic management views (DMVs) manual scripts"
    ],
    correctAnswerIndex: 1,
    citation: "Azure SQL Database Query Store documentation",
    explanation: "Query Store acts as a data flight recorder for databases, capturing query execution plans, histories, and resource consumption details over time.",
  },
  {
    id: "Q-DP300-02",
    certification: "DP-300",
    question: "You need to migrate multiple on-premises Microsoft SQL Server databases to Azure. The databases have unpredictable resource usage peaks, but share a common security policy framework. Which deployment option minimizes costs?",
    options: [
      "Configure separate Azure SQL Databases using dedicated premium DTU tiers",
      "Azure SQL Database Elastic Pools",
      "Deploy separate VMs in Azure running individual database nodes",
      "Store database backup files in Azure Storage and read them via proxy layers"
    ],
    correctAnswerIndex: 1,
    citation: "Azure SQL Database Elastic Pools Planning documentation",
    explanation: "Elastic Pools allow databases to share a set of compute resources (eDTUs or vCores). This matches databases with variable resource peaks.",
  },
  // AZ-900
  {
    id: "Q-AZ900-01",
    certification: "AZ-900",
    question: "An organization is migrating services to Azure. The finance department wants to shift infrastructure costs from capital expenditures (CapEx) to operational expenditures (OpEx). Which cloud benefit supports this transition?",
    options: [
      "High Availability",
      "Consumption-based pricing models",
      "Predictable licensing agreements",
      "Global scaling capacities"
    ],
    correctAnswerIndex: 1,
    citation: "Microsoft Cloud Fundamentals - CapEx vs OpEx Overview",
    explanation: "Cloud computing operates on a consumption-based pricing model. Organizations pay for resources as they consume them, shifting costs to OpEx.",
  },
  {
    id: "Q-AZ900-02",
    certification: "AZ-900",
    question: "Under the Azure Shared Responsibility Model, which security task remains the sole responsibility of the customer across SaaS, PaaS, and IaaS models?",
    options: [
      "Physical host security and data centers access controls",
      "Virtual network firewall configurations",
      "Classification of data and access management permissions",
      "Host operating system security patching policies"
    ],
    correctAnswerIndex: 2,
    citation: "Microsoft Cloud Shared Responsibility Model documentation",
    explanation: "The customer retains responsibility for managing their data, access permissions, accounts, and endpoints across all cloud models.",
  },
  // AI-900
  {
    id: "Q-AI900-01",
    certification: "AI-900",
    question: "An organization builds an AI model to evaluate home loan approvals. The model consistently rejects applicants from specific ZIP codes based on historic bias. Which principle of Responsible AI is violated?",
    options: [
      "Inclusiveness",
      "Fairness",
      "Reliability & Safety",
      "Privacy & Security"
    ],
    correctAnswerIndex: 1,
    citation: "Microsoft Responsible AI principles - Fairness Guidelines",
    explanation: "The fairness principle mandates that AI systems should treat all people fairly, preventing bias based on race, gender, location, or socioeconomic status.",
  },
  {
    id: "Q-AI900-02",
    certification: "AI-900",
    question: "Which machine learning type is used to predict a continuous numeric value, such as predicting home prices based on size, location, and rooms?",
    options: [
      "Classification",
      "Regression",
      "Clustering",
      "Reinforcement Learning"
    ],
    correctAnswerIndex: 1,
    citation: "Microsoft AI Fundamentals - Supervised Learning Types",
    explanation: "Regression is a supervised learning type used to predict continuous numeric targets, whereas classification predicts discrete categories.",
  },
  // DP-900
  {
    id: "Q-DP900-01",
    certification: "DP-900",
    question: "You need to store semi-structured JSON product catalog data that requires low-latency writes and global distribution. Which Azure database service fits this?",
    options: [
      "Azure SQL Database",
      "Azure Cosmos DB using the NoSQL API",
      "Azure Synapse Analytics serverless pools",
      "Azure Blob Storage archives"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Data Services - Cosmos DB APIs Overview",
    explanation: "Azure Cosmos DB is a globally distributed NoSQL database designed for semi-structured data, providing single-digit millisecond latency reads and writes.",
  },
  {
    id: "Q-DP900-02",
    certification: "DP-900",
    question: "Which data processing type involves executing a batch of raw records at regular intervals (e.g. nightly), rather than analyzing events instantly as they occur?",
    options: [
      "Stream Processing",
      "Batch Processing",
      "Real-time analytics",
      "Transactional OLTP execution"
    ],
    correctAnswerIndex: 1,
    citation: "Azure Data Fundamentals - Batch vs Stream Processing",
    explanation: "Batch processing collects data records over time and processes them in batches, whereas stream processing handles data records in real time.",
  },
  // MS-900
  {
    id: "Q-MS900-01",
    certification: "MS-900",
    question: "Your organization wants to evaluate Microsoft 365 licensing. Users require access to Word, Excel, Exchange email, and advanced threat protection tools. Which plan is the minimum license required?",
    options: [
      "Microsoft 365 F3 (Firstline)",
      "Microsoft 365 Business Basic",
      "Microsoft 365 E5 (Enterprise)",
      "Microsoft 365 E3 (Enterprise)"
    ],
    correctAnswerIndex: 2,
    citation: "Microsoft 365 Licensing Options - E3 vs E5 Comparison",
    explanation: "Microsoft 365 E5 includes core productivity applications alongside advanced security and threat protection compliance tools.",
  },
  {
    id: "Q-MS900-02",
    certification: "MS-900",
    question: "Which Microsoft 365 tool provides central dashboards to configure policies, audit user sign-ins, and restrict application access based on device compliance rules?",
    options: [
      "Microsoft 365 Admin Center",
      "Microsoft Purview Compliance Portal",
      "Microsoft Entra ID (Azure Active Directory) and Microsoft Intune",
      "Microsoft Teams Admin Center"
    ],
    correctAnswerIndex: 2,
    citation: "Microsoft 365 Security Capabilities overview",
    explanation: "Microsoft Entra ID manages identity, and Microsoft Intune handles device enrollment and compliance policies.",
  }
];
