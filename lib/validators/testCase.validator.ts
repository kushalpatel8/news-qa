import { z } from "zod";

export const testCaseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(200, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters."),
  module: z.string().min(2, "Module is required."),
  preconditions: z.string().optional(),
  steps: z.array(z.string().min(1, "Step cannot be empty.")).min(1, "At least one test step is required."),
  expectedResult: z.string().min(5, "Expected result must be at least 5 characters."),
  actualResult: z.string().optional(),
  status: z.enum(["DRAFT", "READY", "PASSED", "FAILED", "BLOCKED"]).default("DRAFT"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

export type TestCaseFormValues = z.infer<typeof testCaseSchema>;
