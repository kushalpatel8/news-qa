import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGroqModel, extractJSON } from "@/lib/ai/groq";
import { articleAnalysisPrompt } from "@/lib/ai/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "EDITOR"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { title, category, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const model = getGroqModel();
    const parser = new StringOutputParser();

    const chain = articleAnalysisPrompt.pipe(model).pipe(parser);
    const response = await chain.invoke({ title, category, content });

    const cleanJson = extractJSON(response);
    
    return NextResponse.json(cleanJson);
  } catch (error: any) {
    console.error("AI article analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze article" }, { status: 500 });
  }
}
