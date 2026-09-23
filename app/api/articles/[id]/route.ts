import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { Article } from "@/lib/mongodb/models/Article";
import { articleSchema } from "@/lib/validators/article.validator";
import { requireRole } from "@/lib/auth/rbac";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const role = user?.publicMetadata?.role as string;

    await connectToDatabase();
    
    const resolvedParams = await params;
    const article = await Article.findById(resolvedParams.id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (role === "VIEWER" && article.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Forbidden: Viewers can only access published articles" }, { status: 403 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("GET /api/articles/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleOrError = await requireRole(["ADMIN", "EDITOR"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const body = await req.json();
    const validatedData = articleSchema.parse(body);

    await connectToDatabase();

    const resolvedParams = await params;
    const article = await Article.findByIdAndUpdate(
      resolvedParams.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error("PUT /api/articles/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleOrError = await requireRole(["ADMIN", "EDITOR"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    await connectToDatabase();

    const resolvedParams = await params;
    const article = await Article.findByIdAndDelete(resolvedParams.id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Article deleted" });
  } catch (error) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
