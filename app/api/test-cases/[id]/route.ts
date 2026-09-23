import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";
import { testCaseSchema } from "@/lib/validators/testCase.validator";
import { requireRole } from "@/lib/auth/rbac";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const resolvedParams = await params;
    const testCase = await TestCase.findById(resolvedParams.id);

    if (!testCase) {
      return NextResponse.json({ error: "Test case not found" }, { status: 404 });
    }

    return NextResponse.json(testCase);
  } catch (error) {
    console.error("GET /api/test-cases/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleOrError = await requireRole(["QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const body = await req.json();
    const validatedData = testCaseSchema.parse(body);

    await connectToDatabase();

    const resolvedParams = await params;
    const testCase = await TestCase.findByIdAndUpdate(
      resolvedParams.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!testCase) {
      return NextResponse.json({ error: "Test case not found" }, { status: 404 });
    }

    return NextResponse.json(testCase);
  } catch (error: any) {
    console.error("PUT /api/test-cases/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleOrError = await requireRole(["QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const body = await req.json();

    await connectToDatabase();

    const resolvedParams = await params;
    const testCase = await TestCase.findByIdAndUpdate(
      resolvedParams.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!testCase) {
      return NextResponse.json({ error: "Test case not found" }, { status: 404 });
    }

    return NextResponse.json(testCase);
  } catch (error: any) {
    console.error("PATCH /api/test-cases/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleOrError = await requireRole(["QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    await connectToDatabase();

    const resolvedParams = await params;
    const testCase = await TestCase.findByIdAndDelete(resolvedParams.id);

    if (!testCase) {
      return NextResponse.json({ error: "Test case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Test case deleted" });
  } catch (error) {
    console.error("DELETE /api/test-cases/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
