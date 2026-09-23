"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Bot,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  FileText,
  TestTube,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Activity,
  Check,
} from "lucide-react";
import Link from "next/link";

export function HeroInteractivePreview() {
  const [activeTab, setActiveTab] = useState<"ai" | "runs" | "api">("ai");

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 rounded-2xl border border-[#334155] bg-[#1E293B] backdrop-blur-xl shadow-2xl overflow-hidden text-left border-glow">
      {/* Top Bar / Mac Window Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] text-[#F8FAFC] border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="ml-2 text-xs font-mono text-[#94A3B8] font-medium">newsqa-workspace.internal/dashboard</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1E293B] rounded-lg p-1 border border-[#334155]">
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeTab === "ai" ? "bg-[#10B981] text-[#F8FAFC] shadow-sm" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            NewsGuard AI
          </button>
          <button
            onClick={() => setActiveTab("runs")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeTab === "runs" ? "bg-[#10B981] text-[#F8FAFC] shadow-sm" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Test Execution
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeTab === "api" ? "bg-[#10B981] text-[#F8FAFC] shadow-sm" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            API Tester
          </button>
        </div>
      </div>

      {/* Interactive Content Window */}
      <div className="p-6 md:p-8 min-h-[360px] flex flex-col justify-between bg-[#1E293B]">
        {activeTab === "ai" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/50 text-[#F8FAFC]">
                  <Bot className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#F8FAFC] text-sm">NewsGuard AI — Article Fact Checker</h4>
                  <p className="text-xs text-[#94A3B8]">Real-time LLM validation & AI probability scoring</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399]">
                Score: 9.8 / 10
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] shadow-sm space-y-1">
                <span className="text-[11px] font-medium text-[#94A3B8]">Factual Accuracy</span>
                <div className="text-lg font-bold text-[#10B981] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Verified Sound
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] shadow-sm space-y-1">
                <span className="text-[11px] font-medium text-[#94A3B8]">AI Probability</span>
                <div className="text-lg font-bold text-[#F8FAFC]">12% (Human Written)</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] shadow-sm space-y-1">
                <span className="text-[11px] font-medium text-[#94A3B8]">Word Count & Quality</span>
                <div className="text-lg font-bold text-[#06B6D4]">1,420 words (Optimal)</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-[#F8FAFC] space-y-1">
              <span className="font-bold text-[#10B981]">AI Recommendation:</span>
              <p className="text-[#CBD5E1]">
                "Article structure meets editorial standards. All external citations are valid, zero propaganda indicators detected."
              </p>
            </div>
          </div>
        )}

        {activeTab === "runs" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/50 text-[#F8FAFC]">
                  <TestTube className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#F8FAFC] text-sm">Sprint #42 — Production Test Run</h4>
                  <p className="text-xs text-[#94A3B8]">24 Test Cases Executed across UI and API</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399]">
                Status: Completed
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#F8FAFC] font-semibold">
                <span>Pass Rate: 95.8%</span>
                <span>23 Passed · 1 Blocked · 0 Failed</span>
              </div>
              <div className="h-3 w-full bg-[#0F172A] rounded-full overflow-hidden flex border border-[#334155]">
                <div style={{ width: "95.8%" }} className="bg-[#10B981]" />
                <div style={{ width: "4.2%" }} className="bg-[#F59E0B]" />
              </div>
            </div>

            <div className="space-y-2">
              {[
                { title: "Verify article publishing workflow with images", status: "PASSED", time: "120ms" },
                { title: "Validate REST API auth token middleware", status: "PASSED", time: "45ms" },
                { title: "Execute defect logging with reproduction steps", status: "PASSED", time: "89ms" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0F172A] border border-[#334155] shadow-sm flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F8FAFC]">{item.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#94A3B8] font-mono text-[11px]">{item.time}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/50 text-[#F8FAFC]">
                  <Zap className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#F8FAFC] text-sm">Native REST API Test Engine</h4>
                  <p className="text-xs text-[#94A3B8]">Latency tracing, status validation & schema enforcement</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399] font-mono">
                200 OK (42ms)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0F172A] font-mono text-xs text-[#F8FAFC] border border-[#334155] flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#F8FAFC] font-bold">GET</span>
              <span className="font-medium text-[#F8FAFC]">https://api.newsqa.internal/v1/articles?limit=20</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0F172A] text-[#F8FAFC] font-mono text-xs overflow-x-auto shadow-inner border border-[#334155]">
              <pre>{`{
  "status": "success",
  "latencyMs": 42,
  "data": [
    { "id": "art_102", "title": "AI Breakthrough in Climate Models", "status": "PUBLISHED" }
  ],
  "pagination": { "total": 142, "page": 1 }
}`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RoleCapabilitiesTabs() {
  const [selectedRole, setSelectedRole] = useState<"qa" | "editor" | "admin" | "viewer">("qa");

  const rolesData = {
    qa: {
      title: "QA Engineer Workflow",
      badge: "Full Testing Suite",
      description: "Author test cases, execute complete test runs, perform API endpoint checks, and log verified defects.",
      features: [
        "Create, edit, & execute manual and automated test cases",
        "Run interactive test execution suites with real-time pass/fail metrics",
        "Perform native REST API requests & trace response latency",
        "Create, update, and resolve defect tickets",
      ],
      color: "bg-[#1E293B] border-[#334155]",
    },
    editor: {
      title: "Editor & Journalist Workflow",
      badge: "NewsGuard AI Powered",
      description: "Write content, validate article structure, check for factual accuracy, and generate AI drafts.",
      features: [
        "Draft and edit news articles in a rich text editor",
        "Run NewsGuard AI for automated fact-checking and claim verification",
        "Check article metadata, word count limits, and broken external URLs",
        "Generate AI article drafts using custom prompts",
      ],
      color: "bg-[#1E293B] border-[#334155]",
    },
    admin: {
      title: "System Admin Workflow",
      badge: "Total Control",
      description: "Manage platform users, assign role RBAC permissions, configure modules, and export executive reports.",
      features: [
        "Manage user roles (QA, Editor, Admin, Viewer)",
        "Configure global platform settings and API endpoints",
        "Access executive analytics cached at the edge via Redis",
        "Full override authority across all testing modules",
      ],
      color: "bg-[#1E293B] border-[#334155]",
    },
    viewer: {
      title: "Viewer & Observer Workflow",
      badge: "Read-Only Insights",
      description: "Explore dashboard metrics, test execution progress, article quality scores, and executive summaries.",
      features: [
        "View live dashboard stats and quality metrics",
        "Inspect test run results and bug status boards",
        "Review article quality scores and validation badges",
        "Access printable executive report summaries",
      ],
      color: "bg-[#1E293B] border-[#334155]",
    },
  };

  const current = rolesData[selectedRole];

  return (
    <div className="space-y-8">
      {/* Role selector tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "qa", label: "QA Engineer" },
          { id: "editor", label: "Editor / Journalist" },
          { id: "admin", label: "Administrator" },
          { id: "viewer", label: "Viewer" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRole(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              selectedRole === tab.id
                ? "bg-[#10B981] text-[#F8FAFC] shadow-md scale-105"
                : "bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#10B981]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Role Capability Detail Card */}
      <div className={`p-8 rounded-2xl ${current.color} border text-left max-w-4xl mx-auto space-y-6 shadow-xl transition-all`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#F8FAFC] bg-[#10B981] border border-[#10B981] px-3 py-1 rounded-full">
              {current.badge}
            </span>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mt-3">{current.title}</h3>
            <p className="text-sm text-[#94A3B8] font-medium mt-1">{current.description}</p>
          </div>
          <Link
            href="/role-select"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#10B981] text-[#F8FAFC] font-bold text-xs hover:bg-[#059669] transition shadow-md whitespace-nowrap"
          >
            Try This Role →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#334155]">
          {current.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-[#F8FAFC]">
              <div className="p-1 rounded bg-[#10B981] text-[#F8FAFC] mt-0.5 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
