import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "EDITOR" | "QA" | "VIEWER";

export type Resource =
  | "ARTICLES"
  | "TEST_CASES"
  | "BUGS"
  | "REPORTS"
  | "AI_TESTING"
  | "API_TESTING"
  | "UI_TESTING"
  | "SETTINGS";

// ─── Route-level access (read access = can visit the page) ────────────────────

const ROLE_PERMISSIONS: Record<UserRole, Resource[]> = {
  ADMIN: [
    "ARTICLES",
    "TEST_CASES",
    "BUGS",
    "REPORTS",
    "AI_TESTING",
    "API_TESTING",
    "UI_TESTING",
    "SETTINGS",
  ],
  EDITOR: ["ARTICLES", "AI_TESTING", "REPORTS"],
  QA: [
    "TEST_CASES",
    "BUGS",
    "REPORTS",
    "AI_TESTING",
    "API_TESTING",
    "UI_TESTING",
  ],
  // VIEWER has read access to these pages; write is blocked at API layer
  VIEWER: ["REPORTS", "TEST_CASES", "BUGS", "ARTICLES"],
};

// ─── Write-level access (who can mutate a resource) ───────────────────────────

const ROLE_WRITE_PERMISSIONS: Record<UserRole, Resource[]> = {
  ADMIN: [
    "ARTICLES",
    "TEST_CASES",
    "REPORTS",
    "AI_TESTING",
    "API_TESTING",
    "UI_TESTING",
    "SETTINGS",
  ],
  EDITOR: ["ARTICLES", "AI_TESTING"],
  QA: ["TEST_CASES", "BUGS", "REPORTS", "AI_TESTING", "API_TESTING", "UI_TESTING"],
  VIEWER: [], // read-only everywhere
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Helper to normalize role strings */
function normalizeRole(role: string | null | undefined): UserRole | null {
  if (!role) return null;
  if (role === "QA_ENGINEER") return "QA";
  return role as UserRole;
}

/** Returns true if the role has read (page) access to the resource. */
export function hasAccess(
  role: string | null | undefined,
  resource: Resource
): boolean {
  const norm = normalizeRole(role);
  if (!norm) return false;
  const permissions = ROLE_PERMISSIONS[norm];
  return permissions ? permissions.includes(resource) : false;
}

/** Returns true if the role can perform write operations on the resource. */
export function canWrite(
  role: string | null | undefined,
  resource: Resource
): boolean {
  const norm = normalizeRole(role);
  if (!norm) return false;
  const permissions = ROLE_WRITE_PERMISSIONS[norm];
  return permissions ? permissions.includes(resource) : false;
}

// ─── Server Component guard ───────────────────────────────────────────────────

/**
 * Use in layout.tsx files to protect entire route segments.
 * Redirects to /dashboard if the user lacks read access.
 */
export async function enforceAccess(resource: Resource) {
  const user = await currentUser();
  const rawRole = user?.publicMetadata?.role as string;
  const role = normalizeRole(rawRole);

  if (!hasAccess(role, resource)) {
    if (role === "EDITOR") {
      redirect("/dashboard/articles");
    }
    redirect("/dashboard");
  }

  return role as UserRole;
}

// ─── API Route guard ──────────────────────────────────────────────────────────

/**
 * Use at the top of mutating API route handlers (POST, PUT, DELETE).
 * Returns the user's role if they are in `allowedRoles`, or
 * returns a NextResponse with the appropriate error status.
 *
 * @example
 * const roleOrError = await requireRole(["ADMIN", "QA"]);
 * if (roleOrError instanceof NextResponse) return roleOrError;
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<UserRole | NextResponse> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Clerk stores publicMetadata under sessionClaims or currentUser
  const user = await currentUser();
  const rawRole = (sessionClaims?.metadata as any)?.role || (user?.publicMetadata?.role as string);
  const role = normalizeRole(rawRole);

  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json(
      { error: "Forbidden: insufficient role" },
      { status: 403 }
    );
  }

  return role;
}
