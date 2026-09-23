import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestRun } from "@/lib/mongodb/models/TestRun";
import "@/lib/mongodb/models/TestCase";
import { updateTestRunSchema } from "@/lib/validators/testRun.validator";
import { requireRole } from "@/lib/auth/rbac";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const testRun = await TestRun.findById(id).populate("testCases");
    if (!testRun) {
      return NextResponse.json({ error: "Test run not found" }, { status: 404 });
    }

    return NextResponse.json(testRun);
  } catch (error) {
    console.error("GET /api/test-runs/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const roleOrError = await requireRole(["ADMIN", "QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateTestRunSchema.parse(body);

    await connectToDatabase();

    const updatedRun = await TestRun.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).populate("testCases");

    if (!updatedRun) {
      return NextResponse.json({ error: "Test run not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRun);
  } catch (error: any) {
    console.error("PATCH /api/test-runs/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const roleOrError = await requireRole(["ADMIN", "QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { id } = await params;
    await connectToDatabase();

    const deletedRun = await TestRun.findByIdAndDelete(id);
    if (!deletedRun) {
      return NextResponse.json({ error: "Test run not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Test run deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/test-runs/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
