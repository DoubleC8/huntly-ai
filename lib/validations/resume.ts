import { z } from "zod";

export const resumeFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File size must not exceed 10MB.",
  })
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed.",
  });