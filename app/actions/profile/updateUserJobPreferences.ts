"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function normalizePreference(preference: string): string {
  return preference.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function updateUserJobPreference(preferences: string[]) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { jobPreferences: true },
  });

  if (!user) throw new Error("User not found");

  const normalized = preferences.map(normalizePreference);
  const uniquePreferences = Array.from(new Set([...user.jobPreferences, ...normalized]));

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email }, 
    data: { jobPreferences: uniquePreferences }
  })

  revalidatePath("/jobs/profile")

  return updatedUser.jobPreferences;
}