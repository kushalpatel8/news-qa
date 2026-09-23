import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { TestRun } from "@/lib/mongodb/models/TestRun";
// Register TestCase model so populate("testCases") works without MissingSchemaError
import "@/lib/mongodb/models/TestCase";
import { testRunSchema } from "@/lib/validators/testRun.validator";
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

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    await connectToDatabase();

    const testRuns = await TestRun.find(query)
      .populate("testCases")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TestRun.countDocuments(query);

    return NextResponse.json({
      data: testRuns,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/test-runs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { userId } = await auth();
    const body = await req.json();
    const validatedData = testRunSchema.parse(body);

    await connectToDatabase();

    const newTestRun = new TestRun({
      ...validatedData,
      totalTests: validatedData.testCases.length,
      passedTests: 0,
      failedTests: 0,
      blockedTests: 0,
      createdBy: userId,
    });

    await newTestRun.save();

    return NextResponse.json(newTestRun, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/test-runs error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
