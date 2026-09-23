import Link from "next/link";
import { format } from "date-fns";
import { BugStatusBadge } from "./BugStatusBadge";
import { TestPriorityBadge } from "@/components/testing/TestStatusBadge";

export default function BugTable({ bugs }: { bugs: any[] }) {
  if (!bugs || bugs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No bugs logged.</p>
        <Link
          href="/dashboard/bugs/new"
          className="mt-2 inline-block text-xs font-medium"
          style={{ color: "var(--accent)" }}
        >
          Report a bug →
        </Link>
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
                <Link
                  href={`/dashboard/bugs/${bug._id}`}
                  className="text-xs font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
