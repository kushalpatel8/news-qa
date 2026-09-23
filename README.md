# Guard AI — Quality Assurance & Test Engineering Platform

Guard AI is an enterprise-grade QA management and automation platform designed specifically for newsrooms, editorial teams, software developers, and media organizations. By combining manual test engineering, automated REST API testing, UI test suite monitoring, bug lifecycle tracking, and **Google Gemini AI-powered automated test generation**, Guard AI closes the loop on quality assurance for digital publishing platforms.

---

## 🌟 Key Platform Features

### 1. 🤖 AI-Powered Test Case Generation (News Guard AI)
- **Requirement-to-Test Generator**: Input feature specifications or user stories, and Guard AI (powered by Google Gemini 1.5 Pro & LangChain) automatically generates structured test cases with preconditions, step-by-step actions, expected results, and severity tags.
- **Direct Database Injection**: Save AI-suggested test cases directly into MongoDB with a single click.

### 2. 📰 Editorial Article Quality Control & AI Fact-Checking
- **Deterministic Validation Rules**: Automated real-time checks for mandatory metadata (Headline, Author, Category), word count thresholds, and external link validation.
- **Live AI Fact-Checking**: Scans article text for factual claims, verifies them using live web search via Tavily AI, highlights inconsistencies, and calculates an **AI Probability Score**.

### 3. ⚡ Interactive REST API Testing Suite
- **In-Browser HTTP Client**: Execute `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests directly from the dashboard.
- **Response Diagnostics**: Instant latency measurement (`ms`), HTTP status code badges, JSON body formatter, header inspector, and response schema validator.

### 4. 🎭 Automated UI Testing (Playwright Scaffolding)
- **Suite Execution Tracker**: Monitor end-to-end Playwright UI test suite execution across multiple browser viewports.
- **Pass/Fail Metrics**: Track individual test suite execution durations, last run timestamps, and suite stability.

### 5. 🐛 Defect & Bug Tracking Lifecycle
- **End-to-End Bug Workflow**: Log, assign, and track defects across `OPEN`, `IN_PROGRESS`, `FIXED`, and `VERIFIED` states.
- **Severity & Priority Tagging**: Categorize issues by `LOW`, `MEDIUM`, `HIGH`, and `CRITICAL` severity with environment tags (Production, Staging, QA).

### 6. 📊 Executive Quality Reports & Analytics
- **Visual Analytics**: Interactive Recharts charts for **Module Execution Results** and **Test Volume Distribution**.
- **Instant KPIs**: Real-time pass rates, total test counts, failing test breakdown, critical bug summary, and cached metrics via Upstash Redis.
- **Export & Print**: Download full JSON execution reports or generate formatted print layouts for executive reporting.

---

## 🔐 Role-Based Access Control (RBAC)

Guard AI enforces strict security policies managed via **Clerk Authentication**. Capabilities are scoped dynamically by user role:

| Feature / Action | QA | Editor | Admin | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **Create & Edit Test Cases** | ✅ | ❌ | ✅ | ❌ |
| **Delete Test Cases** | ✅ | ❌ | ✅ | ❌ |
| **Execute Test Runs** | ✅ | ❌ | ✅ | ❌ |
| **Create & Edit Articles** | ❌ | ✅ | ✅ | ❌ |
| **Run Article QA & Fact Check** | ✅ | ✅ | ✅ | ❌ |
| **Log & Manage Bugs** | ✅ | ✅ | ✅ | ❌ |
| **View Reports & Metrics** | ✅ | ✅ | ✅ | ✅ |

---

## 🎨 9-Color Deep Abyssal Oceanic Design System

Guard AI features a high-contrast theme engineered specifically for long QA sessions and data-dense dashboards:

| UI Role | Color Name | Hex Code | Visual Application |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Deep Abyssal Blue | `#070F1E` | Primary page base, main backdrop |
| **Card / Surface** | Midnight Ocean Navy | `#0D1B2A` | Project containers, test-runner cards |
| **Surface Elevate / Code**| Dark Oceanic Slate | `#13253B` | Code blocks, input fields, test step boxes |
| **Border Accent** | Muted Subsea Line | `#1E3A5F` | Clean 1px card/table borders |
| **Primary Typography** | Ice White | `#E2F1FF` | Headers, page titles, high-contrast text |
| **Secondary Typography** | Submerged Mist | `#88A4C4` | Body descriptions, metadata, logs |
| **Primary Neon Accent** | Bioluminescent Green| `#00E676` | Test passed badges, primary CTAs, active links |
| **Secondary Neon Accent**| Cyan Sonar | `#00E5FF` | API tags, category badges, status badges |
| **Alert / Bug Highlight** | Neon Coral Amber | `#FF9100` | Open defects, warning badges, metrics |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS 4, Custom Oceanic Design System, Lucide Icons
- **Database**: MongoDB (Mongoose 9)
- **Caching**: Upstash Redis REST
- **Authentication**: Clerk (`@clerk/nextjs`) with dynamic RBAC gates
- **AI & LLM Integration**: Google Gemini 1.5 Pro (`@google/genai`), LangChain (`@langchain/google-genai`), Tavily AI (`@langchain/tavily`)
- **Data Visualization**: Recharts 3
- **Form Validation**: React Hook Form, Zod 4, Zod Resolvers
- **Testing Tools**: Vitest (Unit Testing), Playwright (E2E Scaffolding)

---

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js **18.x** or higher
- npm **9.x** or higher
- MongoDB cluster instance
- Clerk account & API keys

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/kushalpatel8/news-qa.git
cd news-qa
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database & Cache
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/news-qa
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# AI Services
GEMINI_API_KEY=AIzaSy...
TAVILY_API_KEY=tvly-...

# App Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Seeding (Optional)
Populate your MongoDB database with sample test cases, news articles, test runs, and open bugs:
```bash
# Start dev server first
npm run dev

# Send GET request to seed endpoint
curl http://localhost:3000/api/seed
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints Overview

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/test-cases` | `GET` / `POST` | List or author test cases | Public / QA, Admin |
| `/api/test-cases/[id]` | `GET` / `PUT` / `DELETE` | Retrieve, update, or remove test case | QA, Admin |
| `/api/articles` | `GET` / `POST` | List or publish news articles | Public / Editor, Admin |
| `/api/articles/[id]` | `GET` / `PUT` / `DELETE` | Retrieve, update, or remove news article | Editor, Admin |
| `/api/bugs` | `GET` / `POST` | List or log system defects | Authenticated |
| `/api/bugs/[id]` | `GET` / `PUT` | Retrieve or update bug state | Authenticated |
| `/api/test-runs` | `GET` / `POST` | View or execute test runs | QA, Admin |
| `/api/ai/generate-tests`| `POST` | Generate test cases from prompt via Gemini | Authenticated |
| `/api/ai/fact-check` | `POST` | Scan article content & verify claims | Authenticated |
| `/api/reports` | `GET` | Retrieve executive analytics summary | Authenticated |
| `/api/seed` | `GET` | Populate initial database demo state | Developer |

---

## 🧪 Running Tests

### Unit Tests (Vitest)
Run the unit test suite covering RBAC rules, validators, and article quality checks:
```bash
npx vitest run
```

### End-to-End Tests (Playwright)
Run the end-to-end browser automation suite:
```bash
npx playwright test
```

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
