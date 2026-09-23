"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { CheckCircle2, XCircle, Bug, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

// Generate trend data from stats (last 7 days mock shape, real count anchored at today)
function buildTrendData(passed: number, failed: number) {
  const days = ["Sep 14", "Sep 15", "Sep 16", "Sep 17", "Sep 18", "Sep 19", "Sep 20"];
  const base = Math.max(passed + failed - 30, 0);
  return days.map((d, i) => ({
    date: d,
    Passed: Math.max(0, Math.round((passed / 7) * (i + 1) * (0.8 + Math.random() * 0.4))),
    Failed: Math.max(0, Math.round((failed / 7) * (i + 1) * (0.5 + Math.random() * 0.5))),
  }));
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#f59e0b",
  Low: "#3b82f6",
};

interface Props {
  firstName: string;
  role: string;
  stats: any;
}

export default function DashboardClient({ firstName, role, stats }: Props) {
  const s = stats ?? {
    testCases: { total: 0, passed: 0, failed: 0, passRate: 0 },
    bugs: { total: 0, open: 0, critical: 0, high: 0, medium: 0, low: 0 },
    articles: { total: 0 },
    recentRuns: [],
  };

  const trendData = buildTrendData(s.testCases.passed, s.testCases.failed);

  const severityData = [
    { name: "Critical", value: s.bugs.critical || 0 },
    { name: "High",     value: s.bugs.high     || 0 },
    { name: "Medium",   value: s.bugs.medium   || 0 },
    { name: "Low",      value: s.bugs.low      || 0 },
  ].filter(d => d.value > 0);

  const kpiCards = [
    {
      label: "Total Tests",
      value: s.testCases.total,
      icon: <CheckCircle2 size={18} style={{ color: "var(--accent)" }} />,
      sub: `+12 this week`,
      up: true,
    },
    {
      label: "Passed",
      value: s.testCases.passed,
      icon: <CheckCircle2 size={18} className="text-green-500" />,
      sub: `${s.testCases.passRate}% pass rate`,
      up: true,
    },
    {
      label: "Failed",
      value: s.testCases.failed,
      icon: <XCircle size={18} className="text-red-500" />,
      sub: `${s.testCases.total > 0 ? Math.round((s.testCases.failed / s.testCases.total) * 100) : 0}% fail rate`,
      up: false,
    },
    {
      label: "Open Bugs",
      value: s.bugs.open,
      icon: <Bug size={18} className="text-orange-500" />,
      sub: `${s.bugs.critical} critical`,
      up: false,
    },
  ];

  function statusClass(status: string) {
    const m: Record<string, string> = {
      PASSED: "badge badge-passed",
      FAILED: "badge badge-failed",
      BLOCKED: "badge badge-blocked",
      DRAFT: "badge badge-draft",
      READY: "badge badge-ready",
    };
    return m[status] ?? "badge badge-draft";
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Welcome back, {firstName}!
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Here&apos;s what&apos;s happening with your QA today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {card.label}
              </span>
              {card.icon}
            </div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {card.value}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {card.up
                ? <TrendingUp size={12} className="text-green-500" />
                : <TrendingDown size={12} className="text-red-400" />}
              <span style={{ color: card.up ? "#16a34a" : "#dc2626" }}>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Test Execution Trend
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 bg-blue-500 rounded" /> Passed
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 bg-red-400 rounded" /> Failed
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, border: "1px solid #e8ecf4", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Line type="monotone" dataKey="Passed" stroke="#4263eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Failed" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bug Severity Donut */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Bug Severity
          </h2>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{s.bugs.open} open bugs</p>
          {severityData.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No open bugs 🎉</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {severityData.map((entry) => (
                    <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 11, color: "#64748b" }}>{v}</span>}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Test Runs */}
      <div className="card overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Recent Test Runs
          </h2>
          <a
            href="/dashboard/test-cases"
            className="text-xs font-medium"
            style={{ color: "var(--accent)" }}
          >
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Started At</th>
              </tr>
            </thead>
            <tbody>
              {s.recentRuns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                    No test runs yet
                  </td>
                </tr>
              ) : (
                s.recentRuns.map((tc: any, i: number) => (
                  <tr key={tc._id || i}>
                    <td className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      TR-{String(1020 + i).padStart(4, "0")}
                    </td>
                    <td className="font-medium text-xs">{tc.title}</td>
                    <td>
                      <span className="badge badge-ready">{tc.module || "Manual"}</span>
                    </td>
                    <td>
                      <span className={statusClass(tc.status)}>{tc.status}</span>
                    </td>
                    <td className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {tc.createdAt ? format(new Date(tc.createdAt), "MMM d, yyyy HH:mm") : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
