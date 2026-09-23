"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, Play, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TestRunBadge } from "./TestRunCard";

export interface TestCaseInRun {
  _id: string;
  title: string;
  description: string;
  module: string;
  steps: string[];
  expectedResult: string;
  status: "DRAFT" | "READY" | "PASSED" | "FAILED" | "BLOCKED";
  priority: string;
}

export interface FullTestRun {
  _id: string;
  title: string;
  description?: string;
  testCases: TestCaseInRun[];
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  totalTests: number;
  passedTests: number;
  failedTests: number;
  blockedTests: number;
  createdAt: string;
}

export default function TestExecutionPanel({ testRun }: { testRun: FullTestRun }) {
  const router = useRouter();
  const [testCasesStatus, setTestCasesStatus] = useState<Record<string, "PASSED" | "FAILED" | "BLOCKED" | "PENDING">>(() => {
    const initial: Record<string, "PASSED" | "FAILED" | "BLOCKED" | "PENDING"> = {};
    testRun.testCases?.forEach((tc) => {
      initial[tc._id] = (tc.status === "PASSED" || tc.status === "FAILED" || tc.status === "BLOCKED")
        ? tc.status
        : "PENDING";
    });
    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const updateStatus = async (tcId: string, newStatus: "PASSED" | "FAILED" | "BLOCKED") => {
    const updated = { ...testCasesStatus, [tcId]: newStatus };
    setTestCasesStatus(updated);

    // Compute updated counts
    const values = Object.values(updated);
    const passed = values.filter((v) => v === "PASSED").length;
    const failed = values.filter((v) => v === "FAILED").length;
    const blocked = values.filter((v) => v === "BLOCKED").length;

    let overallStatus: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" = "RUNNING";
    if (passed + failed + blocked === testRun.testCases.length) {
      overallStatus = failed > 0 ? "FAILED" : "COMPLETED";
    }

    setSaving(true);
    try {
      await fetch(`/api/test-runs/${testRun._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: overallStatus,
          passedTests: passed,
          failedTests: failed,
          blockedTests: blocked,
        }),
      });

      // Update test case status in backend as well
      await fetch(`/api/test-cases/${tcId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      router.refresh();
    } catch (err) {
      console.error("Failed to update test run step status", err);
    } finally {
      setSaving(false);
    }
  };

  const total = testRun.testCases?.length || 0;
  const values = Object.values(testCasesStatus);
  const passedCount = values.filter((v) => v === "PASSED").length;
  const failedCount = values.filter((v) => v === "FAILED").length;
  const blockedCount = values.filter((v) => v === "BLOCKED").length;
  const pendingCount = total - passedCount - failedCount - blockedCount;

  const filteredCases = testRun.testCases?.filter((tc) => {
    if (activeTab === "ALL") return true;
    return testCasesStatus[tc._id] === activeTab;
  }) || [];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/test-runs"
            className="p-1.5 rounded-lg border border-[#1E3A5F] text-[#88A4C4] hover:text-[#E2F1FF] hover:bg-[#13253B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#E2F1FF]">{testRun.title}</h1>
              <TestRunBadge status={testRun.status} />
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00E676]" />}
            </div>
            {testRun.description && (
              <p className="text-xs text-[#88A4C4] mt-0.5">{testRun.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-[#88A4C4] font-semibold">Total Cases</div>
          <div className="text-2xl font-bold text-[#E2F1FF] mt-1">{total}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-[#00E676] font-semibold">Passed</div>
          <div className="text-2xl font-bold text-[#00E676] mt-1">{passedCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-[#FF3366] font-semibold">Failed</div>
          <div className="text-2xl font-bold text-[#FF3366] mt-1">{failedCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-[#FF9100] font-semibold">Blocked / Pending</div>
          <div className="text-2xl font-bold text-[#FF9100] mt-1">{blockedCount + pendingCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E3A5F] pb-2">
        {["ALL", "PENDING", "PASSED", "FAILED", "BLOCKED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === tab
                ? "bg-[#00E676] text-[#070F1E]"
                : "text-[#88A4C4] hover:text-[#E2F1FF] hover:bg-[#13253B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Test Cases Execution List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="card p-8 text-center text-xs text-[#88A4C4]">No test cases matching filter.</div>
        ) : (
          filteredCases.map((tc, index) => {
            const currentStatus = testCasesStatus[tc._id] || "PENDING";
            return (
              <div key={tc._id} className="card p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#88A4C4]">#{index + 1}</span>
                      <h3 className="font-extrabold text-sm text-[#E2F1FF]">{tc.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                        {tc.module}
                      </span>
                    </div>
                    {tc.description && (
                      <p className="text-xs text-[#88A4C4]">{tc.description}</p>
                    )}
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateStatus(tc._id, "PASSED")}
                      className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                        currentStatus === "PASSED"
                          ? "bg-[#00E676] text-[#070F1E] border-[#00E676]"
                          : "border-[#1E3A5F] text-[#00E676] hover:bg-[#00E676]/15"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed
                    </button>
                    <button
                      onClick={() => updateStatus(tc._id, "FAILED")}
                      className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                        currentStatus === "FAILED"
                          ? "bg-[#FF3366] text-white border-[#FF3366]"
                          : "border-[#1E3A5F] text-[#FF3366] hover:bg-[#FF3366]/15"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Failed
                    </button>
                    <button
                      onClick={() => updateStatus(tc._id, "BLOCKED")}
                      className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                        currentStatus === "BLOCKED"
                          ? "bg-[#FF9100] text-[#070F1E] border-[#FF9100]"
                          : "border-[#1E3A5F] text-[#FF9100] hover:bg-[#FF9100]/15"
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Blocked
                    </button>
                  </div>
                </div>

                {/* Steps and Expected Result - Dark Oceanic Slate Surface */}
                <div className="bg-[#13253B] border border-[#1E3A5F] p-4 rounded-lg space-y-2.5 text-xs">
                  {tc.steps && tc.steps.length > 0 && (
                    <div>
                      <span className="font-bold text-[#E2F1FF]">Test Steps:</span>
                      <ol className="list-decimal list-inside text-[#88A4C4] mt-1 space-y-1">
                        {tc.steps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {tc.expectedResult && (
                    <div className="pt-1 border-t border-[#1E3A5F]/50">
                      <span className="font-bold text-[#E2F1FF]">Expected Result: </span>
                      <span className="text-[#88A4C4]">{tc.expectedResult}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
