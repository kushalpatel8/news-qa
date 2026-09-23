import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { hasAccess } from "@/lib/auth/rbac";

export async function DELETE(req: Request) {
  try {
    const user = await currentUser();
    const currentRole = user?.publicMetadata?.role as string;
    
    // Only Admin can delete users
    if (!hasAccess(currentRole, "SETTINGS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent self-deletion via this route as a safeguard
    if (userId === user?.id) {
      return NextResponse.json({ error: "Cannot delete your own admin account" }, { status: 400 });
    }
    
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
