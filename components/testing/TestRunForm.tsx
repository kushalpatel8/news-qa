"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertCircle } from "lucide-react";

export interface TestCaseItem {
  _id: string;
  title: string;
  module: string;
  priority: string;
  status: string;
}

export default function TestRunForm({ availableTestCases }: { availableTestCases: TestCaseItem[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedCases.length === availableTestCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(availableTestCases.map((tc) => tc._id));
    }
  };

  const toggleTestCase = (id: string) => {
    if (selectedCases.includes(id)) {
      setSelectedCases(selectedCases.filter((item) => item !== id));
    } else {
      setSelectedCases([...selectedCases, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for the test run.");
      return;
    }
    if (selectedCases.length === 0) {
      setError("Please select at least one test case.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/test-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          testCases: selectedCases,
          status: "PENDING",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create test run");
      }

      router.push("/dashboard/test-runs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-[#FF3366]/20 border border-[#FF3366]/40 text-[#FF3366] text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-bold text-[#E2F1FF]">Test Run Information</h2>
        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1">
            Test Run Title <span className="text-[#FF3366]">*</span>
          </label>
          <input
            type="text"
            className="input-base w-full text-xs"
            placeholder="e.g., Q3 Regression Test Suite"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1">
            Description
          </label>
          <textarea
            className="input-base w-full text-xs"
            rows={3}
            placeholder="Objective or notes for this test run..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#E2F1FF]">Select Test Cases</h2>
            <p className="text-xs text-[#88A4C4] mt-0.5">
              Selected {selectedCases.length} of {availableTestCases.length} test cases
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-xs font-bold text-[#00E676] hover:underline"
          >
            {selectedCases.length === availableTestCases.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        {availableTestCases.length === 0 ? (
          <div className="text-xs text-[#88A4C4] py-4 text-center">
            No test cases available. Please create test cases first.
          </div>
        ) : (
          <div className="divide-y divide-[#1E3A5F] border border-[#1E3A5F] rounded-lg max-h-96 overflow-y-auto">
            {availableTestCases.map((tc) => {
              const selected = selectedCases.includes(tc._id);
              return (
                <div
                  key={tc._id}
                  onClick={() => toggleTestCase(tc._id)}
                  className={`p-3 flex items-center justify-between cursor-pointer transition text-xs ${
                    selected ? "bg-[#00E676]/15 text-[#E2F1FF]" : "hover:bg-[#13253B]/50 text-[#88A4C4]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {}}
                      className="rounded border-[#1E3A5F] text-[#00E676] focus:ring-[#00E676]"
                    />
                    <div>
                      <div className="font-semibold text-[#E2F1FF]">{tc.title}</div>
                      <div className="text-[11px] text-[#88A4C4]">Module: {tc.module}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                    {tc.priority}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-xs font-semibold rounded-md border border-[#1E3A5F] text-[#88A4C4] hover:bg-[#13253B] transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#00E676] hover:bg-[#00c853] text-[#070F1E] font-bold text-xs rounded-lg transition disabled:opacity-50 shadow"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Create Test Run</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
