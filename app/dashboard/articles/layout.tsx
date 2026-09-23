import { enforceAccess } from "@/lib/auth/rbac";

export default async function articlesLayout({ children }: { children: React.ReactNode }) {
  await enforceAccess("ARTICLES");
  return <>{children}</>;
}
