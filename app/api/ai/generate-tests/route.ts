import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGroqModel, extractJSON } from "@/lib/ai/groq";
import { testCaseGenerationPrompt } from "@/lib/ai/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "QA"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const { requirement, count = 3 } = await req.json();

    if (!requirement) {
      return NextResponse.json({ error: "Requirement is required" }, { status: 400 });
    }

    const model = getGroqModel();
    const parser = new StringOutputParser();

    const chain = testCaseGenerationPrompt.pipe(model).pipe(parser);
    const response = await chain.invoke({ requirement, count: count.toString() });

    const cleanJson = extractJSON(response);
    
    return NextResponse.json(cleanJson);
  } catch (error: any) {
    console.error("AI test generation error:", error);
    return NextResponse.json({ error: "Failed to generate test cases" }, { status: 500 });
  }
}
