import TestExecutionPanel from "@/components/testing/TestExecutionPanel";
import { notFound } from "next/navigation";

import connectToDatabase from "@/lib/mongodb/connection";
import { TestRun } from "@/lib/mongodb/models/TestRun";
import "@/lib/mongodb/models/TestCase";

async function getTestRun(id: string) {
  try {
    await connectToDatabase();
    const testRun = await TestRun.findById(id).populate("testCases").lean();
    if (!testRun) return null;
    return JSON.parse(JSON.stringify(testRun));
  } catch {
    return null;
  }
}

export default async function TestRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testRun = await getTestRun(id);

  if (!testRun) {
    notFound();
  }

  return (
    <div className="p-6">
      <TestExecutionPanel testRun={testRun} />
    </div>
  );
}