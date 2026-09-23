"use client";

import { Search, Bell, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface NavbarProps {
  userName?: string;
  role?: string;
  initials?: string;
}

export function RoleBadge({ role }: { role?: string }) {
  if (!role) return null;

  const roleStyles: Record<string, string> = {
    ADMIN: "bg-rose-950/70 text-rose-300 border-rose-800/60",
    EDITOR: "bg-cyan-950/70 text-cyan-300 border-cyan-800/60",
    QA: "bg-emerald-950/70 text-emerald-300 border-emerald-800/60",
    VIEWER: "bg-slate-800/80 text-slate-300 border-slate-700",
  };

  const style = roleStyles[role.toUpperCase()] || "bg-[#1E293B] text-[#F8FAFC] border-[#334155]";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-extrabold tracking-wider rounded-full border ${style}`}>
      <Shield className="w-3 h-3" />
      {role.toUpperCase()}
    </span>
  );
}

export default function Navbar({ userName, role, initials = "U" }: NavbarProps) {
  return (
    <header
      className="flex items-center justify-between px-6 bg-[#0D1B2A] border-b border-[#1E3A5F] flex-shrink-0 text-[#E2F1FF]"
      style={{ height: 56 }}
    >
      {/* Search */}
      <div className="relative" style={{ width: 280 }}>
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#88A4C4]"
        />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#1E3A5F] bg-[#13253B] outline-none text-[#E2F1FF] placeholder-[#88A4C4]/60 focus:border-[#00E676] transition"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* User Role Badge */}
        <RoleBadge role={role} />

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center rounded-lg p-2 text-[#88A4C4] hover:text-[#E2F1FF] hover:bg-[#13253B] transition"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#FF3366]" />
        </button>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className="flex items-center justify-center rounded-lg p-2 text-[#88A4C4] hover:text-[#E2F1FF] hover:bg-[#13253B] transition"
          title="Settings"
        >
          <Settings size={16} />
        </Link>

        {/* Clerk User Button Profile */}
        <div className="flex items-center pl-2 border-l border-[#334155]">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full ring-2 ring-[#10B981]/50 hover:ring-[#10B981] transition",
              },
            }}
            showName={false}
          />
        </div>
      </div>
    </header>
  );
}
