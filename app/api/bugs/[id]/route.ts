import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { Bug } from "@/lib/mongodb/models/Bug";
import { bugSchema } from "@/lib/validators/bug.validator";
import { requireRole } from "@/lib/auth/rbac";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const resolvedParams = await params;
    const bug = await Bug.findById(resolvedParams.id);

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 });
    }

    return NextResponse.json(bug);
  } catch (error) {
    console.error("GET /api/bugs/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleOrError = await requireRole(["QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const body = await req.json();
    const validatedData = bugSchema.parse(body);

    await connectToDatabase();

    const resolvedParams = await params;
    const bug = await Bug.findByIdAndUpdate(
      resolvedParams.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 });
    }

    return NextResponse.json(bug);
  } catch (error: any) {
    console.error("PUT /api/bugs/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleOrError = await requireRole(["QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    await connectToDatabase();

    const resolvedParams = await params;
    const bug = await Bug.findByIdAndDelete(resolvedParams.id);

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Bug deleted" });
  } catch (error) {
    console.error("DELETE /api/bugs/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
