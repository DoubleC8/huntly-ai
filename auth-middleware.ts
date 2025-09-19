// app/auth-middleware.ts (or lib/auth-middleware.ts)
import { getToken } from "next-auth/jwt"

// This auth function works in Edge Runtime (e.g., middleware.ts)
export async function auth(request: Request) {
  return await getToken({
    req: request,
    secret: process.env.AUTH_SECRET, // Make sure this is defined
  })
}