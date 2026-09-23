export function BugStatusBadge({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    OPEN:        "badge badge-failed",
    IN_PROGRESS: "badge badge-blocked",
    ASSIGNED:    "badge badge-ready",
    FIXED:       "badge badge-passed",
    VERIFIED:    "badge badge-passed",
    CLOSED:      "badge badge-draft",
    WONT_FIX:    "badge badge-draft",
  };
  const cls = classMap[status] ?? "badge badge-draft";
  const label = status.replace("_", " ");
  return <span className={cls}>{label}</span>;
}
