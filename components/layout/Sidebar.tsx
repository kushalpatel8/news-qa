"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, TestTube, Bug, Code2,
  MonitorSmartphone, Bot, BarChart3, Settings, ShieldCheck,
  PlaySquare,
} from "lucide-react";
import type { UserRole } from "@/lib/auth/rbac";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["ADMIN", "QA", "EDITOR", "VIEWER"] as UserRole[],
  },
  {
    name: "Articles",
    href: "/dashboard/articles",
    icon: FileText,
    allowedRoles: ["ADMIN", "EDITOR"] as UserRole[],
  },
  {
    name: "Test Cases",
    href: "/dashboard/test-cases",
    icon: TestTube,
    allowedRoles: ["ADMIN", "QA", "VIEWER"] as UserRole[],
  },
  {
    name: "Test Runs",
    href: "/dashboard/test-runs",
    icon: PlaySquare,
    allowedRoles: ["ADMIN", "QA", "VIEWER"] as UserRole[],
  },
  {
    name: "API Testing",
    href: "/dashboard/api-testing",
    icon: Code2,
    allowedRoles: ["ADMIN", "QA"] as UserRole[],
  },
  {
    name: "UI Testing",
    href: "/dashboard/ui-testing",
    icon: MonitorSmartphone,
    allowedRoles: ["ADMIN", "QA"] as UserRole[],
  },
  {
    name: "Bugs",
    href: "/dashboard/bugs",
    icon: Bug,
    allowedRoles: ["ADMIN", "QA", "VIEWER"] as UserRole[],
  },
  {
    name: "AI Tools",
    href: "/dashboard/ai-testing",
    icon: Bot,
    allowedRoles: ["ADMIN", "QA", "EDITOR"] as UserRole[],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    allowedRoles: ["ADMIN", "QA", "VIEWER"] as UserRole[],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["ADMIN"] as UserRole[],
  },
];

interface SidebarProps {
  userName?: string;
  role?: string;
  initials?: string;
}

export default function Sidebar({ userName, role, initials = "U" }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const visibleItems = navItems.filter(
    (item) => !role || item.allowedRoles.includes(role as UserRole)
  );

  return (
    <aside
      style={{ background: "var(--sidebar-bg)", width: 220, minWidth: 220 }}
      className="flex flex-col h-screen flex-shrink-0"
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-5 hover:opacity-90 transition group"
        style={{ borderBottom: "1px solid var(--sidebar-border)", textDecoration: "none" }}
      >
        <div
          className="flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform"
          style={{ background: "#00E676", width: 32, height: 32 }}
        >
          <ShieldCheck className="w-4 h-4 text-[#070F1E]" />
        </div>
        <span className="text-[#E2F1FF] font-extrabold text-base tracking-tight">NewsQA</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? "#E2F1FF" : "#88A4C4",
                background: active ? "rgba(0, 230, 118, 0.14)" : "transparent",
                borderLeft: active ? "3px solid #00E676" : "3px solid transparent",
                transition: "all 0.15s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "#13253B";
                  (e.currentTarget as HTMLElement).style.color = "#E2F1FF";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#88A4C4";
                }
              }}
            >
              <Icon className="flex-shrink-0" size={16} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full text-[#070F1E] font-bold text-sm flex-shrink-0"
            style={{ background: "#00E676", width: 34, height: 34 }}
          >
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-[#E2F1FF] text-xs font-semibold truncate">{userName || "User"}</p>
            <p style={{ color: "#88A4C4", fontSize: 10 }} className="truncate font-mono">
              {role || "GUEST"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
