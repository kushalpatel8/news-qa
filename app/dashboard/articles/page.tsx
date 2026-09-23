import Link from "next/link";
import ArticleListWithValidation from "@/components/articles/ArticleListWithValidation";
import { currentUser } from "@clerk/nextjs/server";
import RoleGate from "@/components/ui/RoleGate";

import connectToDatabase from "@/lib/mongodb/connection";
import { Article } from "@/lib/mongodb/models/Article";

async function getArticles(statusFilter?: string, isViewer?: boolean) {
  try {
    await connectToDatabase();
    let query: any = {};
    if (isViewer) {
      query.status = "PUBLISHED";
    } else {
      const validStatus = statusFilter && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(statusFilter)
        ? (statusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED")
        : undefined;
      if (validStatus) {
        query.status = validStatus;
      }
    }
    const articles = await Article.find(query).sort({ createdAt: -1 }).lean();
    return { data: JSON.parse(JSON.stringify(articles)) };
  } catch {
    return { data: [] };
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params?.status?.toUpperCase();

  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  const isViewer = role === "VIEWER";

  const effectiveStatusFilter = isViewer ? "PUBLISHED" : statusFilter;
  const { data: articles } = await getArticles(effectiveStatusFilter, isViewer);

  const titleText = isViewer || statusFilter === "PUBLISHED"
    ? "Published Articles"
    : statusFilter === "DRAFT"
    ? "Draft Articles"
    : "Article QA";

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#E2F1FF]">{titleText}</h1>
          <p className="text-xs mt-0.5 text-[#88A4C4]">
            {isViewer
              ? "Viewing published articles."
              : statusFilter
              ? `Viewing all ${statusFilter.toLowerCase()} articles for editorial QA.`
              : "Review and validate articles for quality and accuracy."}
          </p>
        </div>
        <RoleGate roles={["ADMIN", "EDITOR"]}>
          <Link
            href="/dashboard/articles/new"
            className="text-[#070F1E] text-xs font-bold px-4 py-2 rounded-lg bg-[#00E676] hover:bg-[#00c865] transition shadow"
          >
            + New Article
          </Link>
        </RoleGate>
      </div>

      <ArticleListWithValidation
        articles={articles || []}
        initialStatus={effectiveStatusFilter}
        isViewer={isViewer}
      />
    </div>
  );
}
