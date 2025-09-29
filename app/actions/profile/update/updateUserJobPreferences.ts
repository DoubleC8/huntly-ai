"use server";

import { auth } from "@/auth";
import { updateUserArrayEntry } from "@/lib/utils";
import { revalidatePath } from "next/cache";


export async function updateUserJobPreference(preferences: string[]) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const updatedUser = await updateUserArrayEntry(
          session.user.email,
          "jobPreferences",
          preferences, 
          "update"
  );
  
  revalidatePath("/jobs/profile")

  return updatedUser;
}