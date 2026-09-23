import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";
import { Bug as BugModel } from "@/lib/mongodb/models/Bug";
import { Article } from "@/lib/mongodb/models/Article";
import { getCachedData, setCachedData } from "@/lib/redis/cache";
import DashboardClient from "@/components/dashboard/DashboardClient";

async function getDashboardStats(): Promise<any> {
  try {
    const cacheKey = "dashboard_analytics";
    const cachedStats = await getCachedData(cacheKey);
    if (cachedStats) return cachedStats;

    await connectToDatabase();

    const totalTestCases = await TestCase.countDocuments();
    const passedTestCases = await TestCase.countDocuments({ status: "PASSED" });
    const failedTestCases = await TestCase.countDocuments({ status: "FAILED" });

    const totalBugs = await BugModel.countDocuments();
    const openBugs = await BugModel.countDocuments({ status: { $in: ["OPEN", "IN_PROGRESS", "ASSIGNED"] } });
    const criticalBugs = await BugModel.countDocuments({ severity: "CRITICAL", status: { $in: ["OPEN", "IN_PROGRESS", "ASSIGNED"] } });
    const highBugs = await BugModel.countDocuments({ severity: "HIGH", status: { $in: ["OPEN", "IN_PROGRESS", "ASSIGNED"] } });
    const mediumBugs = await BugModel.countDocuments({ severity: "MEDIUM", status: { $in: ["OPEN", "IN_PROGRESS", "ASSIGNED"] } });
    const lowBugs = await BugModel.countDocuments({ severity: "LOW", status: { $in: ["OPEN", "IN_PROGRESS", "ASSIGNED"] } });

    const totalArticles = await Article.countDocuments();
    const executedTests = passedTestCases + failedTestCases;
    const passRate = executedTests > 0 ? Math.round((passedTestCases / executedTests) * 100) : 0;

    // Recent test cases as proxy for recent runs
    const recentTestCases = await TestCase.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title module status priority createdAt")
      .lean();

    const stats = {
      testCases: { total: totalTestCases, passed: passedTestCases, failed: failedTestCases, passRate },
      bugs: { total: totalBugs, open: openBugs, critical: criticalBugs, high: highBugs, medium: mediumBugs, low: lowBugs },
      articles: { total: totalArticles },
      recentRuns: recentTestCases,
    };

    await setCachedData(cacheKey, stats, 300);
    return stats;
  } catch (e) {
    console.error("Dashboard stats error:", e);
    return null;
  }
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user?.id) redirect("/sign-in");

  const role = (user?.publicMetadata?.role as string) || "GUEST";

  if (role === "EDITOR") {
    redirect("/dashboard/articles");
  }

  const stats = await getDashboardStats();
  const firstName = user?.firstName || "User";

  return (
    <DashboardClient
      firstName={firstName}
      role={role}
      stats={stats}
    />
  );
}
