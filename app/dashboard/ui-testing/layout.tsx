import { enforceAccess } from "@/lib/auth/rbac";

export default async function uiTestingLayout({ children }: { children: React.ReactNode }) {
  await enforceAccess("UI_TESTING");
  return <>{children}</>;
}
