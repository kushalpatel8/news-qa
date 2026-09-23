import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestCase } from "@/lib/mongodb/models/TestCase";
import { testCaseSchema } from "@/lib/validators/testCase.validator";
import { requireRole } from "@/lib/auth/rbac";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Optional filters
    const module = searchParams.get("module");
    const status = searchParams.get("status");

    const query: any = {};
    if (module) query.module = module;
    if (status) query.status = status;

    await connectToDatabase();
    
    const testCases = await TestCase.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await TestCase.countDocuments(query);

    return NextResponse.json({
      data: testCases,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET /api/test-cases error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { userId } = await auth();
    const body = await req.json();
    const validatedData = testCaseSchema.parse(body);

    await connectToDatabase();

    const newTestCase = new TestCase({
      ...validatedData,
      createdBy: userId,
    });

    await newTestCase.save();

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/test-cases error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
