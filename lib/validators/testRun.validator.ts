import { z } from "zod";

export const testRunSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(200, "Title is too long"),
  description: z.string().optional(),
  testCases: z.array(z.string()).min(1, "At least one test case must be selected."),
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]).default("PENDING"),
});

export const updateTestRunSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
  testCases: z.array(z.string()).optional(),
  passedTests: z.number().min(0).optional(),
  failedTests: z.number().min(0).optional(),
  blockedTests: z.number().min(0).optional(),
  executionTimeMs: z.number().min(0).optional(),
});

export type TestRunFormValues = z.infer<typeof testRunSchema>;
