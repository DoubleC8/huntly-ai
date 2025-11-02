import { revalidatePath } from "next/cache";

/**
 * Revalidates user-related cache paths
 * @param userId - The user ID to revalidate cache for
 */
export function revalidateUserCache(userId: string) {
  // Revalidate user profile pages
  revalidatePath("/jobs/profile");
  revalidatePath(`/jobs/profile/${userId}`);
  
  // Revalidate any user-specific pages that might be cached
  revalidatePath("/jobs/dashboard");
}

