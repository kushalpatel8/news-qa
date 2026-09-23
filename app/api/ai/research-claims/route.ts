import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { searchTavily } from "@/lib/ai/tavily";

import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "EDITOR"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { claim } = await req.json();

    if (!claim) {
      return NextResponse.json({ error: "Claim is required" }, { status: 400 });
    }

    const results = await searchTavily(claim);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Tavily research error:", error);
    return NextResponse.json({ error: "Failed to research claim" }, { status: 500 });
  }
}
