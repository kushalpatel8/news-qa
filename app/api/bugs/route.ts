import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { Bug } from "@/lib/mongodb/models/Bug";
import { bugSchema } from "@/lib/validators/bug.validator";
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
    const severity = searchParams.get("severity");

    const query: any = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    await connectToDatabase();
    
    const bugs = await Bug.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Bug.countDocuments(query);

    return NextResponse.json({
      data: bugs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET /api/bugs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { userId } = await auth();
    const body = await req.json();
    const validatedData = bugSchema.parse(body);

    await connectToDatabase();

    const newBug = new Bug({
      ...validatedData,
      createdBy: userId,
    });

    await newBug.save();

    return NextResponse.json(newBug, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/bugs error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
