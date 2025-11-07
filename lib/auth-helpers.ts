"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import type { User as ClerkUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures a Clerk user exists in our Prisma database and syncs their data
 * @param clerkUser - The Clerk user object (to avoid calling currentUser() multiple times)
 */
async function ensureUserInDatabase(clerkUser: ClerkUser | null | undefined) {
  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    console.error("Clerk user has no email address");
    return null;
  }

  const name =
    clerkUser.firstName && clerkUser.lastName
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.firstName || clerkUser.lastName || clerkUser.username || null;

  const image = clerkUser.imageUrl || null;

  const isVerified =
    clerkUser.emailAddresses[0]?.verification?.status === "verified";

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      image,
      emailVerified: isVerified ? new Date() : null,
    },
    update: {
      name: name ?? undefined,
      image: image ?? undefined,
      emailVerified: isVerified ? new Date() : undefined,
    },
  });

  return user;
}

/**
 * Get the current authenticated user's email from Clerk
 * This replaces the old NextAuth pattern of session.user.email
 * Automatically ensures the user exists in the database
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  let clerkUser;
  try {
    clerkUser = await currentUser();
  } catch (error: unknown) {
    console.error("Error fetching Clerk user for email:", error);
    
    // Type guard for error object
    const err = error as { message?: string; status?: number; clerkError?: boolean };
    console.error("Error details:", {
      message: err?.message,
      status: err?.status,
      clerkError: err?.clerkError,
    });
    
    // Check if this is an API key configuration error
    if (err?.clerkError && err?.status === undefined) {
      console.error("Possible Clerk API key issue. Please verify:");
      console.error("   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set correctly");
      console.error("   - CLERK_SECRET_KEY is set correctly");
      console.error("   - Keys match your Clerk Dashboard");
    }
    
    return null;
  }

  const email = clerkUser?.emailAddresses[0]?.emailAddress || null;
  
  if (!email) return null;

  // Automatically sync user to database (pass clerkUser to avoid re-fetching)
  await ensureUserInDatabase(clerkUser);
  
  return email;
}

/**
 * Get the current authenticated user from Prisma database
 * Ensures the user exists in the database before returning
 */
export async function getCurrentUser() {
  const email = await getCurrentUserEmail();
  if (!email) return null;

  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Get the current authenticated user's Clerk ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

