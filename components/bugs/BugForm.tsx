"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { bugSchema, BugFormValues } from "@/lib/validators/bug.validator";

export default function BugForm({ initialData }: { initialData?: BugFormValues & { _id?: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BugFormValues>({
    resolver: zodResolver(bugSchema) as any,
    defaultValues: initialData || {
      title: "",
      description: "",
      stepsToReproduce: "",
      expectedResult: "",
      actualResult: "",
      severity: "MEDIUM",
      priority: "MEDIUM",
      status: "OPEN",
      environment: "Production",
      screenshotUrl: "",
      assignedTo: "",
      reporterRole: "QA",
    },
  });

  const onSubmit = async (data: BugFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const url = initialData?._id ? `/api/bugs/${initialData._id}` : "/api/bugs";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || "Failed to save bug");
      }

      router.push("/dashboard/bugs");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
      {error && <div className="bg-[#FF9100]/10 text-[#FF9100] p-3 rounded-md text-xs border border-[#FF9100]/30">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Title</label>
          <input {...register("title")} className="input-base w-full" />
          {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Environment</label>
          <input {...register("environment")} className="input-base w-full" />
          {errors.environment && <p className="text-rose-400 text-xs mt-1">{errors.environment.message}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Screenshot URL</label>
          <input {...register("screenshotUrl")} className="input-base w-full" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Description</label>
          <textarea {...register("description")} rows={3} className="input-base w-full" />
          {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Steps to Reproduce</label>
          <textarea {...register("stepsToReproduce")} rows={4} className="input-base w-full font-mono text-xs" />
          {errors.stepsToReproduce && <p className="text-rose-400 text-xs mt-1">{errors.stepsToReproduce.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Expected Result</label>
          <textarea {...register("expectedResult")} rows={2} className="input-base w-full" />
          {errors.expectedResult && <p className="text-rose-400 text-xs mt-1">{errors.expectedResult.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Actual Result</label>
          <textarea {...register("actualResult")} rows={2} className="input-base w-full" />
          {errors.actualResult && <p className="text-rose-400 text-xs mt-1">{errors.actualResult.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Severity</label>
          <select {...register("severity")} className="input-base w-full">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Status</label>
          <select {...register("status")} className="input-base w-full">
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FIXED">Fixed</option>
            <option value="VERIFIED">Verified</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Reporter Role</label>
          <select {...register("reporterRole")} className="input-base w-full">
            <option value="QA">QA</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#1E3A5F]">
        <button type="button" onClick={() => router.push("/dashboard/bugs")} className="px-4 py-2 text-xs font-semibold rounded-md border border-[#1E3A5F] text-[#88A4C4] hover:bg-[#13253B] transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-xs font-bold rounded-md bg-[#00E676] text-[#070F1E] hover:bg-[#00c865] transition disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save Bug"}
        </button>
      </div>
    </form>
  );
}
