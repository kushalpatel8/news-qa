"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowRight, Shield } from "lucide-react";

interface LandingUserNavProps {
  role?: string;
}

export function LandingRoleBadge({ role }: { role?: string }) {
  if (!role) return null;

  const roleStyles: Record<string, string> = {
    ADMIN: "bg-[#1E293B] text-[#F8FAFC] border-[#334155]",
    EDITOR: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
    QA: "bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30",
    VIEWER: "bg-[#1E293B] text-[#94A3B8] border-[#334155]",
  };

  const style = roleStyles[role.toUpperCase()] || "bg-[#1E293B] text-[#F8FAFC] border-[#334155]";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-full border ${style}`}>
      <Shield className="w-3 h-3" />
      {role.toUpperCase()}
    </span>
  );
}

export default function LandingUserNav({ role }: LandingUserNavProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Role Badge */}
      <LandingRoleBadge role={role} />

      {/* Clerk User Profile Button */}
      <div className="flex items-center">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 rounded-full ring-2 ring-[#10B981]/30 hover:ring-[#10B981]/60 transition",
            },
          }}
          showName={false}
        />
      </div>

      {/* Dashboard CTA */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-xs font-bold bg-[#10B981] hover:bg-[#059669] text-[#0F172A] px-5 py-2.5 rounded-full transition-all shadow-md shadow-[#10B981]/20 hover:-translate-y-0.5"
      >
        Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
