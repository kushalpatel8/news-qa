import { z } from "zod";

export const apiTestSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  headers: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string()
    })
  ).optional(),
  body: z.string().optional(),
});

export type ApiTestFormValues = z.infer<typeof apiTestSchema>;
