import BugForm from "@/components/bugs/BugForm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

import connectToDatabase from "@/lib/mongodb/connection";
import { Bug } from "@/lib/mongodb/models/Bug";

async function getBug(id: string) {
  try {
    await connectToDatabase();
    const bug = await Bug.findById(id).lean();
    if (!bug) return null;
    return JSON.parse(JSON.stringify(bug));
  } catch {
    return null;
  }
}

export default async function EditBugPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  const rawRole = (user?.publicMetadata?.role as string) || "GUEST";
  const isQA = rawRole === "QA" || rawRole === "QA_ENGINEER";

  if (!isQA) {
    redirect("/dashboard/bugs");
  }

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
