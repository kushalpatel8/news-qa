import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const cookieStore = await cookies();
    const pendingRoleCookie = cookieStore.get("pending_role");
    
    if (!pendingRoleCookie || !pendingRoleCookie.value) {
      // If there's no cookie, fallback to standard onboarding if they still have no role
      return NextResponse.redirect(new URL("/role-select", req.url));
    }

    const role = pendingRoleCookie.value;

    if (!["ADMIN", "EDITOR", "QA", "VIEWER"].includes(role)) {
      return NextResponse.redirect(new URL("/role-select", req.url));
    }

    if (role === "ADMIN") {
      const adminTokenCookie = cookieStore.get("admin_token");
      if (!adminTokenCookie || adminTokenCookie.value !== process.env.ADMIN_TOKEN) {
        return NextResponse.redirect(new URL("/role-select", req.url));
      }
    }

    // Update Clerk Metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    // Create a response that redirects to dashboard and deletes the cookie
    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.delete("pending_role");
    if (role === "ADMIN") {
      response.cookies.delete("admin_token");
    }

    return response;
  } catch (error: any) {
    console.error("Error applying pending role:", error);
    return NextResponse.redirect(new URL("/role-select", req.url));
  }
}
