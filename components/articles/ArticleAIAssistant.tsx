"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, ShieldAlert, Loader2, Bot, AlertTriangle, PenTool } from "lucide-react";

interface FactCheckResult {
  aiProbabilityScore: number;
  factualInaccuracies: {
    claim: string;
    correction: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
  }[];
  isFactuallySound: boolean;
}

interface ArticleAIAssistantProps {
  onGenerate: (title: string, content: string, category: string) => void;
  currentTitle: string;
  currentContent: string;
}

export default function ArticleAIAssistant({ onGenerate, currentTitle, currentContent }: ArticleAIAssistantProps) {
  const [activeTab, setActiveTab] = useState<"generate" | "fact-check">("generate");
  
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [isFactChecking, setIsFactChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
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

      <div className="flex border-b border-[#1E3A5F] text-xs">
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex-1 py-2.5 font-medium transition-colors ${activeTab === "generate" ? "text-[#E2F1FF] border-b-2 border-[#00E676] bg-[#00E676]/10 font-bold" : "text-[#88A4C4] hover:text-[#E2F1FF]"}`}
        >
          Generate Article
        </button>
        <button
          onClick={() => setActiveTab("fact-check")}
          className={`flex-1 py-2.5 font-medium transition-colors ${activeTab === "fact-check" ? "text-[#E2F1FF] border-b-2 border-[#00E676] bg-[#00E676]/10 font-bold" : "text-[#88A4C4] hover:text-[#E2F1FF]"}`}
        >
          Fact Checker
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === "generate" && (
          <div className="space-y-4">
            <p className="text-xs text-[#88A4C4]">Provide a topic or prompt, and News Guard AI will write a complete draft for you.</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Write a news report about the recent breakthroughs in solid state batteries..."
              rows={4}
              className="input-base w-full text-xs"
            />
            {generateError && <p className="text-rose-400 text-xs">{generateError}</p>}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#00E676] text-[#070F1E] rounded-md hover:bg-[#00c865] disabled:opacity-50 transition-colors text-xs font-bold"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
              {isGenerating ? "Drafting..." : "Generate Draft"}
            </button>
          </div>
        )}

        {activeTab === "fact-check" && (
          <div className="space-y-4">
            <p className="text-xs text-[#88A4C4]">Scan the current article content for factual inaccuracies and AI-generation markers.</p>
            <button
              onClick={handleFactCheck}
              disabled={isFactChecking}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#13253B] border border-[#1E3A5F] text-[#E2F1FF] rounded-md hover:bg-[#1E3A5F] disabled:opacity-50 transition-colors text-xs font-semibold"
            >
              {isFactChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              {isFactChecking ? "Scanning..." : "Scan Current Article"}
            </button>
            {factCheckError && <p className="text-rose-400 text-xs text-center">{factCheckError}</p>}

            {factCheckResult && (
              <div className="space-y-4 pt-4 border-t border-[#1E3A5F]">
                <div className="bg-[#13253B] p-3 rounded-lg border border-[#1E3A5F] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#88A4C4]">AI Probability Score</span>
                  <span className={`text-base font-bold ${factCheckResult.aiProbabilityScore > 50 ? 'text-[#FF9100]' : 'text-[#00E676]'}`}>
                    {factCheckResult.aiProbabilityScore}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-xs font-semibold text-[#E2F1FF]">Factual Accuracy</h4>
                    {factCheckResult.isFactuallySound ? (
                      <span className="badge badge-passed">Verified Sound</span>
                    ) : (
                      <span className="badge badge-failed">Issues Found</span>
                    )}
                  </div>

                  {factCheckResult.factualInaccuracies.length > 0 ? (
                    <div className="space-y-3">
                      {factCheckResult.factualInaccuracies.map((issue, idx) => (
                        <div key={idx} className="bg-[#FF9100]/10 border border-[#FF9100]/30 p-3 rounded-lg text-xs">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#FF9100] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-[#FF9100] mb-1">Claim: "{issue.claim}"</p>
                              <p className="text-[#88A4C4]">Correction: {issue.correction}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-3 bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#00E676] mr-2" />
                      <p className="text-xs text-[#00E676] font-medium">No glaring inaccuracies found.</p>
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
