import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";
import { Bug } from "@/lib/mongodb/models/Bug";
import { Article } from "@/lib/mongodb/models/Article";
import { getCachedData, setCachedData } from "@/lib/redis/cache";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cacheKey = "dashboard_analytics";
    const cachedStats = await getCachedData(cacheKey);

    if (cachedStats) {
      return NextResponse.json(cachedStats);
    }

    await connectToDatabase();

    // Aggregate statistics
    const totalTestCases = await TestCase.countDocuments();
    const passedTestCases = await TestCase.countDocuments({ status: "PASSED" });
    const failedTestCases = await TestCase.countDocuments({ status: "FAILED" });

    const totalBugs = await Bug.countDocuments();
    const openBugs = await Bug.countDocuments({ status: { $in: ["OPEN", "IN_PROGRESS", "ASSIGNED"] } });
    const criticalBugs = await Bug.countDocuments({ severity: "CRITICAL", status: { $in: ["OPEN", "IN_PROGRESS", "ASSIGNED"] } });

    const totalArticles = await Article.countDocuments();

    // Calculate pass rate safely
    const executedTests = passedTestCases + failedTestCases;
    const passRate = executedTests > 0 ? Math.round((passedTestCases / executedTests) * 100) : 0;

    const stats = {
      testCases: {
        total: totalTestCases,
        passed: passedTestCases,
        failed: failedTestCases,
        passRate,
      },
      bugs: {
        total: totalBugs,
        open: openBugs,
        critical: criticalBugs,
      },
      articles: {
        total: totalArticles,
      }
    };

    // Cache the result for 5 minutes
    await setCachedData(cacheKey, stats, 300);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/analytics/dashboard error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
