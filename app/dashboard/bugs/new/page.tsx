import BugForm from "@/components/bugs/BugForm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewBugPage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  
  if (role === "VIEWER") {
    redirect("/dashboard/bugs");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report a Bug</h1>
        <p className="text-sm text-gray-500">Provide detailed steps to reproduce the issue.</p>
      </div>
      
      <BugForm />
    </div>
  );
}
