"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Trash2, Edit3 } from "lucide-react";
import { TestStatusBadge, TestPriorityBadge } from "./TestStatusBadge";
import RoleGate from "@/components/ui/RoleGate";

export default function TestCaseTable({ testCases: initialTestCases }: { testCases: any[] }) {
  const router = useRouter();
  const [testCases, setTestCases] = useState<any[]>(initialTestCases);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete test case "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/test-cases/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete test case");
      }
      setTestCases(prev => prev.filter(tc => tc._id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Error deleting test case: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!testCases || testCases.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No test cases found.</p>
        <RoleGate roles={["QA"]}>
          <Link
            href="/dashboard/test-cases/new"
            className="mt-2 inline-block text-xs font-bold text-[#00E676] hover:underline"
          >
            Create your first test case →
          </Link>
        </RoleGate>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Module</th>
            <th>Priority</th>
            <th>Severity</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((tc, i) => (
            <tr key={tc._id}>
              <td className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                TC-{String(i + 1).padStart(3, "0")}
              </td>
              <td>
                <span className="text-xs font-bold text-[#E2F1FF]">
                  {tc.title}
                </span>
              </td>
              <td>
                <span className="text-xs px-2 py-0.5 rounded border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF] font-bold">
                  {tc.module}
                </span>
              </td>
              <td>
                <TestPriorityBadge priority={tc.priority} />
              </td>
              <td>
                <TestPriorityBadge priority={tc.severity || tc.priority} />
              </td>
              <td>
                <TestStatusBadge status={tc.status} />
              </td>
              <td className="text-right whitespace-nowrap">
                <RoleGate 
                  roles={["QA"]} 
                  fallback={<span className="text-[11px] text-[#88A4C4] italic">Read-only</span>}
                >
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/test-cases/${tc._id}`}
                      className="text-xs font-bold text-[#00E676] hover:underline flex items-center gap-1"
                    >
                      <Edit3 size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tc._id, tc.title)}
                      disabled={deletingId === tc._id}
                      className="p-1 text-[#88A4C4] hover:text-[#FF3366] hover:bg-[#FF3366]/15 rounded transition disabled:opacity-50"
                      title="Delete Test Case"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </RoleGate>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
