import TestCaseForm from "@/components/testing/TestCaseForm";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";

async function getTestCase(id: string) {
  try {
    await connectToDatabase();
    const testCase = await TestCase.findById(id).lean();
    if (!testCase) return null;
    return JSON.parse(JSON.stringify(testCase));
  } catch {
    return null;
  }
}

export default async function EditTestCasePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;

  // Only QA can edit test cases
  if (role !== "QA") {
    redirect("/dashboard/test-cases");
  }

  const resolvedParams = await params;
  const testCase = await getTestCase(resolvedParams.id);

  if (!testCase) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#F8FAFC]">Edit Test Case</h1>
        <p className="text-xs text-[#CBD5E1]">Update testing steps, expectations, and metadata.</p>
      </div>

      <TestCaseForm initialData={testCase} />
    </div>
  );
}
