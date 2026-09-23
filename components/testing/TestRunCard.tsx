"use client";

import Link from "next/link";
import { Clock, Play, CheckCircle2, XCircle, AlertCircle, ChevronRight } from "lucide-react";

export interface ITestRunData {
  _id: string;
  title: string;
  description?: string;
  testCases: any[];
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  totalTests: number;
  passedTests: number;
  failedTests: number;
  blockedTests: number;
  executionTimeMs?: number;
  createdBy: string;
  createdAt: string;
}

export function TestRunBadge({ status }: { status: string }) {
  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-500", label: "Pending" },
    RUNNING: { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-500", label: "Running" },
    COMPLETED: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-500", label: "Completed" },
    FAILED: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-500", label: "Failed" },
    CANCELLED: { bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-400", label: "Cancelled" },
  };

  const current = statusStyles[status] || statusStyles.PENDING;

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${current.bg} ${current.text}`}>
      {current.label}
    </span>
  );
}

export default function TestRunCard({ run }: { run: ITestRunData }) {
  const total = run.totalTests || (run.testCases ? run.testCases.length : 0);
  const passed = run.passedTests || 0;
  const failed = run.failedTests || 0;
  const blocked = run.blockedTests || 0;
  const pending = Math.max(0, total - passed - failed - blocked);

  const passedPct = total > 0 ? (passed / total) * 100 : 0;
  const failedPct = total > 0 ? (failed / total) * 100 : 0;
  const blockedPct = total > 0 ? (blocked / total) * 100 : 0;

  return (
    <div className="card p-5 hover:border-[#00E676]/50 transition duration-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TestRunBadge status={run.status} />
            <span className="text-xs text-[#88A4C4]">
              {new Date(run.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h3 className="font-extrabold text-base text-[#E2F1FF]">
            <Link href={`/dashboard/test-runs/${run._id}`} className="hover:underline">
              {run.title}
            </Link>
          </h3>
          {run.description && (
            <p className="text-xs text-[#88A4C4] mt-1 line-clamp-2">
              {run.description}
            </p>
          )}
        </div>
        <Link
          href={`/dashboard/test-runs/${run._id}`}
          className="flex items-center gap-1 text-xs font-bold text-[#00E676] hover:underline whitespace-nowrap"
        >
          View details <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#88A4C4] font-semibold">
          <span>Progress</span>
          <span>{total > 0 ? `${Math.round(((passed + failed + blocked) / total) * 100)}%` : "0%"}</span>
        </div>
        <div className="h-2 w-full bg-[#070F1E] border border-[#1E3A5F] rounded-full overflow-hidden flex">
          <div style={{ width: `${passedPct}%` }} className="bg-[#00E676]" title={`Passed: ${passed}`} />
          <div style={{ width: `${failedPct}%` }} className="bg-[#FF3366]" title={`Failed: ${failed}`} />
          <div style={{ width: `${blockedPct}%` }} className="bg-[#FF9100]" title={`Blocked: ${blocked}`} />
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#1E3A5F] text-center">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-[#E2F1FF]">{total}</span>
          <span className="text-[10px] text-[#88A4C4]">Total</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-[#00E676]">{passed}</span>
          <span className="text-[10px] text-[#00E676]/70">Passed</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-[#FF3366]">{failed}</span>
          <span className="text-[10px] text-[#FF3366]/70">Failed</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-[#FF9100]">{blocked}</span>
          <span className="text-[10px] text-[#FF9100]/70">Blocked</span>
        </div>
      </div>
    </div>
  );
}
