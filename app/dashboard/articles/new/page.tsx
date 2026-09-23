import ArticleForm from "@/components/articles/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
        <p className="text-sm text-gray-500">Fill out the details to submit a new article for QA.</p>
      </div>
      
      <ArticleForm />
    </div>
  );
}
