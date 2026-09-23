import Link from "next/link";
import TestRunTable from "@/components/testing/TestRunTable";
import RoleGate from "@/components/ui/RoleGate";
import { Play, CheckCircle2, XCircle, Clock } from "lucide-react";

import connectToDatabase from "@/lib/mongodb/connection";
import { TestRun } from "@/lib/mongodb/models/TestRun";
import "@/lib/mongodb/models/TestCase";

async function getTestRuns() {
  try {
    await connectToDatabase();
    const testRuns = await TestRun.find().populate("testCases").sort({ createdAt: -1 }).lean();
    return { data: JSON.parse(JSON.stringify(testRuns)) };
  } catch {
    return { data: [] };
  }
}

export default async function TestRunsPage() {
  const { data: testRuns } = await getTestRuns();

  const totalRuns = testRuns?.length || 0;
  const completedRuns = testRuns?.filter((r: any) => r.status === "COMPLETED").length || 0;
  const runningRuns = testRuns?.filter((r: any) => r.status === "RUNNING").length || 0;
  const failedRuns = testRuns?.filter((r: any) => r.status === "FAILED").length || 0;

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Test Runs
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Execute test suites, monitor execution progress, and analyze test metrics.
          </p>
        </div>
        <RoleGate roles={["ADMIN", "QA"]}>
          <Link
            href="/dashboard/test-runs/new"
            className="flex items-center gap-1.5 text-[#070F1E] text-xs font-bold px-4 py-2 rounded-lg bg-[#00E676] hover:bg-[#00c865] transition shadow"
          >
            + Create Test Run
          </Link>
        </RoleGate>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#88A4C4] font-semibold">Total Test Runs</span>
            <Play className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl font-bold text-[#E2F1FF] mt-2">{totalRuns}</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#88A4C4] font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
          </div>
          <div className="text-2xl font-bold text-[#00E676] mt-2">{completedRuns}</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#88A4C4] font-semibold">In Progress</span>
            <Clock className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl font-bold text-[#00E5FF] mt-2">{runningRuns}</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#88A4C4] font-semibold">Failed</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{failedRuns}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select className="input-base text-xs pr-7" defaultValue="" style={{ paddingTop: 6, paddingBottom: 6 }}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="RUNNING">Running</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
        <input
          type="text"
          placeholder="Search test runs..."
          className="input-base text-xs"
          style={{ minWidth: 200, paddingTop: 6, paddingBottom: 6 }}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <TestRunTable testRuns={testRuns || []} />
      </div>
    </div>
  );
}
