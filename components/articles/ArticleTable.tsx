"use client";

import Link from "next/link";
import { format } from "date-fns";

export default function ArticleTable({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="card py-10 text-center">
        <p className="text-sm text-[#88A4C4]">No articles found.</p>
        <Link href="/dashboard/articles/new" className="text-xs font-semibold text-[#00E5FF] hover:underline mt-2 inline-block">
          Create your first article
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Created At</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td className="font-semibold text-[#E2F1FF] max-w-xs truncate">
                {article.title}
              </td>
              <td>
                <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 rounded text-xs border border-[#00E5FF]/30 font-semibold">
                  {article.category}
                </span>
              </td>
              <td>
                <span className={`badge ${
                  article.status === 'PUBLISHED' ? 'badge-passed' :
                  article.status === 'DRAFT' ? 'badge-draft' :
                  'badge-ready'
                }`}>
                  {article.status}
                </span>
              </td>
              <td className="text-[#88A4C4] text-xs">
                {format(new Date(article.createdAt), "MMM d, yyyy")}
              </td>
              <td className="text-right">
                <Link 
                  href={`/dashboard/articles/${article._id}`}
                  className="text-xs font-semibold text-[#00E676] hover:underline"
                >
                  Edit / QA
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
