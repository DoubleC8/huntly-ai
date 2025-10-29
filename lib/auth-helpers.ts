"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated user's email from Clerk
 * This replaces the old NextAuth pattern of session.user.email
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  return user?.emailAddresses[0]?.emailAddress || null;
}

/**
 * Get the current authenticated user's Clerk ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

