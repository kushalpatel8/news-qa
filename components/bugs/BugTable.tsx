"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { BugStatusBadge } from "./BugStatusBadge";
import { TestPriorityBadge } from "@/components/testing/TestStatusBadge";
import RoleGate from "@/components/ui/RoleGate";

export default function BugTable({ bugs }: { bugs: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bug?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/bugs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete bug");
      router.refresh();
    } catch (err: any) {
      alert("Error deleting bug: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!bugs || bugs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No bugs logged.</p>
        <RoleGate roles={["QA"]}>
          <Link
            href="/dashboard/bugs/new"
            className="mt-2 inline-block text-xs font-medium"
            style={{ color: "var(--accent)" }}
          >
            Report a bug →
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
            <th>Severity</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug, i) => (
            <tr key={bug._id}>
              <td className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                BUG-{String(i + 1).padStart(3, "0")}
              </td>
              <td>
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {bug.title}
                </span>
              </td>
              <td>
                <TestPriorityBadge priority={bug.severity} />
              </td>
              <td>
                <TestPriorityBadge priority={bug.priority || bug.severity} />
              </td>
              <td>
                <BugStatusBadge status={bug.status} />
              </td>
              <td className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {bug.assignedTo || bug.reportedBy || "—"}
              </td>
              <td>
                <RoleGate roles={["QA"]}>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/bugs/${bug._id}`}
                      className="text-xs font-medium hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={deletingId === bug._id}
                      onClick={() => handleDelete(bug._id)}
                      className="text-xs font-medium text-rose-400 hover:text-rose-300 hover:underline disabled:opacity-50"
                    >
                      {deletingId === bug._id ? "Deleting..." : "Delete"}
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
