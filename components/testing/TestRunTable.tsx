"use client";

import Link from "next/link";
import { TestRunBadge, ITestRunData } from "./TestRunCard";
import { Play, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestRunTable({ testRuns }: { testRuns: ITestRunData[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this test run?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/test-runs/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete test run");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting test run");
    } finally {
      setDeletingId(null);
    }
  };

  if (!testRuns || testRuns.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        No test runs found. Create a new test run to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Tests</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Blocked</th>
            <th>Created At</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testRuns.map((run) => {
            const total = run.totalTests || (run.testCases ? run.testCases.length : 0);
            const passed = run.passedTests || 0;
            const failed = run.failedTests || 0;
            const blocked = run.blockedTests || 0;
            const passedPct = total > 0 ? Math.round((passed / total) * 100) : 0;

            return (
              <tr key={run._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="font-medium">
                  <Link
                    href={`/dashboard/test-runs/${run._id}`}
                    className="hover:underline text-indigo-600 dark:text-indigo-400 font-semibold"
                  >
                    {run.title}
                  </Link>
                  {run.description && (
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {run.description}
                    </div>
                  )}
                </td>
                <td>
                  <TestRunBadge status={run.status} />
                </td>
                <td>
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{passedPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${total > 0 ? (passed / total) * 100 : 0}%` }}
                        className="bg-emerald-500"
                      />
                      <div
                        style={{ width: `${total > 0 ? (failed / total) * 100 : 0}%` }}
                        className="bg-rose-500"
                      />
                      <div
                        style={{ width: `${total > 0 ? (blocked / total) * 100 : 0}%` }}
                        className="bg-amber-500"
                      />
                    </div>
                  </div>
                </td>
                <td className="font-semibold">{total}</td>
                <td className="text-emerald-600 font-semibold">{passed}</td>
                <td className="text-rose-600 font-semibold">{failed}</td>
                <td className="text-amber-600 font-semibold">{blocked}</td>
                <td className="text-slate-500 text-xs">
                  {new Date(run.createdAt).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/test-runs/${run._id}`}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="View / Execute"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(run._id, e)}
                      disabled={deletingId === run._id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Delete Test Run"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
