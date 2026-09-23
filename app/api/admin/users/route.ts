import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { hasAccess } from "@/lib/auth/rbac";

export async function GET() {
  try {
    const user = await currentUser();
    const role = user?.publicMetadata?.role as string;
    
    // Only Admin can fetch the full user list
    if (!hasAccess(role, "SETTINGS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clerkClient();
    const userList = await client.users.getUserList();

    // Map to a safer, smaller object
    const users = userList.data.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.emailAddresses[0]?.emailAddress,
      role: u.publicMetadata?.role || "NONE",
      createdAt: u.createdAt,
    }));

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
