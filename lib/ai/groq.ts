import { ChatGroq } from "@langchain/groq";

export function getGroqModel() {
  return new ChatGroq({
    model: "openai/gpt-oss-20b",
    maxTokens: 2048,
    maxRetries: 0,
    apiKey: process.env.GROQ_API_KEY,
  });
}

export function extractJSON(response: string) {
  try {
    const match = response.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse JSON from AI response:", response);
    throw new Error("Failed to parse JSON response from AI");
  }
}
