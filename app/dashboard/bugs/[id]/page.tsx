import BugForm from "@/components/bugs/BugForm";
import { notFound } from "next/navigation";

async function getBug(id: string) {
  const res = await fetch(`http://localhost:3000/api/bugs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditBugPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const bug = await getBug(resolvedParams.id);

  if (!bug) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Bug</h1>
        <p className="text-sm text-gray-500">Update defect details, status, or severity.</p>
      </div>

      <BugForm initialData={bug} />
    </div>
  );
}
