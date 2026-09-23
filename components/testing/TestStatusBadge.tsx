export function TestStatusBadge({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    PASSED:  "badge badge-passed",
    FAILED:  "badge badge-failed",
    READY:   "badge badge-ready",
    BLOCKED: "badge badge-blocked",
    DRAFT:   "badge badge-draft",
  };
  const cls = classMap[status] ?? "badge badge-draft";
  return <span className={cls}>{status}</span>;
}

export function TestPriorityBadge({ priority }: { priority: string }) {
  const classMap: Record<string, string> = {
    CRITICAL: "badge badge-critical",
    HIGH:     "badge badge-high",
    MEDIUM:   "badge badge-medium",
    LOW:      "badge badge-low",
  };
  const cls = classMap[priority?.toUpperCase()] ?? "badge badge-draft";
  return <span className={cls}>{priority}</span>;
}
