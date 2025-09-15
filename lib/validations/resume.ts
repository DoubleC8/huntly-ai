import { z } from "zod";

export const resumeFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File size must not exceed 10MB.",
  })
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed.",
  });

export const targetJobTitleSchema = z.object({
  targetJobTitle: z.string()
  .max(50, "Job title must be 50 characters or less.")
  .trim()
})

export type TargetJobTitleInput = z.infer<typeof targetJobTitleSchema>;