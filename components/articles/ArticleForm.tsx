"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { articleSchema, ArticleFormValues } from "@/lib/validators/article.validator";

import ArticleAIAssistant from "./ArticleAIAssistant";

interface ArticleFormProps {
  initialData?: ArticleFormValues & { _id?: string };
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema) as any,
    defaultValues: initialData || {
      title: "",
      content: "",
      category: "",
      author: "",
      status: "DRAFT",
      tags: [],
    },
  });

  const currentTitle = watch("title");
  const currentContent = watch("content");

  const handleAIGenerate = (title: string, content: string, category: string) => {
    setValue("title", title, { shouldValidate: true, shouldDirty: true });
    setValue("content", content, { shouldValidate: true, shouldDirty: true });
    setValue("category", category, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const url = initialData?._id 
        ? `/api/articles/${initialData._id}` 
        : "/api/articles";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save article");
      }

      router.push("/dashboard/articles");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
          {error && (
            <div className="bg-[#FF9100]/10 text-[#FF9100] p-3 rounded-md text-xs border border-[#FF9100]/30">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Title</label>
            <input
              {...register("title")}
              className="input-base w-full"
              placeholder="Article Title"
            />
            {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Category</label>
              <input
                {...register("category")}
                className="input-base w-full"
                placeholder="e.g. Technology, Politics"
              />
              {errors.category && <p className="text-rose-400 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Author</label>
              <input
                {...register("author")}
                className="input-base w-full"
                placeholder="Author Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Content</label>
            <textarea
              {...register("content")}
              rows={12}
              className="input-base w-full font-mono text-xs"
              placeholder="Article body content..."
            />
            {errors.content && <p className="text-rose-400 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#88A4C4] mb-1.5">Status</label>
            <select
              {...register("status")}
              className="input-base w-full"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[#1E3A5F]">
            <button
              type="button"
              onClick={() => router.push("/dashboard/articles")}
              className="px-4 py-2 text-xs font-semibold rounded-md border border-[#1E3A5F] text-[#88A4C4] hover:bg-[#13253B] transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setValue("status", "DRAFT");
                handleSubmit(onSubmit)();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-md border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setValue("status", "PUBLISHED");
                handleSubmit(onSubmit)();
              }}
              className="px-4 py-2 text-xs font-bold rounded-md bg-[#00E676] text-[#070F1E] hover:bg-[#00c865] transition disabled:opacity-50 flex items-center gap-1.5"
            >
              🚀 {isSubmitting ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-1">
        <ArticleAIAssistant 
          onGenerate={handleAIGenerate}
          currentTitle={currentTitle}
          currentContent={currentContent}
        />
      </div>
    </div>
  );
}
