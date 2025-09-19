import { z } from "zod";

export const jobNoteSchema = z.object({
    note: z.string().trim().max(1000, "Notes must be under 1000 characters.").optional()
});