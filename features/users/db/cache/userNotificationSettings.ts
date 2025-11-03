import { revalidatePath } from "next/cache";

/**
 * Revalidates user notification settings cache paths
 * @param userId - The user ID to revalidate cache for
 */
export function revalidateUserNotificationSettingsCache(userId: string) {
  // Revalidate user profile pages where notification settings might be displayed
  revalidatePath("/jobs/profile");
  revalidatePath(`/jobs/profile/${userId}`);
  
  // Revalidate settings pages
  revalidatePath("/jobs/settings");
  revalidatePath("/jobs/profile/settings");
}

