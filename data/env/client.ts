import { createEnv } from "@t3-oss/env-nextjs"
import { z, ZodError } from "zod"

function logClientEnvError(error: unknown) {
  if (error instanceof ZodError) {
    console.error("❌ Invalid client environment variables detected:")
    for (const issue of error.issues) {
      console.error(
        `   • ${issue.path.join(".") || "<root>"} → ${issue.message}`
      )
    }
    console.error(
      "Double-check the NEXT_PUBLIC_* variables in Vercel Project → Settings → Environment Variables."
    )
  }
}

function createClientEnv() {
  try {
    return createEnv({
      client: {
        // Clerk Authentication
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().min(1),

        // Supabase
        NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
      },
      emptyStringAsUndefined: true,
      experimental__runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NEXT_PUBLIC_CLERK_SIGN_IN_URL:
          process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
          process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
        NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
          process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    })
  } catch (error) {
    logClientEnvError(error)
    throw error
  }
}

export const env = createClientEnv()
