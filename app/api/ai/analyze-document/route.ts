import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";
import { getGroqModel, extractJSON } from "@/lib/ai/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import mammoth from "mammoth";

export const dynamic = "force-dynamic";

export const documentAnalysisPrompt = PromptTemplate.fromTemplate(`
You are an expert Chief Editor and Copywriter for a premier news publication.
Analyze the following article text extracted from a document. Perform a thorough review for grammatical mistakes, spelling errors, tone, readability, structural quality, and journalistic style.

Article Text:
{text}

Respond with a JSON object ONLY. Do not wrap in markdown code blocks or extra text.
Ensure it is parseable by JSON.parse().
Object schema:
{{
  "titleSuggestion": "String (Suggested punchy headline for this article)",
  "categorySuggestion": "String (e.g. Technology, Politics, Business, Science, World)",
  "overallScore": 85,
  "metrics": {{
    "readability": "String (e.g. Grade 10 - Clear & Accessible)",
    "tone": "String (e.g. Objective, Professional, Informative)",
    "clarity": "String (e.g. High / Clear)",
    "structure": "String (e.g. Well-organized lead paragraph and coherent flow)"
  }},
  "grammarMistakes": [
    {{
      "original": "String (exact sentence or phrase with error)",
      "correction": "String (corrected sentence or phrase)",
      "type": "Grammar / Spelling / Punctuation / Style",
      "explanation": "String (brief explanation of the mistake)"
    }}
  ],
  "suggestions": [
    "String (Actionable suggestion 1 to improve impact, clarity, or flow)",
    "String (Actionable suggestion 2)"
  ],
  "polishedContent": "String (Complete corrected and polished article text with proper line breaks)"
}}
`);

export async function POST(req: Request) {
  try {
    const roleOrError = await requireRole(["ADMIN", "EDITOR"]);
    if (roleOrError instanceof NextResponse) return roleOrError;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const manualText = formData.get("text") as string | null;

    let extractedText = "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
        const pdfParseModule: any = await import("pdf-parse");
        const pdfParseFn = pdfParseModule.default || pdfParseModule;
        const parsedPdf = await pdfParseFn(buffer);
        extractedText = parsedPdf.text || "";
      } else if (
        fileName.endsWith(".docx") ||
        file.type.includes("wordprocessingml")
      ) {
        const parsedDocx = await mammoth.extractRawText({ buffer });
        extractedText = parsedDocx.value || "";
      } else {
        extractedText = await file.text();
      }
    } else if (manualText) {
      extractedText = manualText;
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from document or no content provided." },
        { status: 400 }
      );
    }

    // Truncate extremely large texts to prevent prompt tokens overflow
    const maxChars = 8000;
    const textToAnalyze = extractedText.slice(0, maxChars);

    const model = getGroqModel();
    const parser = new StringOutputParser();

    const chain = documentAnalysisPrompt.pipe(model).pipe(parser);
    const rawResponse = await chain.invoke({ text: textToAnalyze });
    const cleanJson = extractJSON(rawResponse);

    return NextResponse.json({
      extractedText,
      analysis: cleanJson,
    });
  } catch (error: any) {
    console.error("Document analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze document quality" },
      { status: 500 }
    );
  }
}
