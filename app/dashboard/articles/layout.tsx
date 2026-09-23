import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/auth/rbac";

export default async function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const role = (user?.publicMetadata?.role as string) || "GUEST";

  // Block QA and non-permitted roles from accessing the Articles section
  if (!hasAccess(role, "ARTICLES")) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
