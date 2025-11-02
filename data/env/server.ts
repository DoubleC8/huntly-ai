import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().min(1),
    
    // Clerk Authentication
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    
    // Supabase (optional - falls back to anon key if not provided)
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    
    // Google Gemini AI
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  },
  
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
})