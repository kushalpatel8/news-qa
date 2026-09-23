import { enforceAccess } from "@/lib/auth/rbac";

export default async function testRunsLayout({ children }: { children: React.ReactNode }) {
  await enforceAccess("TEST_CASES");
  return <>{children}</>;
}
