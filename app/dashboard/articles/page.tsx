import Link from "next/link";
import ArticleListWithValidation from "@/components/articles/ArticleListWithValidation";
import { currentUser } from "@clerk/nextjs/server";
import RoleGate from "@/components/ui/RoleGate";

import connectToDatabase from "@/lib/mongodb/connection";
import { Article } from "@/lib/mongodb/models/Article";

async function getArticles() {
  try {
    await connectToDatabase();
    const articles = await Article.find().sort({ createdAt: -1 }).lean();
    return { data: JSON.parse(JSON.stringify(articles)) };
  } catch {
    return { data: [] };
  }
}

export default async function ArticlesPage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  const { data: articles } = await getArticles();

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Article QA</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Review and validate articles for quality and accuracy.
          </p>
        </div>
        <RoleGate roles={["ADMIN", "EDITOR"]}>
          <Link
            href="/dashboard/articles/new"
            className="text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            style={{ background: "var(--accent)" }}
          >
            + New Article
          </Link>
        </RoleGate>
      </div>

      <ArticleListWithValidation articles={articles || []} />
    </div>
  );
}
