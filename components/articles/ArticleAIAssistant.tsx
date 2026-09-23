"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle,
  ShieldAlert,
  Loader2,
  Bot,
  AlertTriangle,
  PenTool,
  UploadCloud,
  FileText,
  FileCheck,
  Zap,
} from "lucide-react";

interface FactCheckResult {
  aiProbabilityScore: number;
  factualInaccuracies: {
    claim: string;
    correction: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
  }[];
  isFactuallySound: boolean;
}

interface GrammarMistake {
  original: string;
  correction: string;
  type: string;
  explanation: string;
}

interface DocumentAnalysisResult {
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

interface ArticleAIAssistantProps {
  onGenerate: (title: string, content: string, category: string) => void;
  currentTitle: string;
  currentContent: string;
}

export default function ArticleAIAssistant({
  onGenerate,
  currentTitle,
  currentContent,
}: ArticleAIAssistantProps) {
  const [activeTab, setActiveTab] = useState<
    "generate" | "upload" | "fact-check"
  >("generate");

  // Generate state
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Document Upload & Grammar Check state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [docAnalysisResult, setDocAnalysisResult] =
    useState<DocumentAnalysisResult | null>(null);
  const [extractedDocText, setExtractedDocText] = useState<string>("");
  const [docAnalysisError, setDocAnalysisError] = useState<string | null>(null);

  // Fact check state
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(
    null
  );
  const [factCheckError, setFactCheckError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to generate article");
      const data = await res.json();
      onGenerate(data.title, data.content, data.category);
    } catch (err: any) {
      setGenerateError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDocumentAnalysis = async () => {
    if (!selectedFile && !currentContent.trim()) {
      setDocAnalysisError("Please select a PDF/DOCX file or type article content to check.");
      return;
    }
    setIsAnalyzingDoc(true);
    setDocAnalysisError(null);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("text", currentContent);
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
      setExtractedDocText(data.extractedText || "");
      setDocAnalysisResult(data.analysis);
    } catch (err: any) {
      setDocAnalysisError(err.message);
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  const handleFactCheck = async () => {
    if (!currentTitle || !currentContent) {
      setFactCheckError("Title and content are required to fact check.");
      return;
    }
    setIsFactChecking(true);
    setFactCheckError(null);
    try {
      const res = await fetch("/api/ai/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: currentTitle, content: currentContent }),
      });
      if (!res.ok) throw new Error("Failed to fact check article");
      const data = await res.json();
      setFactCheckResult(data);
    } catch (err: any) {
      setFactCheckError(err.message);
    } finally {
      setIsFactChecking(false);
    }
  };

  return (
    <div className="card flex flex-col h-full">
      <div className="p-4 border-b border-[#1E3A5F] bg-[#13253B] rounded-t-lg flex items-center gap-2">
        <Bot className="w-5 h-5 text-[#00E676]" />
        <h3 className="font-semibold text-xs text-[#E2F1FF]">News Guard AI</h3>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-[#1E3A5F] text-xs">
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex-1 py-2.5 font-medium transition-colors ${
            activeTab === "generate"
              ? "text-[#E2F1FF] border-b-2 border-[#00E676] bg-[#00E676]/10 font-bold"
              : "text-[#88A4C4] hover:text-[#E2F1FF]"
          }`}
        >
          Generate
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2.5 font-medium transition-colors ${
            activeTab === "upload"
              ? "text-[#E2F1FF] border-b-2 border-[#00E676] bg-[#00E676]/10 font-bold"
              : "text-[#88A4C4] hover:text-[#E2F1FF]"
          }`}
        >
          Doc Grammar Check
        </button>
        <button
          onClick={() => setActiveTab("fact-check")}
          className={`flex-1 py-2.5 font-medium transition-colors ${
            activeTab === "fact-check"
              ? "text-[#E2F1FF] border-b-2 border-[#00E676] bg-[#00E676]/10 font-bold"
              : "text-[#88A4C4] hover:text-[#E2F1FF]"
          }`}
        >
          Fact Checker
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* TAB 1: GENERATE ARTICLE */}
        {activeTab === "generate" && (
          <div className="space-y-4">
            <p className="text-xs text-[#88A4C4]">
              Provide a topic or prompt, and News Guard AI will write a complete draft for you.
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Write a news report about the recent breakthroughs in solid state batteries..."
              rows={4}
              className="input-base w-full text-xs"
            />
            {generateError && (
              <p className="text-rose-400 text-xs">{generateError}</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#00E676] text-[#070F1E] rounded-md hover:bg-[#00c865] disabled:opacity-50 transition-colors text-xs font-bold"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PenTool className="w-4 h-4" />
              )}
              {isGenerating ? "Drafting..." : "Generate Draft"}
            </button>
          </div>
        )}

        {/* TAB 2: UPLOAD DOCUMENT & GRAMMAR CHECK */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <p className="text-xs text-[#88A4C4]">
              Upload a <strong>PDF, DOCX, or TXT</strong> article file to extract text, audit grammar, check style consistency, and get improvement suggestions.
            </p>

            <div className="border-2 border-dashed border-[#1E3A5F] rounded-lg p-4 text-center bg-[#13253B]/50 hover:bg-[#13253B] transition">
              <UploadCloud className="w-6 h-6 text-[#00E5FF] mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="doc-upload-input"
              />
              <label
                htmlFor="doc-upload-input"
                className="cursor-pointer text-xs font-semibold text-[#00E5FF] hover:underline"
              >
                {selectedFile ? selectedFile.name : "Click to select .PDF or .DOCX file"}
              </label>
              {selectedFile && (
                <p className="text-[11px] text-[#88A4C4] mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB selected
                </p>
              )}
            </div>

            <button
              onClick={handleDocumentAnalysis}
              disabled={isAnalyzingDoc}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#00E676] text-[#070F1E] rounded-md hover:bg-[#00c865] disabled:opacity-50 transition-colors text-xs font-bold shadow"
            >
              {isAnalyzingDoc ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileCheck className="w-4 h-4" />
              )}
              {isAnalyzingDoc
                ? "Extracting Text & Checking Grammar..."
                : "Analyze File Quality & Grammar"}
            </button>

            {docAnalysisError && (
              <p className="text-rose-400 text-xs text-center">{docAnalysisError}</p>
            )}

            {/* Document Analysis Result */}
            {docAnalysisResult && (
              <div className="space-y-4 pt-4 border-t border-[#1E3A5F]">
                {/* Score & Quick Actions */}
                <div className="bg-[#13253B] p-3 rounded-lg border border-[#1E3A5F] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#88A4C4] block">Article Quality Score</span>
                    <span className="text-[10px] text-[#00E5FF]">
                      {docAnalysisResult.metrics?.tone || "Standard Tone"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#00E676]">
                      {docAnalysisResult.overallScore}
                    </span>
                    <span className="text-xs text-[#88A4C4]">/100</span>
                  </div>
                </div>

                {/* Apply Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onGenerate(
                        docAnalysisResult.titleSuggestion || "Extracted News Report",
                        extractedDocText,
                        docAnalysisResult.categorySuggestion || "General"
                      );
                    }}
                    className="flex-1 text-[11px] font-semibold py-1.5 px-2 bg-[#13253B] border border-[#1E3A5F] text-[#E2F1FF] hover:bg-[#1E3A5F] rounded transition flex items-center justify-center gap-1"
                  >
                    <FileText size={12} /> Apply Raw Extracted Text
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onGenerate(
                        docAnalysisResult.titleSuggestion || "Polished News Article",
                        docAnalysisResult.polishedContent,
                        docAnalysisResult.categorySuggestion || "General"
                      );
                    }}
                    className="flex-1 text-[11px] font-bold py-1.5 px-2 bg-[#00E676] text-[#070F1E] hover:bg-[#00c865] rounded transition flex items-center justify-center gap-1 shadow"
                  >
                    <Zap size={12} /> Apply Polished Version
                  </button>
                </div>

                {/* Metrics Breakdown */}
                {docAnalysisResult.metrics && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#13253B] p-2 rounded border border-[#1E3A5F]">
                      <span className="text-[10px] text-[#88A4C4]">Readability</span>
                      <p className="font-semibold text-[#E2F1FF] text-[11px]">
                        {docAnalysisResult.metrics.readability}
                      </p>
                    </div>
                    <div className="bg-[#13253B] p-2 rounded border border-[#1E3A5F]">
                      <span className="text-[10px] text-[#88A4C4]">Clarity</span>
                      <p className="font-semibold text-[#E2F1FF] text-[11px]">
                        {docAnalysisResult.metrics.clarity}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grammatical Mistakes List */}
                <div>
                  <h4 className="text-xs font-semibold text-[#E2F1FF] mb-2 flex items-center justify-between">
                    <span>Grammatical & Style Issues</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF9100]/20 text-[#FF9100] font-bold">
                      {docAnalysisResult.grammarMistakes?.length || 0} Found
                    </span>
                  </h4>

                  {docAnalysisResult.grammarMistakes &&
                  docAnalysisResult.grammarMistakes.length > 0 ? (
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {docAnalysisResult.grammarMistakes.map((issue, idx) => (
                        <div
                          key={idx}
                          className="bg-[#13253B] border border-[#FF9100]/30 p-2.5 rounded text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#FF9100] uppercase tracking-wider">
                              {issue.type || "Grammar"}
                            </span>
                          </div>
                          <p className="text-rose-300 font-mono text-[11px] line-through">
                            "{issue.original}"
                          </p>
                          <p className="text-[#00E676] font-mono text-[11px] font-bold">
                            ✓ "{issue.correction}"
                          </p>
                          <p className="text-[11px] text-[#88A4C4]">
                            {issue.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-3 bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#00E676] mr-2" />
                      <p className="text-xs text-[#00E676] font-medium">
                        No grammatical or spelling mistakes detected!
                      </p>
                    </div>
                  )}
                </div>

                {/* Editorial Suggestions */}
                {docAnalysisResult.suggestions &&
                  docAnalysisResult.suggestions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-[#E2F1FF] mb-2">
                        Suggestions to Improve Quality
                      </h4>
                      <ul className="space-y-1.5 list-disc pl-4 text-xs text-[#88A4C4]">
                        {docAnalysisResult.suggestions.map((sug, i) => (
                          <li key={i}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FACT CHECKER */}
        {activeTab === "fact-check" && (
          <div className="space-y-4">
            <p className="text-xs text-[#88A4C4]">
              Scan the current article content for factual inaccuracies and AI-generation markers.
            </p>
            <button
              onClick={handleFactCheck}
              disabled={isFactChecking}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#13253B] border border-[#1E3A5F] text-[#E2F1FF] rounded-md hover:bg-[#1E3A5F] disabled:opacity-50 transition-colors text-xs font-semibold"
            >
              {isFactChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
              {isFactChecking ? "Scanning..." : "Scan Current Article"}
            </button>
            {factCheckError && (
              <p className="text-rose-400 text-xs text-center">{factCheckError}</p>
            )}

            {factCheckResult && (
              <div className="space-y-4 pt-4 border-t border-[#1E3A5F]">
                <div className="bg-[#13253B] p-3 rounded-lg border border-[#1E3A5F] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#88A4C4]">
                    AI Probability Score
                  </span>
                  <span
                    className={`text-base font-bold ${
                      factCheckResult.aiProbabilityScore > 50
                        ? "text-[#FF9100]"
                        : "text-[#00E676]"
                    }`}
                  >
                    {factCheckResult.aiProbabilityScore}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-xs font-semibold text-[#E2F1FF]">
                      Factual Accuracy
                    </h4>
                    {factCheckResult.isFactuallySound ? (
                      <span className="badge badge-passed">Verified Sound</span>
                    ) : (
                      <span className="badge badge-failed">Issues Found</span>
                    )}
                  </div>

                  {factCheckResult.factualInaccuracies.length > 0 ? (
                    <div className="space-y-3">
                      {factCheckResult.factualInaccuracies.map((issue, idx) => (
                        <div
                          key={idx}
                          className="bg-[#FF9100]/10 border border-[#FF9100]/30 p-3 rounded-lg text-xs"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#FF9100] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-[#FF9100] mb-1">
                                Claim: "{issue.claim}"
                              </p>
                              <p className="text-[#88A4C4]">
                                Correction: {issue.correction}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-3 bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#00E676] mr-2" />
                      <p className="text-xs text-[#00E676] font-medium">
                        No glaring inaccuracies found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
