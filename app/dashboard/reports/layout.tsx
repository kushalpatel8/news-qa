import { enforceAccess } from "@/lib/auth/rbac";

export default async function reportsLayout({ children }: { children: React.ReactNode }) {
  await enforceAccess("REPORTS");
  return <>{children}</>;
}
