import { z } from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .max(150, "Title cannot exceed 150 characters."),
  content: z
    .string()
    .min(50, "Article content must be at least 50 characters long."),
  category: z
    .string()
    .min(2, "Category is required."),
  author: z
    .string()
    .optional(),
  status: z
    .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .default("DRAFT"),
  tags: z
    .array(z.string())
    .default([]),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

export function validateArticleWordCount(content: string): number {
  return content.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

export function extractUrls(content: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.match(urlRegex) || [];
}
