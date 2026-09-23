# NewsQA

A comprehensive QA management and automation platform designed specifically for newsrooms, editorial teams, and media organizations.

## Overview
NewsQA closes the loop on the QA lifecycle by integrating manual testing, automated UI validation, API testing, bug tracking, and AI-assisted defect analysis into a single, unified dashboard. It is built to ensure high-quality editorial output, structural consistency, and flawless software delivery for modern digital media platforms.

## Core Features
- **Article QA**: Manage and validate news articles, enforce metadata standards, word counts, and check for broken URLs.
- **Test Case Management**: Author, execute, and organize detailed manual test cases.
- **API Testing Engine**: Build and fire HTTP requests from the dashboard to validate REST endpoints, complete with latency tracking.
- **Bug Tracking**: Log defects with reproduction steps, severity tagging, and assignment workflows.
- **AI QA Assistant**: Powered by Google Gemini 1.5 Pro and LangChain, instantly generate test cases from requirements or analyze articles for stylistic and structural defects.
- **Tavily Research**: Fact-check claims directly within the dashboard using AI-powered web scraping.
- **Playwright Automation**: Scaffolding for comprehensive E2E UI automation suites.
- **Reporting & Analytics**: Real-time platform health metrics cached by Redis, with printable and JSON-exportable executive summaries.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB (Mongoose)
- **Caching**: Upstash Redis
- **Authentication**: Clerk (with RBAC)
- **AI/LLM**: Google Gemini, LangChain, Tavily
- **Testing**: Vitest (Unit), Playwright (E2E)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
MONGODB_URI=mongodb+srv://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
GEMINI_API_KEY=AIza...
TAVILY_API_KEY=tvly-...
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## CI/CD
This project uses GitHub Actions for continuous integration. On every push to `main`, the pipeline will automatically run type checks, unit tests (Vitest), and end-to-end tests (Playwright).

See `TESTING.md` for more details on how to run tests locally.
