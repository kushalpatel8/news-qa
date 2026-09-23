import { z } from "zod";

export const bugSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(200, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters."),
  stepsToReproduce: z.string().min(10, "Steps to reproduce are required."),
  expectedResult: z.string().min(5, "Expected result is required."),
  actualResult: z.string().min(5, "Actual result is required."),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "FIXED", "RETEST", "VERIFIED"]).default("OPEN"),
  environment: z.string().min(2, "Environment is required."),
  screenshotUrl: z.string().url().optional().or(z.literal('')),
  assignedTo: z.string().optional(),
  reporterRole: z.enum(["ADMIN", "EDITOR", "QA", "VIEWER"]).default("QA"),
});

export type BugFormValues = z.infer<typeof bugSchema>;
