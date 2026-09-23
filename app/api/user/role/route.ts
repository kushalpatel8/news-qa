import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !["ADMIN", "EDITOR", "QA", "VIEWER"].includes(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
    }

    // Update the user's public metadata securely on the Clerk backend
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    return NextResponse.json({ success: true, role });
  } catch (error: any) {
    console.error("Error setting role:", error);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}
