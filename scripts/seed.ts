import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment!");
  process.exit(1);
}

// Schemas
const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String },
    category: { type: String, required: true },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT" },
    publishedAt: { type: Date },
    tags: { type: [String], default: [] },
    image: { type: String },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const TestCaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    module: { type: String, required: true },
    preconditions: { type: String, default: "" },
    steps: { type: [String], required: true },
    expectedResult: { type: String, required: true },
    actualResult: { type: String },
    status: { type: String, enum: ["DRAFT", "READY", "PASSED", "FAILED", "BLOCKED"], default: "DRAFT" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const BugSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    stepsToReproduce: { type: String, required: true },
    expectedResult: { type: String, required: true },
    actualResult: { type: String, required: true },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    status: { type: String, enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "FIXED", "RETEST", "VERIFIED"], default: "OPEN" },
    environment: { type: String, required: true },
    screenshotUrl: { type: String },
    assignedTo: { type: String },
    reporterRole: { type: String, enum: ["ADMIN", "EDITOR", "QA", "VIEWER"], default: "QA" },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const TestRunSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestCase" }],
    status: { type: String, enum: ["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"], default: "PENDING" },
    totalTests: { type: Number, default: 0 },
    passedTests: { type: Number, default: 0 },
    failedTests: { type: Number, default: 0 },
    blockedTests: { type: Number, default: 0 },
    executionTimeMs: { type: Number },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);
const TestCase = mongoose.models.TestCase || mongoose.model("TestCase", TestCaseSchema);
const Bug = mongoose.models.Bug || mongoose.model("Bug", BugSchema);
const TestRun = mongoose.models.TestRun || mongoose.model("TestRun", TestRunSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected successfully to MongoDB.");

    const systemUserId = "system_seed_user";

    // Articles
    const sampleArticles = [
      {
        title: "The Future of Solid-State Batteries in EV Technology",
        slug: "the-future-of-solid-state-batteries",
        category: "Technology",
        author: "Tech Desk",
        status: "PUBLISHED",
        publishedAt: new Date(),
        tags: ["EV", "Batteries", "Technology", "Clean Energy"],
        image: "https://images.unsplash.com/photo-1558441719-443b38605a85?w=800",
        content: `Solid-state batteries represent a paradigm shift in energy storage technology. Unlike traditional lithium-ion batteries that use liquid electrolytes, solid-state cells use solid electrolytes such as ceramics, glass, or solid polymers.

Key Advantages:
1. Energy Density: Solid-state batteries can deliver up to 2.5x higher energy density compared to conventional Li-ion cells.
2. Safety: Eliminating flammable liquid electrolytes reduces fire and thermal runaway risks significantly.
3. Fast Charging: High ion transport rates enable charging to 80% capacity in under 15 minutes.

Automakers including Toyota, QuantumScape, and Solid Power are advancing commercial production timelines aimed at 2026-2028 deployment.`,
        createdBy: systemUserId,
      },
      {
        title: "Global Supply Chain Disruptions Continue to Impact Tech Hardware",
        slug: "global-supply-chain-disruptions",
        category: "Business",
        author: "Global News",
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - 86400000),
        tags: ["Supply Chain", "Hardware", "Semiconductors", "Business"],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
        content: `Semiconductor shortages and international logistics bottlenecks remain key operational challenges for hardware manufacturers.

Recent market data indicates lead times for critical microcontroller units (MCUs) have stabilized but remain elevated compared to pre-pandemic baselines. Electronics vendors are diversifying component suppliers and building regional fabrication plants across North America and Europe to bolster supply resilience.`,
        createdBy: systemUserId,
      },
      {
        title: "EU Passes Landmark Artificial Intelligence Governance Act",
        slug: "ai-regulation-act-passes-in-eu",
        category: "Politics",
        author: "EU Correspondent",
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - 172800000),
        tags: ["AI", "Regulation", "EU", "Governance"],
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
        content: `European lawmakers have finalized groundbreaking legislation governing artificial intelligence systems. The AI Act categorizes applications into risk tiers:

- Prohibited: Unacceptable risk systems such as biometric categorization and social scoring.
- High Risk: AI in critical infrastructure, law enforcement, and medical devices subject to strict compliance and audit trails.
- General Purpose AI: Transparency requirements for foundation models including LLM training data disclosures.`,
        createdBy: systemUserId,
      },
      {
        title: "Quantum Computing Breakthrough Achieves 1,000 Logical Qubits",
        slug: "quantum-computing-breakthrough-1000-qubits",
        category: "Science",
        author: "Dr. Elena Rostova",
        status: "DRAFT",
        tags: ["Quantum", "Science", "Computing"],
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
        content: `Researchers at the Quantum Institute have demonstrated error-corrected quantum operations maintaining coherence across 1,000 logical qubits.

This technical achievement moves fault-tolerant quantum computing from theoretical physics closer to practical simulation of molecular dynamics and advanced cryptography.`,
        createdBy: systemUserId,
      },
      {
        title: "Clean Energy Transition: Solar and Wind Output Surpasses Coal Grid Share",
        slug: "clean-energy-transition-solar-wind",
        category: "Environment",
        author: "Environmental Desk",
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - 259200000),
        tags: ["Clean Energy", "Solar", "Wind", "Environment"],
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
        content: `Renewable energy output reached a historic milestone this quarter, providing over 45% of total grid electricity across major economies.

Utility-scale battery storage installations grew 65% year-over-year, enabling grid operators to balance intermittent generation during peak evening demand curves.`,
        createdBy: systemUserId,
      },
    ];

    for (const a of sampleArticles) {
      await Article.findOneAndUpdate({ slug: a.slug }, { $set: a }, { upsert: true, new: true });
    }
    console.log(`Seeded ${sampleArticles.length} Articles.`);

    // Test Cases
    const sampleTestCases = [
      {
        title: "Verify user authentication flow with valid credentials",
        description: "Ensure registered users can authenticate via OAuth/Clerk and land on the dashboard.",
        module: "Authentication",
        preconditions: "User is registered with active credentials and on /sign-in.",
        steps: ["Navigate to /sign-in", "Enter valid email and password", "Click Sign In button"],
        expectedResult: "User is redirected to /dashboard with valid JWT session cookie.",
        actualResult: "Redirected cleanly to /dashboard in 240ms.",
        status: "PASSED",
        priority: "CRITICAL",
        severity: "CRITICAL",
        createdBy: systemUserId,
      },
      {
        title: "Validate article creation input validations",
        description: "Verify that empty titles or invalid categories are caught by Zod schema validators.",
        module: "Article QA",
        preconditions: "User logged in with EDITOR role.",
        steps: ["Navigate to /dashboard/articles/new", "Leave Title blank", "Click Save Article"],
        expectedResult: "Form displays inline validation error 'Title is required'.",
        actualResult: "Validation message correctly rendered.",
        status: "PASSED",
        priority: "HIGH",
        severity: "HIGH",
        createdBy: systemUserId,
      },
      {
        title: "Verify Role-Based Access Control for VIEWER role",
        description: "Ensure VIEWER role cannot execute mutating POST/PUT/DELETE API requests.",
        module: "RBAC & Security",
        preconditions: "Logged in as VIEWER role.",
        steps: ["Send POST request to /api/articles", "Send DELETE request to /api/bugs/123"],
        expectedResult: "API returns HTTP 403 Forbidden with insufficient role error.",
        actualResult: "HTTP 403 returned with clear error payload.",
        status: "PASSED",
        priority: "CRITICAL",
        severity: "HIGH",
        createdBy: systemUserId,
      },
      {
        title: "Verify REST API endpoint GET /api/articles response schema",
        description: "Validate JSON structure and status code of articles collection endpoint.",
        module: "API Testing",
        preconditions: "Articles exist in database.",
        steps: ["Send GET request to /api/articles"],
        expectedResult: "HTTP 200 OK with JSON array containing valid article objects.",
        actualResult: "Returned 200 OK with articles list.",
        status: "PASSED",
        priority: "MEDIUM",
        severity: "MEDIUM",
        createdBy: systemUserId,
      },
      {
        title: "Verify dark charcoal theme contrast ratio WCAG compliance",
        description: "Ensure text color #FFFFE3 on card background #4A4A4A meets accessibility guidelines.",
        module: "UI Testing",
        preconditions: "Dashboard loaded.",
        steps: ["Inspect card background (#4A4A4A)", "Inspect text color (#FFFFE3)", "Compute contrast ratio"],
        expectedResult: "Contrast ratio exceeds WCAG AAA standard (7:1).",
        actualResult: "Contrast ratio measured at 11.4:1.",
        status: "PASSED",
        priority: "HIGH",
        severity: "MEDIUM",
        createdBy: systemUserId,
      },
      {
        title: "Verify bug creation with screenshot attachment",
        description: "Ensure QA users can log bugs with image references.",
        module: "Bug Tracking",
        preconditions: "User logged in as QA.",
        steps: ["Navigate to /dashboard/bugs/new", "Fill bug form with title, environment, and image URL", "Click Save Bug"],
        expectedResult: "Bug is created and listed in /dashboard/bugs.",
        actualResult: "Bug created successfully.",
        status: "READY",
        priority: "MEDIUM",
        severity: "LOW",
        createdBy: systemUserId,
      },
    ];

    const insertedTestCases = [];
    for (const tc of sampleTestCases) {
      const saved = await TestCase.findOneAndUpdate({ title: tc.title }, { $set: tc }, { upsert: true, new: true });
      insertedTestCases.push(saved);
    }
    console.log(`Seeded ${sampleTestCases.length} Test Cases.`);

    // Bugs
    const sampleBugs = [
      {
        title: "Article list pagination controls overflow on mobile viewport",
        description: "On mobile screens (< 640px), the pagination buttons wrap onto two lines awkwardly.",
        stepsToReproduce: "1. Open /dashboard/articles on a mobile browser or 375px window width.\n2. Scroll down to bottom table pagination.",
        expectedResult: "Pagination controls align horizontally with responsive padding.",
        actualResult: "Next button overflows right screen margin.",
        severity: "LOW",
        priority: "LOW",
        status: "OPEN",
        environment: "Production - Mobile Safari",
        screenshotUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600",
        reporterRole: "QA",
        createdBy: systemUserId,
      },
      {
        title: "AI Article Fact Checker times out on articles exceeding 2000 words",
        description: "Scanning extensive long-form articles exceeds the 15-second response window.",
        stepsToReproduce: "1. Open long-form article (> 2000 words).\n2. Click Fact Checker scan in News Guard AI panel.",
        expectedResult: "Fact check analysis completes within 5 seconds.",
        actualResult: "Request times out with 504 gateway error.",
        severity: "HIGH",
        priority: "HIGH",
        status: "IN_PROGRESS",
        environment: "Staging - Groq API",
        reporterRole: "EDITOR",
        createdBy: systemUserId,
      },
      {
        title: "Chart gridlines color contrast mismatch in print mode",
        description: "Exporting or printing executive report displays black gridlines instead of muted charcoal.",
        stepsToReproduce: "1. Navigate to /dashboard/reports.\n2. Click Print button.",
        expectedResult: "Print styles preserve dark theme muted gridlines.",
        actualResult: "Gridlines printed in high-contrast black.",
        severity: "MEDIUM",
        priority: "MEDIUM",
        status: "VERIFIED",
        environment: "Production - Chrome Print",
        reporterRole: "QA",
        createdBy: systemUserId,
      },
    ];

    for (const b of sampleBugs) {
      await Bug.findOneAndUpdate({ title: b.title }, { $set: b }, { upsert: true, new: true });
    }
    console.log(`Seeded ${sampleBugs.length} Bugs.`);

    // Test Runs
    const sampleTestRuns = [
      {
        title: "Regression Suite v2.4 - Pre-Release Validation",
        description: "Comprehensive regression verification across Authentication, Article QA, and Bug Tracking.",
        testCases: insertedTestCases.map(tc => tc._id),
        status: "COMPLETED",
        totalTests: insertedTestCases.length,
        passedTests: insertedTestCases.filter(t => t.status === "PASSED").length,
        failedTests: insertedTestCases.filter(t => t.status === "FAILED").length,
        blockedTests: 0,
        executionTimeMs: 42500,
        createdBy: systemUserId,
      },
      {
        title: "Smoke Test - Production Pipeline",
        description: "Automated smoke test suite verifying core read and write API endpoints.",
        testCases: insertedTestCases.slice(0, 3).map(tc => tc._id),
        status: "COMPLETED",
        totalTests: 3,
        passedTests: 3,
        failedTests: 0,
        blockedTests: 0,
        executionTimeMs: 14200,
        createdBy: systemUserId,
      },
      {
        title: "AI Guard & Fact Checking Validation Run",
        description: "Verification of News Guard AI LLM prompts, fact check accuracy, and prompt safety rules.",
        testCases: insertedTestCases.slice(1, 4).map(tc => tc._id),
        status: "RUNNING",
        totalTests: 3,
        passedTests: 2,
        failedTests: 0,
        blockedTests: 1,
        executionTimeMs: 22000,
        createdBy: systemUserId,
      },
    ];

    for (const tr of sampleTestRuns) {
      await TestRun.findOneAndUpdate({ title: tr.title }, { $set: tr }, { upsert: true, new: true });
    }
    console.log(`Seeded ${sampleTestRuns.length} Test Runs.`);

    console.log("All sections successfully populated with dummy data!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed script failed:", err);
    process.exit(1);
  }
}

seed();
