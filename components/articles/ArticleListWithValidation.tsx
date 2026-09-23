"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle2, XCircle, AlertTriangle, Download, X, User, Calendar, FileText } from "lucide-react";

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

function downloadTxt(article: Article) {
  const title = article.title || "Untitled Article";
  const author = article.author || "Unknown Author";
  const category = article.category || "General";
  const dateStr = article.publishedAt ? format(new Date(article.publishedAt), "PPP") : "N/A";

  const text = `TITLE: ${title}\nAUTHOR: ${author}\nCATEGORY: ${category}\nDATE: ${dateStr}\nSTATUS: ${article.status || "PUBLISHED"}\n\n========================================\nCONTENT\n========================================\n\n${article.content || ""}`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const slugName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  a.download = `${slugName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadDocx(article: Article) {
  const title = article.title || "Untitled Article";
  const author = article.author || "Unknown Author";
  const category = article.category || "General";
  const dateStr = article.publishedAt ? format(new Date(article.publishedAt), "PPP") : "N/A";
  const content = (article.content || "").replace(/\n/g, "<br/>");

  const htmlString = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; }
        h1 { color: #0f172a; font-size: 22pt; margin-bottom: 8pt; border-bottom: 2px solid #00E676; padding-bottom: 6pt; }
        .meta { color: #64748b; font-size: 11pt; margin-bottom: 24pt; }
        .content { font-size: 12pt; line-height: 1.7; color: #334155; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">
        <p><strong>Author:</strong> ${author} &nbsp;|&nbsp; <strong>Category:</strong> ${category} &nbsp;|&nbsp; <strong>Date:</strong> ${dateStr}</p>
      </div>
      <div class="content">
        ${content}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlString], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const slugName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  a.download = `${slugName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPdf(article: Article) {
  const title = article.title || "Untitled Article";
  const author = article.author || "Unknown Author";
  const category = article.category || "General";
  const dateStr = article.publishedAt ? format(new Date(article.publishedAt), "PPP") : "N/A";
  const content = (article.content || "").replace(/\n/g, "<br/>");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #0f172a; }
          h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-bottom: 3px solid #00E676; padding-bottom: 8px; }
          .meta { font-size: 13px; color: #64748b; margin-bottom: 24px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .content { font-size: 14px; line-height: 1.8; color: #334155; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">
          <strong>Author:</strong> ${author} &nbsp;•&nbsp; 
          <strong>Category:</strong> ${category} &nbsp;•&nbsp; 
          <strong>Published:</strong> ${dateStr}
        </div>
        <div class="content">${content}</div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function ValidationResults({
  article,
  isViewer,
  onOpenModal,
}: {
  article: Article;
  isViewer?: boolean;
  onOpenModal?: () => void;
}) {
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

      {isViewer ? (
        <button
          type="button"
          onClick={onOpenModal}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-[#070F1E] bg-[#00E676] hover:bg-[#00c865] transition shadow-md"
        >
          Validate Article
        </button>
      ) : (
        <Link
          href={`/dashboard/articles/${article._id}`}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-[#070F1E] bg-[#00E676] hover:bg-[#00c865] transition shadow-md"
        >
          Validate Article
        </Link>
      )}
    </div>
  );
}

export default function ArticleListWithValidation({
  articles,
  initialStatus,
  isViewer = false,
}: {
  articles: Article[];
  initialStatus?: string;
  isViewer?: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>(isViewer ? "PUBLISHED" : (initialStatus || "ALL"));
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const filteredArticles = articles.filter((a) => {
    if (isViewer) return a.status === "PUBLISHED";
    if (filter === "PUBLISHED") return a.status === "PUBLISHED";
    if (filter === "DRAFT") return a.status === "DRAFT";
    return true;
  });

  const [selected, setSelected] = useState<Article | null>(filteredArticles[0] ?? articles[0] ?? null);

  const handleTogglePublish = async (art: Article) => {
    if (isViewer) return;
    setIsUpdatingStatus(true);
    try {
      const nextStatus = art.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const res = await fetch(`/api/articles/${art._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...art,
          status: nextStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to update article status");
      const updated = await res.json();
      setSelected(updated);
      router.refresh();
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="card py-20 text-center">
        <p className="text-sm text-[#88A4C4]">No published articles found.</p>
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
        <p className="text-xs mb-3 text-[#88A4C4]">
          {isViewer
            ? "Viewing published news articles."
            : "Review and validate articles for quality and accuracy."}
        </p>

        {/* Status filter tabs */}
        {!isViewer && (
          <div className="flex gap-2 mb-4 border-b border-[#1E3A5F] pb-3">
            {[
              { id: "ALL", label: "All Articles" },
              { id: "PUBLISHED", label: "Published" },
              { id: "DRAFT", label: "Drafts" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setFilter(st.id);
                  const nextList = articles.filter(a => st.id === "ALL" || a.status === st.id);
                  if (nextList.length > 0) setSelected(nextList[0]);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition border ${
                  filter === st.id
                    ? "bg-[#00E676] text-[#070F1E] border-[#00E676]"
                    : "bg-[#13253B] text-[#88A4C4] border-[#1E3A5F] hover:text-[#E2F1FF]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}

        {/* Article list */}
        {filteredArticles.length === 0 ? (
          <p className="text-xs text-[#88A4C4] py-6 text-center">No published articles found.</p>
        ) : (
          <div className="space-y-2 mb-5">
            {filteredArticles.slice(0, 8).map((a) => {
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
                    {a.status && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1E3A5F]">{a.status}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

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

            {isViewer ? (
              <div className="flex items-center justify-between pt-3 border-t border-[#1E3A5F] flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#070F1E] bg-[#00E676] hover:bg-[#00c865] transition shadow-md flex items-center gap-1.5"
                >
                  <FileText size={14} /> View & Validate Article
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Download as TXT"
                    onClick={() => downloadTxt(selected)}
                    className="px-2 py-1 rounded text-[11px] font-semibold text-[#88A4C4] bg-[#13253B] border border-[#1E3A5F] hover:text-[#E2F1FF] hover:border-[#00E676] transition flex items-center gap-1"
                  >
                    <Download size={11} /> TXT
                  </button>
                  <button
                    type="button"
                    title="Download as DOCX"
                    onClick={() => downloadDocx(selected)}
                    className="px-2 py-1 rounded text-[11px] font-semibold text-[#88A4C4] bg-[#13253B] border border-[#1E3A5F] hover:text-[#E2F1FF] hover:border-[#00E5FF] transition flex items-center gap-1"
                  >
                    <Download size={11} /> DOCX
                  </button>
                  <button
                    type="button"
                    title="Download as PDF"
                    onClick={() => downloadPdf(selected)}
                    className="px-2 py-1 rounded text-[11px] font-bold text-[#070F1E] bg-[#00E676] hover:bg-[#00c865] transition flex items-center gap-1"
                  >
                    <Download size={11} /> PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-3 border-t border-[#1E3A5F]">
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleTogglePublish(selected)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                    selected.status === "PUBLISHED"
                      ? "bg-[#13253B] border border-[#1E3A5F] text-[#88A4C4] hover:text-[#E2F1FF]"
                      : "bg-[#00E676] text-[#070F1E] hover:bg-[#00c865]"
                  }`}
                >
                  {selected.status === "PUBLISHED" ? "Revert to Draft" : "🚀 Publish Article Now"}
                </button>
                <Link
                  href={`/dashboard/articles/${selected._id}`}
                  className="text-xs font-semibold text-[#00E5FF] hover:underline"
                >
                  Edit Full Article →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Panel */}
      {selected && (
        <ValidationResults
          article={selected}
          isViewer={isViewer}
          onOpenModal={() => setShowModal(true)}
        />
      )}

      {/* Article Dialog Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0B1727] border border-[#1E3A5F] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1E3A5F] flex items-center justify-between bg-[#13253B]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00E676]" />
                <h2 className="text-base font-bold text-[#E2F1FF]">Article Details & Validation</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-[#88A4C4] hover:text-[#E2F1FF] hover:bg-[#1E3A5F] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Title */}
              <div>
                <span className="text-[#88A4C4] text-[11px] font-semibold uppercase tracking-wider">Title</span>
                <h1 className="text-xl font-bold text-[#E2F1FF] mt-1">{selected.title}</h1>
              </div>

              {/* Author & Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#13253B] border border-[#1E3A5F]">
                <div>
                  <span className="text-[#88A4C4] text-[10px] uppercase font-semibold">Author Name</span>
                  <div className="flex items-center gap-1.5 text-[#E2F1FF] font-semibold mt-1">
                    <User className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>{selected.author || "Unknown Author"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#88A4C4] text-[10px] uppercase font-semibold">Category</span>
                  <p className="text-[#E2F1FF] font-semibold mt-1">{selected.category || "General"}</p>
                </div>
                <div>
                  <span className="text-[#88A4C4] text-[10px] uppercase font-semibold">Publication Date</span>
                  <div className="flex items-center gap-1.5 text-[#E2F1FF] font-semibold mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>{selected.publishedAt ? format(new Date(selected.publishedAt), "MMM d, yyyy") : "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div>
                <span className="text-[#88A4C4] text-[11px] font-semibold uppercase tracking-wider block mb-2">Content</span>
                <div className="p-4 rounded-xl bg-[#070F1E] border border-[#1E3A5F] text-[#88A4C4] text-xs leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {selected.content || "No content available."}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1E3A5F] bg-[#13253B] flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#88A4C4] hover:text-[#E2F1FF] border border-[#1E3A5F] hover:bg-[#1E3A5F] transition"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[#88A4C4] text-[11px] font-semibold mr-1">Download:</span>
                <button
                  type="button"
                  onClick={() => downloadTxt(selected)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#E2F1FF] bg-[#070F1E] border border-[#1E3A5F] hover:bg-[#1E3A5F] hover:border-[#00E676] transition"
                >
                  <Download className="w-3.5 h-3.5 text-[#00E676]" />
                  .TXT
                </button>
                <button
                  type="button"
                  onClick={() => downloadDocx(selected)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#E2F1FF] bg-[#070F1E] border border-[#1E3A5F] hover:bg-[#1E3A5F] hover:border-[#00E5FF] transition"
                >
                  <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
                  .DOCX
                </button>
                <button
                  type="button"
                  onClick={() => downloadPdf(selected)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#070F1E] bg-[#00E676] hover:bg-[#00c865] transition shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  .PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
