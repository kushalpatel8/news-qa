"use client";

import { useState } from "react";
import { Play, Plus, Clock } from "lucide-react";
import { format, subHours } from "date-fns";

type Tab = "suites" | "results";

const MOCK_SUITES = [
  { name: "Authentication Flows", browsers: ["Chrome", "Firefox", "Safari"], lastRun: subHours(new Date(), 2), status: "PASSED" },
  { name: "Article Management",   browsers: ["Chrome"],                       lastRun: subHours(new Date(), 5), status: "PASSED" },
  { name: "Dashboard Tests",      browsers: ["Chrome", "Firefox"],            lastRun: subHours(new Date(), 9), status: "FAILED" },
  { name: "Bug Management",       browsers: ["Chrome"],                       lastRun: subHours(new Date(), 24),status: "PASSED" },
  { name: "Search Functionality", browsers: ["Chrome", "Safari"],             lastRun: subHours(new Date(), 48),status: "PASSED" },
];

const BROWSER_COLORS: Record<string, { bg: string; color: string }> = {
  Chrome:  { bg: "#fef9c3", color: "#854d0e" },
  Firefox: { bg: "#ffedd5", color: "#9a3412" },
  Safari:  { bg: "#dbeafe", color: "#1e40af" },
};

export default function UiTestingPage() {
  const [tab, setTab] = useState<Tab>("suites");

  function statusClass(s: string) {
    return s === "PASSED" ? "badge badge-passed" : s === "FAILED" ? "badge badge-failed" : "badge badge-draft";
  }

  function tabStyle(active: boolean): React.CSSProperties {
    return {
      padding: "7px 16px",
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      color: active ? "var(--accent)" : "var(--text-muted)",
      borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
      cursor: "pointer",
      background: "none",
      border: "none",
    };
  }

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>UI Testing</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Automate and run application testing using Playwright.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={13} /> Create Test Suite
        </button>
      </div>

      {/* Card */}
      <div className="card overflow-hidden">
        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid var(--card-border)", paddingLeft: 16 }}
        >
          <button style={tabStyle(tab === "suites")} onClick={() => setTab("suites")}>
            Test Suites
          </button>
          <button style={tabStyle(tab === "results")} onClick={() => setTab("results")}>
            Test Results
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Browsers</th>
                <th>Last Run</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SUITES.map((suite) => (
                <tr key={suite.name}>
                  <td className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {suite.name}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {suite.browsers.map(b => (
                        <span
                          key={b}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ background: BROWSER_COLORS[b]?.bg, color: BROWSER_COLORS[b]?.color }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs" style={{ color: "var(--text-muted)" }}>
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      {format(suite.lastRun, "MMM d, yyyy HH:mm aa")}
                    </div>
                  </td>
                  <td>
                    <span className={statusClass(suite.status)}>{suite.status}</span>
                  </td>
                  <td className="text-right">
                    <button
                      className="flex items-center gap-1 ml-auto text-xs font-bold px-2.5 py-1 rounded bg-[#00E676] text-[#070F1E] hover:bg-[#00c865] transition"
                    >
                      <Play size={11} /> Run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
