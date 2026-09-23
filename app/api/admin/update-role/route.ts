import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { hasAccess } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const currentRole = user?.publicMetadata?.role as string;
    
    // Only Admin can update roles
    if (!hasAccess(currentRole, "SETTINGS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, role } = await req.json();
    
    if (!userId || !role) {
      return NextResponse.json({ error: "User ID and Role are required" }, { status: 400 });
    }

    // Optional: Prevent Admins from downgrading themselves directly to avoid lockout, 
    // but we'll allow it for now if they have another admin account.
    
    const client = await clerkClient();
    
    // Get the target user's current metadata to preserve other fields if any exist
    const targetUser = await client.users.getUser(userId);
    const existingMetadata = targetUser.publicMetadata;

    await client.users.updateUser(userId, {
      publicMetadata: {
        ...existingMetadata,
        role: role,
      }
    });

    return NextResponse.json({ success: true, role });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
