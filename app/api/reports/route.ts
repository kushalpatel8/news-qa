import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";
import { Bug } from "@/lib/mongodb/models/Bug";

import { requireRole } from "@/lib/auth/rbac";

export async function GET(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "QA", "EDITOR", "VIEWER"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    await connectToDatabase();

    // Fetch all relevant data for a massive report dump
    const testCases = await TestCase.find().sort({ createdAt: -1 }).lean();
    const bugs = await Bug.find().sort({ createdAt: -1 }).lean();

    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTests: testCases.length,
        passedTests: testCases.filter(t => t.status === "PASSED").length,
        failedTests: testCases.filter(t => t.status === "FAILED").length,
        totalBugs: bugs.length,
        openBugs: bugs.filter(b => b.status === "OPEN" || b.status === "IN_PROGRESS").length,
        criticalBugs: bugs.filter(b => b.severity === "CRITICAL").length,
      },
      testCases,
      bugs,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
