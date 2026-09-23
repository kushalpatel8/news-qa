import { auth, currentUser } from "@clerk/nextjs/server";
import { Role } from "./roles";
import { hasPermission } from "./permissions";

export async function getCurrentRole(): Promise<Role | undefined> {
  const user = await currentUser();
  if (!user) return undefined;
  
  // Custom role is stored in Clerk's publicMetadata
  const role = user.publicMetadata?.role as Role | undefined;
  
  // Default to QA_ENGINEER if not set
  return role || "QA_ENGINEER";
}

export async function checkPermission(allowedRoles: Role[]) {
  const role = await getCurrentRole();
  const allowed = hasPermission(role, allowedRoles);
  
  if (!allowed) {
    throw new Error("Unauthorized: Insufficient permissions");
  }
}

export async function getAuthSession() {
  const session = await auth();
  return session;
}
