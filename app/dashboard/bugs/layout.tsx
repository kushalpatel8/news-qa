import { enforceAccess } from "@/lib/auth/rbac";

export default async function bugsLayout({ children }: { children: React.ReactNode }) {
  await enforceAccess("BUGS");
  return <>{children}</>;
}
