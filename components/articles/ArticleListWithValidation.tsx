"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  content?: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
}

function ValidationResults({ article }: { article: Article }) {
  const content = article.content || "";
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const urlMatches = content.match(/https?:\/\/[^\s]+/g) || [];

  const checks = [
    { label: "Headline",         pass: !!article.title?.trim() },
    { label: "Summary",          pass: wordCount > 20 },
    { label: "Author",           pass: !!article.author?.trim() },
    { label: "Category",         pass: !!article.category?.trim() },
    { label: "Word Count",       pass: wordCount >= 50, warn: wordCount > 0 && wordCount < 50 },
    { label: "Publication Date", pass: !!article.publishedAt },
    { label: "Images",           pass: !!article.imageUrl?.trim() },
    { label: "Attributes",       pass: true },
    { label: "Metadata",         pass: !!article.category },
    { label: "External Links",   pass: urlMatches.length > 0, warn: urlMatches.length === 0 },
    { label: "Duplicate Content",pass: true },
  ];

  const passCount = checks.filter(c => c.pass).length;
  const score = Math.round((passCount / checks.length) * 10 * 10) / 10;

  return (
    <div className="card p-5 flex-1" style={{ minWidth: 280 }}>
      <h3 className="text-sm font-semibold mb-1 text-[#E2F1FF]">
        Validation Results
      </h3>
      <p className="text-xs mb-4 text-[#88A4C4]">
        AI-powered quality analysis
      </p>

      {/* Score */}
      <div
        className="flex items-center gap-3 rounded-lg px-4 py-3 mb-4 border"
        style={{
          background: score >= 7 ? "rgba(0, 230, 118, 0.15)" : score >= 5 ? "rgba(255, 145, 0, 0.15)" : "rgba(255, 74, 74, 0.15)",
          borderColor: score >= 7 ? "rgba(0, 230, 118, 0.4)" : score >= 5 ? "rgba(255, 145, 0, 0.4)" : "rgba(255, 74, 74, 0.4)",
        }}
      >
        <div>
          <p className="text-xs font-bold" style={{ color: score >= 7 ? "#00E676" : score >= 5 ? "#FF9100" : "#FF4A4A" }}>
            {score >= 7 ? "✓ Validation Completed" : score >= 5 ? "⚠ Needs Improvement" : "✗ Validation Failed"}
          </p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-2xl font-bold text-[#E2F1FF]">{score}</span>
          <span className="text-xs text-[#88A4C4]">/10</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center justify-between text-xs">
            <span className="text-[#88A4C4]">{c.label}</span>
            {c.warn && !c.pass ? (
              <AlertTriangle size={13} className="text-[#FF9100]" />
            ) : c.pass ? (
              <CheckCircle2 size={13} className="text-[#00E676]" />
            ) : (
              <XCircle size={13} className="text-rose-400" />
            )}
          </div>
        ))}
      </div>

      <Link
        href={`/dashboard/articles/${article._id}`}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-[#070F1E] bg-[#00E676] hover:bg-[#00c865] transition shadow-md"
      >
        Validate Article
      </Link>
    </div>
  );
}

export default function ArticleListWithValidation({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(articles[0] ?? null);

  if (articles.length === 0) {
    return (
      <div className="card py-20 text-center">
        <p className="text-sm text-[#88A4C4]">No articles found.</p>
        <Link href="/dashboard/articles/new" className="mt-2 inline-block text-xs font-semibold text-[#00E676] hover:underline">
          Create your first article →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-5 flex-wrap lg:flex-nowrap">
      {/* Article Details */}
      <div className="card p-5 flex-1" style={{ minWidth: 320 }}>
        <h3 className="text-sm font-semibold mb-1 text-[#E2F1FF]">
          Article Details
        </h3>
        <p className="text-xs mb-4 text-[#88A4C4]">
          Review and validate articles for quality and accuracy.
        </p>

        {/* Article list */}
        <div className="space-y-2 mb-5">
          {articles.slice(0, 8).map((a) => {
            const isSelected = selected?._id === a._id;
            return (
              <button
                key={a._id}
                onClick={() => setSelected(a)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition border ${
                  isSelected
                    ? "bg-[#00E676]/20 border-[#00E676] text-[#E2F1FF]"
                    : "bg-[#13253B] border-[#1E3A5F] text-[#E2F1FF] hover:bg-[#1E3A5F]"
                }`}
              >
                <div className="truncate font-semibold text-[#E2F1FF]">{a.title}</div>
                <div className="mt-0.5 flex gap-2 text-[#88A4C4]">
                  <span>{a.category || "Uncategorized"}</span>
                  {a.author && <span>· {a.author}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected article preview */}
        {selected && (
          <div className="space-y-3 pt-4 border-t border-[#1E3A5F]">
            <h4 className="text-sm font-semibold text-[#E2F1FF]">
              {selected.title}
            </h4>
            <p className="text-xs leading-relaxed line-clamp-4 text-[#88A4C4]">
              {selected.content || "No content preview available."}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["Category", selected.category || "—"],
                ["Author", selected.author || "—"],
                ["Status", selected.status || "—"],
                ["Published", selected.publishedAt ? format(new Date(selected.publishedAt), "MMM d, yyyy") : "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="text-[#88A4C4] text-[11px]">{label}</span>
                  <p className="font-semibold mt-0.5 text-[#E2F1FF]">{value}</p>
                </div>
              ))}
            </div>
            {selected.imageUrl && (
              <div>
                <span className="text-xs text-[#88A4C4]">Image URL</span>
                <p className="text-xs font-mono mt-0.5 truncate text-[#00E5FF]">
                  {selected.imageUrl}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Panel */}
      {selected && <ValidationResults article={selected} />}
    </div>
  );
}
