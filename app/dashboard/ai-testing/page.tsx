"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Loader2, Save, Copy, Bot } from "lucide-react";
import { TestPriorityBadge } from "@/components/testing/TestStatusBadge";

type Tab = "generate" | "analyze" | "bug" | "research";

export default function AITestingPage() {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as string) || "QA";

  const isEditor = role === "EDITOR";
  const isQA = role === "QA";

  const [tab, setTab] = useState<Tab>(isEditor ? "analyze" : "generate");

  useEffect(() => {
    if (isEditor && (tab === "generate" || tab === "bug")) {
      setTab("analyze");
    } else if (isQA && (tab === "analyze" || tab === "research")) {
      setTab("generate");
    }
  }, [role, isEditor, isQA, tab]);

  const [requirement, setRequirement] = useState("");
  const [testType, setTestType] = useState("Article Testing");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I can help you with article analysis, research, and QA automation." },
  ]);

  const handleGenerate = async () => {
    if (!requirement) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement, count: 5 }),
      });
      if (!res.ok) throw new Error("Failed to generate tests");
      const data = await res.json();
      setGeneratedTests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (tc: any, index: number) => {
    try {
      const res = await fetch("/api/test-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tc, status: "DRAFT" }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setGeneratedTests(prev => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [
      ...prev,
      { role: "user", text: userMsg },
      { role: "ai", text: "Thanks for your question! I'm analyzing the context. Please check back shortly for AI-powered insights." },
    ]);
  };

  function tabStyle(active: boolean): React.CSSProperties {
    return {
      padding: "8px 16px",
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      color: active ? "var(--accent)" : "var(--text-muted)",
      borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
      cursor: "pointer",
      background: "none",
      border: "none",
    };
  }

  const allTabs: { key: Tab; label: string; allowedRoles: string[] }[] = [
    { key: "analyze",  label: "Analyze Article", allowedRoles: ["ADMIN", "EDITOR"] },
    { key: "research", label: "Research",        allowedRoles: ["ADMIN", "EDITOR"] },
    { key: "generate", label: "Generate Test Cases", allowedRoles: ["ADMIN", "QA"] },
    { key: "bug",      label: "Bug Description",     allowedRoles: ["ADMIN", "QA"] },
  ];

  const visibleTabs = allTabs.filter(t => t.allowedRoles.includes(role));

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          {isEditor ? "AI Content Tools" : "AI Testing & Analysis"}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {isEditor 
            ? "AI-powered tools tailored for Editors to analyze articles and perform web research."
            : "Use AI to generate test cases, analyze content, and automate QA workflows."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Generator */}
        <div className="lg:col-span-2 card overflow-hidden">
          {/* Tabs */}
          <div
            className="flex"
            style={{ borderBottom: "1px solid var(--card-border)", paddingLeft: 16 }}
          >
            {visibleTabs.map(t => (
              <button key={t.key} style={tabStyle(tab === t.key)} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">
            {tab === "generate" && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Requirements / Article
                  </label>
                  <textarea
                    rows={5}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="e.g. Create test cases for a news article publishing system with validations for title, content, author, category, and metadata. Include edge cases."
                    className="w-full text-xs rounded-lg px-3 py-2.5 resize-none"
                    style={{
                      border: "1px solid var(--card-border)",
                      outline: "none",
                      fontFamily: "inherit",
                      color: "var(--text-primary)",
                      lineHeight: 1.6,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Test Type
                  </label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="input-base text-xs w-48"
                    style={{ paddingTop: 6, paddingBottom: 6 }}
                  >
                    {["Article Testing", "API Testing", "UI Testing", "Bug Regression"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !requirement}
                  className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition"
                  style={{ background: "var(--accent)" }}
                >
                  {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  {isGenerating ? "Generating..." : "Generate Test Cases"}
                </button>
              </>
            )}

            {tab !== "generate" && (
              <div className="flex flex-col items-center justify-center py-12 gap-3" style={{ color: "var(--text-muted)" }}>
                <Sparkles size={28} className="text-indigo-300" />
                <p className="text-xs text-center">
                  {tab === "analyze"  && "Paste an article below and AI will evaluate it for quality, factual claims, and writing style."}
                  {tab === "bug"      && "Describe a bug and AI will help generate a detailed, reproducible bug report."}
                  {tab === "research" && "Ask any QA research question and AI will provide sourced insights."}
                </p>
                <textarea
                  rows={5}
                  placeholder="Enter your content here..."
                  className="w-full text-xs rounded-lg px-3 py-2.5 mt-2"
                  style={{ border: "1px solid var(--card-border)", outline: "none", fontFamily: "inherit" }}
                />
                <button
                  className="text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  style={{ background: "var(--accent)" }}
                >
                  <Sparkles size={12} className="inline mr-1" />
                  {tab === "analyze"  ? "Analyze Article" : tab === "bug" ? "Generate Bug Report" : "Research"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Assistant chat */}
        <div className="card flex flex-col overflow-hidden" style={{ height: 480 }}>
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ borderBottom: "1px solid #1E3A5F", background: "#13253B" }}
          >
            <Bot size={16} style={{ color: "#00E676" }} />
            <span className="text-xs font-semibold" style={{ color: "#E2F1FF" }}>AI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "#00E676" : "#13253B",
                    color: msg.role === "user" ? "#070F1E" : "#E2F1FF",
                    fontWeight: msg.role === "user" ? "600" : "normal",
                    border: msg.role === "ai" ? "1px solid #1E3A5F" : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div
            className="p-3 flex gap-2"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Ask anything..."
              className="flex-1 text-xs rounded-lg px-3 py-1.5"
              style={{ border: "1px solid #1E3A5F", background: "#13253B", color: "#E2F1FF", outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={sendChat}
              className="px-3 py-1.5 rounded-lg text-[#070F1E] text-xs font-bold"
              style={{ background: "#00E676" }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Generated Test Cases Results */}
      {generatedTests.length > 0 && (
        <div className="card overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Generated Test Cases
            </h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {generatedTests.length} test cases generated
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Type</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {generatedTests.map((tc, i) => (
                  <tr key={i}>
                    <td className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      TC-{String(i + 1).padStart(3, "0")}
                    </td>
                    <td className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {tc.title}
                    </td>
                    <td>
                      <TestPriorityBadge priority={tc.priority || "MEDIUM"} />
                    </td>
                    <td>
                      <span className="badge badge-ready">{tc.module || testType}</span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Copy"
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(tc, null, 2))}
                          className="p-1 rounded hover:bg-[#13253B] transition"
                          style={{ color: "#88A4C4" }}
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={() => handleSave(tc, i)}
                          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-[#00E676] text-[#070F1E] hover:bg-[#00c865] transition"
                        >
                          <Save size={11} /> Save
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
