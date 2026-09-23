import TestRunForm from "@/components/testing/TestRunForm";
import RoleGate from "@/components/ui/RoleGate";

import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";

async function getTestCases() {
  try {
    await connectToDatabase();
    const testCases = await TestCase.find().sort({ createdAt: -1 }).limit(100).lean();
    return { data: JSON.parse(JSON.stringify(testCases)) };
  } catch {
    return { data: [] };
  }
}

export default async function NewTestRunPage() {
  const { data: testCases } = await getTestCases();

  return (
    <RoleGate roles={["ADMIN", "QA"]}>
      <div className="p-6 max-w-[1000px] space-y-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Create New Test Run
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Select test cases and initialize a test execution run.
          </p>
        </div>

        <TestRunForm availableTestCases={testCases || []} />
      </div>
    </RoleGate>
  );
}
