import ReportsClient from "@/components/reports/ReportsClient";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";
import { Bug } from "@/lib/mongodb/models/Bug";

async function getReportData() {
  try {
    await connectToDatabase();

    const [testCasesRaw, bugsRaw] = await Promise.all([
      TestCase.find().sort({ createdAt: -1 }).lean(),
      Bug.find().sort({ createdAt: -1 }).lean(),
    ]);

    const testCases = JSON.parse(JSON.stringify(testCasesRaw));
    const bugs = JSON.parse(JSON.stringify(bugsRaw));

    const totalTests = testCases.length;
    const passedTests = testCases.filter((t: any) => t.status === "PASSED").length;
    const failedTests = testCases.filter((t: any) => t.status === "FAILED").length;
    const totalBugs = bugs.length;
    const openBugs = bugs.filter((b: any) => b.status === "OPEN" || b.status === "IN_PROGRESS").length;
    const criticalBugs = bugs.filter((b: any) => b.severity === "CRITICAL").length;

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        failedTests,
        totalBugs,
        openBugs,
        criticalBugs,
      },
      testCases,
      bugs,
    };
  } catch (error) {
    console.error("Error fetching report data directly from DB:", error);
    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        totalBugs: 0,
        openBugs: 0,
        criticalBugs: 0,
      },
      testCases: [],
      bugs: [],
    };
  }
}

export default async function ReportsPage() {
  const report = await getReportData();
  return <ReportsClient report={report} />;
}
