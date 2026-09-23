import { enforceAccess } from "@/lib/auth/rbac";

export default async function aiTestingLayout({ children }: { children: React.ReactNode }) {
  await enforceAccess("AI_TESTING");
  return <>{children}</>;
}
