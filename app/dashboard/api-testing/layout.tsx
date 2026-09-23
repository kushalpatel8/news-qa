import { enforceAccess } from "@/lib/auth/rbac";

export default async function apiTestingLayout({ children }: { children: React.ReactNode }) {
  await enforceAccess("API_TESTING");
  return <>{children}</>;
}
