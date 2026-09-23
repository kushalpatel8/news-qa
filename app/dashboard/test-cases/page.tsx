import Link from "next/link";
import TestCaseTable from "@/components/testing/TestCaseTable";
import { currentUser } from "@clerk/nextjs/server";
import RoleGate from "@/components/ui/RoleGate";

import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";

async function getTestCases() {
  try {
    await connectToDatabase();
    const testCases = await TestCase.find().sort({ createdAt: -1 }).lean();
    return { data: JSON.parse(JSON.stringify(testCases)) };
  } catch {
    return { data: [] };
  }
}

export default async function TestCasesPage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  const { data: testCases } = await getTestCases();

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Test Cases
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Manage and organize your test cases.
          </p>
        </div>
        <RoleGate roles={["QA"]}>
          <Link
            href="/dashboard/test-cases/new"
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            style={{ background: "var(--accent)" }}
          >
            + Create Test Case
          </Link>
        </RoleGate>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {["All Modules", "All Priorities", "All Statuses"].map((label) => (
          <select
            key={label}
            className="input-base text-xs pr-7"
            defaultValue=""
            style={{ paddingTop: 6, paddingBottom: 6 }}
          >
            <option value="">{label}</option>
          </select>
        ))}
        <input
          type="text"
          placeholder="Search test cases..."
          className="input-base text-xs"
          style={{ minWidth: 200, paddingTop: 6, paddingBottom: 6 }}
        />
      </div>

      <div className="card overflow-hidden">
        <TestCaseTable testCases={testCases || []} />
      </div>
    </div>
  );
}
