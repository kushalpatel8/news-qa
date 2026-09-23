import ArticleForm from "@/components/articles/ArticleForm";
import ArticleValidation from "@/components/articles/ArticleValidation";
import { notFound } from "next/navigation";

import connectToDatabase from "@/lib/mongodb/connection";
import { Article } from "@/lib/mongodb/models/Article";

async function getArticle(id: string) {
  try {
    await connectToDatabase();
    const article = await Article.findById(id).lean();
    if (!article) return null;
    return JSON.parse(JSON.stringify(article));
  } catch {
    return null;
  }
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QA / Edit Article</h1>
        <p className="text-sm text-gray-500">Review, QA test, and edit the article content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleForm initialData={article} />
        </div>
        <div className="lg:col-span-1">
          {/* We will pass the data from DB, but for real-time validation, ArticleForm needs to share state. 
              For now we validate the static DB version to show concept. */}
          <ArticleValidation 
            title={article.title} 
            content={article.content} 
            category={article.category} 
          />
        </div>
      </div>
    </div>
  );
}
