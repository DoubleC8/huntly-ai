"use server";

import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function getUserNotificationSettings() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const settings = await prisma.userNotificationSettings.findUnique({
    where: { userId: user.id },
  });

  // Return default settings if none exist
  if (!settings) {
    return {
      userId: user.id,
      newJobEmailNotifications: false,
    };
  }

  return settings;
}

