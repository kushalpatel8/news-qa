"use client";

import { useMemo } from "react";
import { validateArticleWordCount, extractUrls } from "@/lib/validators/article.validator";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ArticleValidationProps {
  content: string;
  title: string;
  category: string;
}

export default function ArticleValidation({ content, title, category }: ArticleValidationProps) {
  const wordCount = useMemo(() => validateArticleWordCount(content), [content]);
  const urls = useMemo(() => extractUrls(content), [content]);
  
  const minWordCount = 50;
  const isWordCountValid = wordCount >= minWordCount;
  
  const hasTitle = title.trim().length > 0;
  const hasCategory = category.trim().length > 0;

  return (
    <div className="card p-5 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#E2F1FF] border-b border-[#1E3A5F] pb-2">QA Validation</h3>
        <p className="text-sm text-[#88A4C4] mt-1">Real-time deterministic validation checks.</p>
      </div>

      <div className="space-y-4">
        {/* Metadata Check */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#E2F1FF]">Metadata</h4>
          <div className="flex items-center gap-2 text-sm">
            {hasTitle ? <CheckCircle className="w-4 h-4 text-[#00E676]" /> : <XCircle className="w-4 h-4 text-rose-400" />}
            <span className={hasTitle ? "text-[#88A4C4]" : "text-rose-400"}>Title is {hasTitle ? "present" : "missing"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {hasCategory ? <CheckCircle className="w-4 h-4 text-[#00E676]" /> : <XCircle className="w-4 h-4 text-rose-400" />}
            <span className={hasCategory ? "text-[#88A4C4]" : "text-rose-400"}>Category is {hasCategory ? "present" : "missing"}</span>
          </div>
        </div>

        {/* Content Check */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#E2F1FF]">Content Rules</h4>
          <div className="flex items-center gap-2 text-sm">
            {isWordCountValid ? <CheckCircle className="w-4 h-4 text-[#00E676]" /> : <AlertTriangle className="w-4 h-4 text-[#FF9100]" />}
            <span className={isWordCountValid ? "text-[#88A4C4]" : "text-[#FF9100]"}>
              Word count: {wordCount} (Min: {minWordCount})
            </span>
          </div>
        </div>

        {/* URLs Check */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#E2F1FF]">Links Detected ({urls.length})</h4>
          {urls.length > 0 ? (
            <ul className="text-xs text-[#00E676] space-y-1 list-disc pl-5 overflow-hidden text-ellipsis">
              {urls.map((url, i) => (
                <li key={i}><a href={url} target="_blank" rel="noreferrer" className="hover:underline">{url}</a></li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#88A4C4]">No links found in the content.</p>
          )}
        </div>
      </div>
    </div>
  );
}
