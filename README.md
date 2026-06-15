# ⚡ TrendForge AI

> **Real-Time AI Career & Technology Intelligence**

TrendForge AI is a premium, state-of-the-art Next.js web application designed to eliminate career guesswork. By aggregating live technology signals across the web (including GitHub, Hacker News, and global tech feeds) and reasoning over them using Advanced LLM architectures, TrendForge AI generates hyper-personalized, trend-aware learning roadmaps and industry insights for modern developers.

---

## 🚀 Key Features

### 1. 🏠 Landing Page (Home)
- **Live Signal Tracker**: Displays real-time trending scores for high-velocity technologies (e.g., AI Agents, MCP Servers, LangGraph).
- **Market Intelligence Grid**: Highlights the fastest-growing AI skills, highly demanded roles, and immediate technological shifts.
- **Aesthetic Floating Cards**: Utilizes dynamic, keyframe-animated floating cards reflecting the latest tech trends and growth rates.

### 2. 📊 Live Trend Dashboard (`/dashboard`)
- **Visual Analytics**: Interactive 7-day trend area charts ("Tech Trend Wave") mapping developer interest across domains.
- **Breaking News Ticker**: Shows live developer telemetry updates with computed impact scores.
- **Relevance Progress Indicators**: Measures modern vs. legacy technology dominance in real time.

### 3. 🔍 Deep-Dive Tech Analytics (`/trends`)
- **AI Tech Stack Analyzer**: An interactive lookup engine allowing users to query any language, framework, database, or tool to pull live growth, demand, and 12-month forecasts.
- **Market Domain Radar**: Recharts-powered radar visualization representing current demand shares.
- **Tech Momentum Board**: Leaderboards indexing rising vs. declining technologies (e.g., Rust and Go vs. legacy Cordova).
- **Hacker News Integration**: Real-time trending topics and scoring boards.

### 4. 📰 Tech News Intelligence Feed (`/news`)
- **Live Scraper API**: Fetches live articles and categorizes them automatically (AI, Cloud, Dev Tools, Database, Web, etc.).
- **Impact & Sentiment Analysis**: Dynamically scores article impact and maps it visually (Critical, High, Medium).
- **Signal Volume Graphs**: Responsive analytics detailing signal density changes.
- **Telemetry Toggles**: Includes auto-refresh capabilities and filter parameters.

### 5. 🧠 AI Roadmap Generator (`/roadmap`)
- **Interactive Profiler**: Collects user skillsets, target roles, timeline preferences (1 month to 1 year), and experience levels.
- **Personalized Week-by-Week Plans**: Renders detailed study phases containing exact skill modules and non-generic, execution-focused capstone projects.
- **Hiring Probability Gauge**: Computes realistic success rates based on live hiring volumes.
- **Interactive Customization**: Enables users to chat back-and-forth with the AI to refine or customize their roadmap (e.g., request Docker integrations, adjust study pacing).

### 6. 💡 AI Career Insights (`/insights`)
- **Automation Risk Assessment**: Highlights developer roles and workflows most vulnerable to AI replacement.
- **Role Trajectory Predictions**: Forecasts market demand curves for next-generation developer titles.
- **Emerging Tech Stacks**: Recommends modern stack combinations tailored for low latency and high scalability.

---

## 🛠️ Technology Stack

TrendForge AI utilizes a modern, performance-optimized tech stack:

*   **Core Framework**: [Next.js 16.2.9](https://nextjs.org/) (App Router, Turbopack)
*   **User Interface**: [React 19.2.4](https://react.dev/) / [React DOM 19.2.4](https://react.dev/)
*   **Styling System**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS mapping for advanced animations, fluid grids, and glassmorphism.
*   **Icons**: [Lucide React 1.18.0](https://lucide.dev/)
*   **Visualizations**: [Recharts 3.8.1](https://recharts.org/) (Area, Bar, Radar, and Line Charts)
*   **AI Engine**: [Azure OpenAI Client SDK](https://learn.microsoft.com/en-us/azure/ai-services/openai/) (utilizing **GPT-4o** reasoning deployments)
*   **News Scrapers**: Integration with NewsAPI & GNews API services
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode configurations)
*   **Networking**: [Axios 1.17.0](https://axios-http.com/)

---

## 📁 Codebase Directory Structure

```text
trendforge-ai/
├── src/
│   ├── app/                      # Next.js App Router (pages and layouts)
│   │   ├── about/                # Project Mission page
│   │   ├── api/                  # Backend REST API endpoints
│   │   │   ├── news/             # Scrapes & categorizes technology news
│   │   │   │   └── route.ts
│   │   │   ├── roadmap/          # Communicates with GPT-4o for study plans
│   │   │   │   └── route.ts
│   │   │   └── trends/           # Evaluates search terms & signal frequencies
│   │   │       └── route.ts
│   │   ├── dashboard/            # Trend Dashboard with area visualizations
│   │   ├── insights/             # Career automation and role forecasts
│   │   ├── news/                 # News Intelligence Feed UI
│   │   ├── roadmap/              # AI Roadmap questionnaire & customization UI
│   │   ├── trends/               # Interactive search engine & domain radar
│   │   ├── globals.css           # Styling theme, animations, and Tailwind imports
│   │   └── layout.tsx            # Root layout containing custom fonts & viewport metadata
│   ├── components/
│   │   └── Navbar.tsx            # Responsive sticky navigation (desktop & mobile)
│   └── lib/
│       └── mockData.ts           # Predefined datasets for initial rendering
├── package.json                  # Dependencies & execution scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── next.config.ts                # Next.js runtime configurations
```

---

## ⚙️ Environment Configuration

To run TrendForge AI with full real-time capabilities, create a `.env.local` file in the root of the `trendforge-ai/` directory and configure the following variables:

```env
# Azure OpenAI Credentials
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Telemetry News APIs
NEWSAPI_KEY=your_newsapi_key
GNEWS_API_KEY=your_gnews_key
```

> 💡 **Note**: If Azure OpenAI credentials are not configured, TrendForge AI automatically falls back to a high-fidelity local simulation system that calculates trends, analyzes keywords, and outputs complete roadmap responses dynamically.

---

## 🚀 Setup & Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.x or later) and `npm` installed.

### 1. Install Dependencies
Navigate to the project directory and install the required packages:
```bash
npm install
```

### 2. Run the Development Server
Launch the local server using Next.js Turbopack compiler for fast builds:
```bash
npm run dev
```

### 3. Open the Application
Open your browser and navigate to:
```url
http://localhost:3000
```

---

## 🌐 API Reference

### `POST /api/roadmap`
Generates or refines week-by-week learning paths based on skills, target goals, timelines, and difficulty level.
- **Request Body**:
  ```json
  {
    "skills": "Python, SQL",
    "goal": "AI Engineer",
    "timeline": "3 months",
    "level": "intermediate",
    "customPrompt": "Focus on Kubernetes deployment", // Optional: for modifications
    "currentRoadmap": {}                             // Optional: for modifications
  }
  ```
- **Response**: Returns a detailed JSON plan mapping weekly skills, project definitions, resource suggestions, and hiring probability metrics.

### `GET /api/news`
Scrapes global headlines and returns tech-relevant developer news, scored by impact values and categorized by technology.
- **Response**: `Array` of news objects featuring sources, published timestamps, categorizations, and tags.

### `GET /api/trends`
Computes search frequency, mentions growth, and builds domain hotness indexes by scanning aggregated news bodies.
- **Response**: Aggregated charts statistics and category-wise momentum ratios.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
