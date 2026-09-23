import Link from "next/link";
import BugTable from "@/components/bugs/BugTable";
import { currentUser } from "@clerk/nextjs/server";
import RoleGate from "@/components/ui/RoleGate";

import connectToDatabase from "@/lib/mongodb/connection";
import { Bug } from "@/lib/mongodb/models/Bug";

async function getBugs() {
  try {
    await connectToDatabase();
    const bugs = await Bug.find().sort({ createdAt: -1 }).lean();
    return { data: JSON.parse(JSON.stringify(bugs)) };
  } catch {
    return { data: [] };
  }
}

export default async function BugsPage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  const { data: bugs } = await getBugs();

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Bugs</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Track and manage your bugs and issues.
          </p>
        </div>
        <RoleGate roles={["QA"]}>
          <Link
            href="/dashboard/bugs/new"
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            style={{ background: "#ef4444" }}
          >
            + Create Bug
          </Link>
        </RoleGate>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {["All Severities", "All Priorities", "All Statuses"].map((label) => (
          <select
            key={label}
            className="input-base text-xs"
            defaultValue=""
            style={{ paddingTop: 6, paddingBottom: 6 }}
          >
            <option value="">{label}</option>
          </select>
        ))}
        <input
          type="text"
          placeholder="Search bugs..."
          className="input-base text-xs"
          style={{ minWidth: 200, paddingTop: 6, paddingBottom: 6 }}
        />
      </div>

      <div className="card overflow-hidden">
        <BugTable bugs={bugs || []} />
      </div>
    </div>
  );
}
