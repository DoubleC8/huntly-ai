import { createEnv } from "@t3-oss/env-nextjs"
import { z, ZodError } from "zod"

function logServerEnvError(error: unknown) {
  if (error instanceof ZodError) {
    console.error("❌ Invalid server environment variables detected:")
    for (const issue of error.issues) {
      console.error(
        `   • ${issue.path.join(".") || "<root>"} → ${issue.message}`
      )
    }
    console.error(
      "Ensure these variables are configured in Vercel Project → Settings → Environment Variables (and locally if building)."
    )
  }
}

function createServerEnv() {
  try {
    return createEnv({
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

        // Serper API for job search across popular job sites
        SERPER_API_KEY: z.string().min(1),

        // Inngest Event Key (optional - only needed for sending events from server actions)
        INNGEST_EVENT_KEY: z.string().optional(),

        RESEND_API_KEY: z.string().min(1),
      },

      emptyStringAsUndefined: true,
      experimental__runtimeEnv: process.env,
    })
  } catch (error) {
    logServerEnvError(error)
    throw error
  }
}

export const env = createServerEnv()