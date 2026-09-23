import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { Article } from "@/lib/mongodb/models/Article";
import { articleSchema } from "@/lib/validators/article.validator";
import { requireRole } from "@/lib/auth/rbac";

// Function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const role = user?.publicMetadata?.role as string;
    const isViewer = role === "VIEWER";

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const query: any = {};
    if (isViewer) {
      query.status = "PUBLISHED";
    } else {
      const statusParam = searchParams.get("status");
      if (statusParam) {
        query.status = statusParam;
      }
    }
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Article.countDocuments(query);

    return NextResponse.json({
      data: articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "EDITOR"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { userId } = await auth();
    const body = await req.json();
    
    // Validate request body
    const validatedData = articleSchema.parse(body);

    await connectToDatabase();

    // Check for duplicate slug
    const slug = generateSlug(validatedData.title);
    const existing = await Article.findOne({ slug });
    
    if (existing) {
      return NextResponse.json({ error: "An article with a similar title already exists." }, { status: 409 });
    }

    const newArticle = new Article({
      ...validatedData,
      slug,
      createdBy: userId,
    });

    await newArticle.save();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/articles error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
