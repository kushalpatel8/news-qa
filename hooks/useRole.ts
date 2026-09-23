"use client";

import { useUser } from "@clerk/nextjs";
import type { UserRole, Resource } from "@/lib/auth/rbac";

const ROLE_WRITE_PERMISSIONS: Record<UserRole, Resource[]> = {
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
  EDITOR: ["ARTICLES"],
  QA: ["TEST_CASES", "BUGS", "REPORTS", "AI_TESTING", "API_TESTING", "UI_TESTING"],
  VIEWER: [],
};

export function useRole() {
  const { user, isLoaded } = useUser();
  const role = (user?.publicMetadata?.role as UserRole) ?? null;

  const isAdmin = role === "ADMIN";
  const isQA = role === "QA";
  const isEditor = role === "EDITOR";
  const isViewer = role === "VIEWER";

  function canWrite(resource: Resource): boolean {
    if (!role) return false;
    const permissions = ROLE_WRITE_PERMISSIONS[role];
    return permissions ? permissions.includes(resource) : false;
  }

  return { role, isLoaded, isAdmin, isQA, isEditor, isViewer, canWrite };
}
