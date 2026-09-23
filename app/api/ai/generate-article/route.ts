import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGroqModel, extractJSON } from "@/lib/ai/groq";
import { articleGenerationPrompt } from "@/lib/ai/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "EDITOR"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = getGroqModel();
    const parser = new StringOutputParser();

    const chain = articleGenerationPrompt.pipe(model).pipe(parser);
    const response = await chain.invoke({ prompt });

    const cleanJson = extractJSON(response);

    return NextResponse.json(cleanJson);
  } catch (error: any) {
    console.error("AI article generation error:", error);
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 });
  }
}
