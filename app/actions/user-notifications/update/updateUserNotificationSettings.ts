"use server";

import { getCurrentUser } from "@/lib/auth-helpers";
import { updateUserNotificationSettings as updateSettings } from "@/features/users/db/userNotificationSettings";
import { revalidatePath } from "next/cache";

export async function updateUserNotificationSettings(
  settings: {
    newJobEmailNotifications?: boolean;
  }
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await updateSettings(user.id, settings);
  
  revalidatePath("/jobs/settings");
  
  return { success: true };
}

