"use client";

import { useState } from "react";
import { Sparkles, Loader2, Save } from "lucide-react";

export default function GeneratedTestCases() {
  const [requirement, setRequirement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!requirement) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement, count: 3 })
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

  const handleSaveToDB = async (testCase: any, index: number) => {
    try {
      const res = await fetch("/api/test-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...testCase,
          status: "DRAFT"
        })
      });
      if (!res.ok) throw new Error("Failed to save");
      
      // Remove from generated list once saved
      setGeneratedTests(prev => prev.filter((_, i) => i !== index));
      alert("Test case saved successfully!");
    } catch (err: any) {
      alert("Error saving test case: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <label className="block text-xs font-semibold text-[#88A4C4] mb-2">
          Describe a feature or requirement to generate test cases for:
        </label>
        <textarea
          rows={4}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="e.g. As a user, I want to reset my password using an email link..."
          className="input-base w-full mb-4 text-xs"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !requirement}
          className="px-4 py-2 bg-[#00E676] text-[#070F1E] rounded-md hover:bg-[#00c865] transition flex items-center gap-2 disabled:opacity-50 text-xs font-bold"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGenerating ? "Generating with News Guard AI..." : "Generate Test Cases"}
        </button>
        {error && <p className="text-rose-400 text-xs mt-3">{error}</p>}
      </div>

      {generatedTests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#E2F1FF]">Generated Suggestions</h3>
          {generatedTests.map((tc, idx) => (
            <div key={idx} className="card p-5 relative">
              <button 
                onClick={() => handleSaveToDB(tc, idx)}
                className="absolute top-4 right-4 bg-[#00E676] text-[#070F1E] hover:bg-[#00c865] px-3 py-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold shadow"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <h4 className="font-semibold text-[#E2F1FF] pr-20 text-sm">{tc.title}</h4>
              <p className="text-xs text-[#88A4C4] mt-1">{tc.description}</p>
              
              <div className="mt-4">
                <h5 className="text-[11px] font-semibold text-[#88A4C4] uppercase tracking-wider mb-2">Steps</h5>
                <ol className="list-decimal pl-5 text-xs space-y-1 text-[#88A4C4]">
                  {tc.steps?.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 bg-[#13253B] p-3 rounded text-xs text-[#88A4C4] border border-[#1E3A5F]">
                <span className="font-semibold text-[#E2F1FF]">Expected:</span> {tc.expectedResult}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
