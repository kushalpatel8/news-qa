import TestCaseForm from "@/components/testing/TestCaseForm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewTestCasePage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  
  if (role !== "QA") {
    redirect("/dashboard/test-cases");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#F8FAFC]">Create Test Case</h1>
        <p className="text-xs text-[#CBD5E1]">Define manual or automated testing requirements.</p>
      </div>
      
      <TestCaseForm />
    </div>
  );
}
