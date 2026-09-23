"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Sparkles,
  Loader2,
  Save,
  Copy,
  Bot,
  UploadCloud,
  FileCheck,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { TestPriorityBadge } from "@/components/testing/TestStatusBadge";

type Tab = "analyze" | "research" | "generate" | "bug";

interface GrammarMistake {
  original: string;
  correction: string;
  type: string;
  explanation: string;
}

interface DocAnalysisData {
  titleSuggestion?: string;
  categorySuggestion?: string;
  overallScore: number;
  metrics: {
    readability: string;
    tone: string;
    clarity: string;
    structure: string;
  };
  grammarMistakes: GrammarMistake[];
  suggestions: string[];
  polishedContent: string;
}

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

  // QA Test Generation state
  const [requirement, setRequirement] = useState("");
  const [testType, setTestType] = useState("Article Testing");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Document & Article Analysis state
  const [articleInput, setArticleInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocAnalysisData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Chatbot state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I can help you with document analysis, grammar auditing, research, and QA automation." },
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

  const handleAnalyzeDocument = async () => {
    if (!selectedFile && !articleInput.trim()) {
      setAnalysisError("Please select a PDF/DOCX file or paste text to analyze.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("text", articleInput);
      }

      const res = await fetch("/api/ai/analyze-document", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze document");
      }

      const data = await res.json();
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setAnalysisError(err.message);
    } finally {
      setIsAnalyzing(false);
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
      { role: "ai", text: "Thanks for your question! I'm analyzing your request. Please check back shortly for AI insights." },
    ]);
  };

  function tabStyle(active: boolean): React.CSSProperties {
    return {
      padding: "8px 16px",
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      color: active ? "#E2F1FF" : "#88A4C4",
      borderBottom: active ? "2px solid #00E676" : "2px solid transparent",
      cursor: "pointer",
      background: active ? "rgba(0, 230, 118, 0.1)" : "none",
      border: "none",
    };
  }

  const allTabs: { key: Tab; label: string; allowedRoles: string[] }[] = [
    { key: "analyze",  label: "Document & Grammar Audit", allowedRoles: ["ADMIN", "EDITOR"] },
    { key: "research", label: "Research Claims",          allowedRoles: ["ADMIN", "EDITOR"] },
    { key: "generate", label: "Generate Test Cases",      allowedRoles: ["ADMIN", "QA"] },
    { key: "bug",      label: "Bug Description",           allowedRoles: ["ADMIN", "QA"] },
  ];

  const visibleTabs = allTabs.filter(t => t.allowedRoles.includes(role));

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#E2F1FF]">
          {isEditor ? "Editorial AI Quality Suite" : "AI Testing & Analysis"}
        </h1>
        <p className="text-xs mt-0.5 text-[#88A4C4]">
          {isEditor
            ? "Upload PDF/DOCX articles, check for grammatical errors, and get journalistic improvement suggestions."
            : "Use AI to generate test cases, analyze content, and automate QA workflows."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Panel */}
        <div className="lg:col-span-2 card overflow-hidden">
          {/* Tabs */}
          <div
            className="flex border-b border-[#1E3A5F] pl-4"
          >
            {visibleTabs.map(t => (
              <button key={t.key} style={tabStyle(tab === t.key)} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">
            {/* TAB: GENERATE TEST CASES */}
            {tab === "generate" && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-[#88A4C4]">
                    Requirements / Feature Specification
                  </label>
                  <textarea
                    rows={5}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="e.g. Create test cases for a news article publishing system with validations for title, content, author, category, and metadata."
                    className="input-base w-full text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-[#88A4C4]">
                    Test Type
                  </label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="input-base text-xs w-48 py-1.5"
                  >
                    {["Article Testing", "API Testing", "UI Testing", "Bug Regression"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {error && <p className="text-xs text-rose-400">{error}</p>}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !requirement}
                  className="flex items-center gap-2 text-[#070F1E] text-xs font-bold px-4 py-2 rounded-lg bg-[#00E676] hover:bg-[#00c865] disabled:opacity-50 transition shadow"
                >
                  {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  {isGenerating ? "Generating..." : "Generate Test Cases"}
                </button>
              </>
            )}

            {/* TAB: DOCUMENT & GRAMMAR AUDIT */}
            {tab === "analyze" && (
              <div className="space-y-4">
                <p className="text-xs text-[#88A4C4]">
                  Upload a <strong>PDF, DOCX, or TXT</strong> file, or paste text to perform a comprehensive grammatical audit, style check, and quality scoring.
                </p>

                {/* File Upload Box */}
                <div className="border-2 border-dashed border-[#1E3A5F] rounded-lg p-5 text-center bg-[#13253B]/50 hover:bg-[#13253B] transition">
                  <UploadCloud className="w-8 h-8 text-[#00E5FF] mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="page-doc-upload"
                  />
                  <label
                    htmlFor="page-doc-upload"
                    className="cursor-pointer text-xs font-bold text-[#00E5FF] hover:underline"
                  >
                    {selectedFile ? selectedFile.name : "Click to select .PDF or .DOCX file"}
                  </label>
                  {selectedFile && (
                    <p className="text-xs text-[#88A4C4] mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB selected
                    </p>
                  )}
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-[#1E3A5F] w-full" />
                  <span className="bg-[#0D1B2A] px-3 text-[11px] text-[#88A4C4]">OR PASTE ARTICLE TEXT</span>
                  <div className="border-t border-[#1E3A5F] w-full" />
                </div>

                <textarea
                  rows={4}
                  value={articleInput}
                  onChange={(e) => setArticleInput(e.target.value)}
                  placeholder="Paste article body here..."
                  className="input-base w-full text-xs"
                />

                {analysisError && <p className="text-xs text-rose-400">{analysisError}</p>}

                <button
                  onClick={handleAnalyzeDocument}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 text-[#070F1E] text-xs font-bold px-4 py-2 rounded-lg bg-[#00E676] hover:bg-[#00c865] disabled:opacity-50 transition shadow"
                >
                  {isAnalyzing ? <Loader2 size={13} className="animate-spin" /> : <FileCheck size={13} />}
                  {isAnalyzing ? "Extracting & Auditing Document..." : "Analyze Document Quality & Grammar"}
                </button>

                {/* Analysis Results View */}
                {analysisResult && (
                  <div className="space-y-4 pt-4 border-t border-[#1E3A5F] mt-4">
                    <div className="bg-[#13253B] p-4 rounded-lg border border-[#1E3A5F] flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#E2F1FF]">
                          {analysisResult.titleSuggestion || "Article Quality Score"}
                        </h4>
                        <p className="text-xs text-[#00E5FF] mt-0.5">
                          Tone: {analysisResult.metrics?.tone || "Standard"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#00E676]">{analysisResult.overallScore}</span>
                        <span className="text-xs text-[#88A4C4]">/100</span>
                      </div>
                    </div>

                    {/* Metrics Breakdown */}
                    {analysisResult.metrics && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-[#13253B] p-2.5 rounded border border-[#1E3A5F]">
                          <span className="text-[10px] text-[#88A4C4] block">Readability</span>
                          <span className="font-semibold text-[#E2F1FF]">{analysisResult.metrics.readability}</span>
                        </div>
                        <div className="bg-[#13253B] p-2.5 rounded border border-[#1E3A5F]">
                          <span className="text-[10px] text-[#88A4C4]">Clarity</span>
                          <span className="font-semibold text-[#E2F1FF]">{analysisResult.metrics.clarity}</span>
                        </div>
                        <div className="bg-[#13253B] p-2.5 rounded border border-[#1E3A5F]">
                          <span className="text-[10px] text-[#88A4C4]">Structure</span>
                          <span className="font-semibold text-[#E2F1FF]">{analysisResult.metrics.structure}</span>
                        </div>
                        <div className="bg-[#13253B] p-2.5 rounded border border-[#1E3A5F]">
                          <span className="text-[10px] text-[#88A4C4]">Category</span>
                          <span className="font-semibold text-[#00E5FF]">{analysisResult.categorySuggestion || "General"}</span>
                        </div>
                      </div>
                    )}

                    {/* Grammar Mistakes */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#E2F1FF] mb-2 flex items-center justify-between">
                        <span>Grammatical & Style Errors ({analysisResult.grammarMistakes?.length || 0})</span>
                      </h4>

                      {analysisResult.grammarMistakes && analysisResult.grammarMistakes.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {analysisResult.grammarMistakes.map((issue, idx) => (
                            <div key={idx} className="bg-[#13253B] border border-[#FF9100]/30 p-3 rounded text-xs space-y-1">
                              <span className="text-[10px] font-bold text-[#FF9100] uppercase">{issue.type || "Grammar"}</span>
                              <p className="text-rose-300 font-mono text-[11px] line-through">"{issue.original}"</p>
                              <p className="text-[#00E676] font-mono text-[11px] font-bold">✓ "{issue.correction}"</p>
                              <p className="text-[11px] text-[#88A4C4]">{issue.explanation}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-3 bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-[#00E676] mr-2" />
                          <p className="text-xs text-[#00E676] font-medium">No grammatical or spelling mistakes found!</p>
                        </div>
                      )}
                    </div>

                    {/* Improvement Suggestions */}
                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#E2F1FF] mb-2">Suggestions to Improve Quality</h4>
                        <ul className="space-y-1.5 list-disc pl-4 text-xs text-[#88A4C4]">
                          {analysisResult.suggestions.map((sug, i) => (
                            <li key={i}>{sug}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: RESEARCH OR BUG */}
            {(tab === "research" || tab === "bug") && (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-[#88A4C4]">
                <Sparkles size={28} className="text-[#00E5FF]" />
                <p className="text-xs text-center">
                  {tab === "bug" && "Describe a bug to generate a detailed, reproducible report."}
                  {tab === "research" && "Ask any journalistic or QA research question."}
                </p>
                <textarea
                  rows={5}
                  placeholder="Enter your details..."
                  className="input-base w-full text-xs"
                />
                <button className="text-[#070F1E] text-xs font-bold px-4 py-2 rounded-lg bg-[#00E676] hover:bg-[#00c865] transition">
                  <Sparkles size={12} className="inline mr-1" />
                  {tab === "bug" ? "Generate Bug Report" : "Research"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Assistant chat */}
        <div className="card flex flex-col overflow-hidden" style={{ height: 540 }}>
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ borderBottom: "1px solid #1E3A5F", background: "#13253B" }}
          >
            <Bot size={16} style={{ color: "#00E676" }} />
            <span className="text-xs font-semibold text-[#E2F1FF]">AI Assistant</span>
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
            style={{ borderTop: "1px solid #1E3A5F" }}
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

      {/* Generated test cases view */}
      {generatedTests.length > 0 && (
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#E2F1FF]">Generated Test Cases</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Module</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {generatedTests.map((tc, i) => (
                  <tr key={i}>
                    <td className="font-mono text-xs text-[#88A4C4]">
                      TC-{String(i + 1).padStart(3, "0")}
                    </td>
                    <td className="text-xs font-medium text-[#E2F1FF]">
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
                          className="p-1 rounded hover:bg-[#13253B] transition text-[#88A4C4]"
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
