"use client";

import { useRole } from "@/hooks/useRole";
import type { UserRole } from "@/lib/auth/rbac";

interface RoleGateProps {
  /** The component tree to conditionally render */
  children: React.ReactNode;
  /** Roles that are allowed to see the children */
  roles: UserRole[];
  /** Optional fallback to render when the role doesn't match */
  fallback?: React.ReactNode;
}

/**
 * Renders children only when the current user's role is in `roles`.
 * Use to hide create/edit/delete buttons from unauthorised roles.
 *
 * @example
 * <RoleGate roles={["ADMIN", "QA"]}>
 *   <Link href="/dashboard/test-cases/new">+ Create</Link>
 * </RoleGate>
 */
export default function RoleGate({ children, roles, fallback = null }: RoleGateProps) {
  const { role, isLoaded } = useRole();

  // Avoid flash: render nothing until Clerk has resolved the session
  if (!isLoaded) return null;

  if (!role || !roles.includes(role)) return <>{fallback}</>;

  return <>{children}</>;
}
