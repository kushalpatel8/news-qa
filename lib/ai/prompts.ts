import { PromptTemplate } from "@langchain/core/prompts";

export const testCaseGenerationPrompt = PromptTemplate.fromTemplate(`
You are an expert QA Engineer. Generate {count} test cases based on the following requirement or article.

Requirement:
{requirement}

Respond with a JSON array of test case objects. Do not use Markdown formatting for the JSON output. Ensure it is parseable by JSON.parse().
Each object must match this schema:
{{
  "title": "String (min 5, max 100)",
  "description": "String",
  "module": "String",
  "preconditions": "String",
  "steps": ["Step 1", "Step 2"],
  "expectedResult": "String",
  "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}}
`);

export const articleAnalysisPrompt = PromptTemplate.fromTemplate(`
You are an expert News Editor and QA Tester. Analyze the following article for issues.

Title: {title}
Category: {category}
Content: {content}

Respond with a JSON object. Do not use Markdown formatting for the JSON output. Ensure it is parseable by JSON.parse().
Object schema:
{{
  "issuesFound": ["Issue 1", "Issue 2"],
  "overallQualityScore": "Number (0-100)",
  "suggestions": ["Suggestion 1"],
  "isPublishReady": "Boolean"
}}
`);

export const articleGenerationPrompt = PromptTemplate.fromTemplate(`
You are an expert News Editor. Write a detailed, professional news article based on the following prompt.

Prompt: {prompt}

Respond with a JSON object. Do not use Markdown formatting for the JSON output. Ensure it is parseable by JSON.parse().
Object schema:
{{
  "title": "String (engaging headline)",
  "content": "String (full article body with paragraphs separated by newlines)",
  "category": "String"
}}
`);

export const articleFactCheckPrompt = PromptTemplate.fromTemplate(`
You are a strict Fact Checker and AI Detection Engine (News Guard AI). Analyze the following article for factual inaccuracies and calculate the probability that the content was AI-generated.

Title: {title}
Content: {content}

Respond with a JSON object. Do not use Markdown formatting for the JSON output. Ensure it is parseable by JSON.parse().
Object schema:
{{
  "aiProbabilityScore": "Number (0-100, where 100 means definitely AI)",
  "factualInaccuracies": [
    {{
      "claim": "String (the specific claim made in the article)",
      "correction": "String (the correct fact or context)",
      "severity": "LOW" | "MEDIUM" | "HIGH"
    }}
  ],
  "isFactuallySound": "Boolean"
}}
`);
