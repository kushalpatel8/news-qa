"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { testCaseSchema, TestCaseFormValues } from "@/lib/validators/testCase.validator";
import { Plus, Trash2 } from "lucide-react";

interface TestCaseFormProps {
  initialData?: TestCaseFormValues & { _id?: string };
}

export default function TestCaseForm({ initialData }: TestCaseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestCaseFormValues>({
    resolver: zodResolver(testCaseSchema) as any,
    defaultValues: initialData || {
      title: "",
      description: "",
      module: "",
      preconditions: "",
      steps: [""],
      expectedResult: "",
      actualResult: "",
      status: "DRAFT",
      priority: "MEDIUM",
      severity: "MEDIUM",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps" as never, // cast to never to bypass strict typing for string array primitive
  });

  const onSubmit = async (data: TestCaseFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const url = initialData?._id 
        ? `/api/test-cases/${initialData._id}` 
        : "/api/test-cases";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save test case");
      }

      router.push("/dashboard/test-cases");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
      {error && (
        <div className="bg-[#722f37] text-[#FFFFE3] p-3 rounded-md text-xs border border-[#a33838]">
          {error}
        </div>
      )}

      {/* Basic Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#E2F1FF] border-b border-[#1E3A5F] pb-2">Basic Details</h3>
        
        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Title</label>
          <input
            {...register("title")}
            className="input-base w-full"
            placeholder="Verify login functionality..."
          />
          {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Module</label>
            <input
              {...register("module")}
              className="input-base w-full"
              placeholder="e.g. Authentication, Article QA"
            />
            {errors.module && <p className="text-rose-400 text-xs mt-1">{errors.module.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Preconditions</label>
            <input
              {...register("preconditions")}
              className="input-base w-full"
              placeholder="User is logged out..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="input-base w-full"
            placeholder="Describe the purpose of this test..."
          />
          {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* Test Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-2">
          <h3 className="text-sm font-bold text-[#E2F1FF]">Test Steps</h3>
          <button
            type="button"
            onClick={() => append("")}
            className="text-xs font-bold flex items-center gap-1 text-[#00E676] hover:underline"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <span className="bg-[#13253B] text-[#E2F1FF] border border-[#1E3A5F] w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-grow">
                <textarea
                  {...register(`steps.${index}` as const)}
                  rows={2}
                  className="input-base w-full text-xs"
                  placeholder="Navigate to /login..."
                />
                {errors.steps?.[index] && (
                  <p className="text-rose-400 text-xs mt-1">{errors.steps[index]?.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-rose-400 hover:bg-rose-950/40 p-2 rounded-md mt-0.5 transition"
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {errors.steps && !Array.isArray(errors.steps) && (
            <p className="text-rose-400 text-xs">{errors.steps.message}</p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#E2F1FF] border-b border-[#1E3A5F] pb-2">Results</h3>
        
        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Expected Result</label>
          <textarea
            {...register("expectedResult")}
            rows={3}
            className="input-base w-full"
            placeholder="User is redirected to dashboard..."
          />
          {errors.expectedResult && <p className="text-rose-400 text-xs mt-1">{errors.expectedResult.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Actual Result (Optional)</label>
          <textarea
            {...register("actualResult")}
            rows={2}
            className="input-base w-full"
            placeholder="Actual observation during execution..."
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#E2F1FF] border-b border-[#1E3A5F] pb-2">Metadata</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Status</label>
            <select
              {...register("status")}
              className="input-base w-full"
            >
              <option value="DRAFT">Draft</option>
              <option value="READY">Ready</option>
              <option value="PASSED">Passed</option>
              <option value="FAILED">Failed</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Priority</label>
            <select
              {...register("priority")}
              className="input-base w-full"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Severity</label>
            <select
              {...register("severity")}
              className="input-base w-full"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#1E3A5F]">
        <button
          type="button"
          onClick={() => router.push("/dashboard/test-cases")}
          className="px-4 py-2 text-xs font-semibold rounded-md border border-[#1E3A5F] text-[#88A4C4] hover:bg-[#13253B] transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-bold rounded-md bg-[#00E676] text-[#070F1E] hover:bg-[#00c853] transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Test Case"}
        </button>
      </div>
    </form>
  );
}
