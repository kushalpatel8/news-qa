"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  LayoutDashboard, FileText, TestTube, Bug, Code2,
  MonitorSmartphone, Bot, BarChart3, Settings, ShieldCheck,
  PlaySquare, CheckCircle2, FileEdit,
} from "lucide-react";
import type { UserRole } from "@/lib/auth/rbac";

interface SubItem {
  name: string;
  href: string;
  icon: any;
  status: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  allowedRoles: UserRole[];
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["ADMIN", "QA", "EDITOR", "VIEWER"],
  },
  {
    name: "Articles",
    href: "/dashboard/articles",
    icon: FileText,
    allowedRoles: ["ADMIN", "EDITOR", "VIEWER"],
    subItems: [
      {
        name: "Published Articles",
        href: "/dashboard/articles?status=PUBLISHED",
        icon: CheckCircle2,
        status: "PUBLISHED",
      },
      {
        name: "Draft Articles",
        href: "/dashboard/articles?status=DRAFT",
        icon: FileEdit,
        status: "DRAFT",
      },
    ],
  },
  {
    name: "Test Cases",
    href: "/dashboard/test-cases",
    icon: TestTube,
    allowedRoles: ["ADMIN", "QA", "VIEWER"],
  },
  {
    name: "Test Runs",
    href: "/dashboard/test-runs",
    icon: PlaySquare,
    allowedRoles: ["ADMIN", "QA", "VIEWER"],
  },
  {
    name: "API Testing",
    href: "/dashboard/api-testing",
    icon: Code2,
    allowedRoles: ["ADMIN", "QA"],
  },
  {
    name: "UI Testing",
    href: "/dashboard/ui-testing",
    icon: MonitorSmartphone,
    allowedRoles: ["ADMIN", "QA"],
  },
  {
    name: "Bugs",
    href: "/dashboard/bugs",
    icon: Bug,
    allowedRoles: ["ADMIN", "QA", "VIEWER"],
  },
  {
    name: "AI Tools",
    href: "/dashboard/ai-testing",
    icon: Bot,
    allowedRoles: ["ADMIN", "QA", "EDITOR"],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    allowedRoles: ["ADMIN", "QA", "VIEWER"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["ADMIN"],
  },
];

interface SidebarProps {
  userName?: string;
  role?: string;
  initials?: string;
}

function SidebarNav({ role }: { role?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status")?.toUpperCase();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const visibleItems = navItems.filter(
    (item) => !role || item.allowedRoles.includes(role as UserRole)
  );

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      {visibleItems.map((item) => {
        const isMainActive = isActive(item.href) && !statusParam;
        const Icon = item.icon;

        return (
          <div key={item.name} className="space-y-0.5">
            <Link
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: isMainActive ? 700 : 500,
                color: isMainActive ? "#E2F1FF" : "#88A4C4",
                background: isMainActive ? "rgba(0, 230, 118, 0.14)" : "transparent",
                borderLeft: isMainActive ? "3px solid #00E676" : "3px solid transparent",
                transition: "all 0.15s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isMainActive) {
                  (e.currentTarget as HTMLElement).style.background = "#13253B";
                  (e.currentTarget as HTMLElement).style.color = "#E2F1FF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMainActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#88A4C4";
                }
              }}
            >
              <Icon className="flex-shrink-0" size={16} />
              <span>{item.name}</span>
            </Link>

            {/* Sub-items for Articles */}
            {item.subItems && (
              <div className="pl-4 space-y-0.5 mt-0.5">
                {item.subItems
                  .filter((sub) => role !== "VIEWER" || sub.status === "PUBLISHED")
                  .map((sub) => {
                  const isSubActive =
                    pathname.startsWith("/dashboard/articles") &&
                    statusParam === sub.status;
                  const SubIcon = sub.icon;

                  return (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: isSubActive ? 700 : 500,
                        color: isSubActive ? "#00E676" : "#88A4C4",
                        background: isSubActive ? "rgba(0, 230, 118, 0.12)" : "transparent",
                        borderLeft: isSubActive ? "2px solid #00E676" : "2px solid transparent",
                        transition: "all 0.15s",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubActive) {
                          (e.currentTarget as HTMLElement).style.background = "#13253B";
                          (e.currentTarget as HTMLElement).style.color = "#E2F1FF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubActive) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "#88A4C4";
                        }
                      }}
                    >
                      <SubIcon
                        className="flex-shrink-0"
                        size={14}
                        style={{ color: isSubActive ? "#00E676" : "#88A4C4" }}
                      />
                      <span>{sub.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ userName, role, initials = "U" }: SidebarProps) {
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

      {/* Nav Wrapped in Suspense */}
      <Suspense fallback={<div className="flex-1 px-3 py-4 text-xs text-[#88A4C4]">Loading nav...</div>}>
        <SidebarNav role={role} />
      </Suspense>

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
