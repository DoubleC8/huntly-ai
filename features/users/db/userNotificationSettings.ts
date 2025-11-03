import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import { revalidateUserNotificationSettingsCache } from "./cache/userNotificationSettings";

type UserNotificationSettingsInsertInput = Prisma.UserNotificationSettingsUncheckedCreateInput;
type UserNotificationSettingsUpdateInput = Partial<
  Omit<Prisma.UserNotificationSettingsUncheckedCreateInput, "userId">
>;

export async function insertUserNotificationSettings(
  settings: UserNotificationSettingsInsertInput
) {
  // Check if user notification settings already exist (equivalent to onConflictDoNothing)
  const existingSettings = await prisma.userNotificationSettings.findUnique({
    where: { userId: settings.userId },
  });

  if (!existingSettings) {
    // Explicitly construct the data object to only include valid fields
    await prisma.userNotificationSettings.create({
      data: {
        userId: settings.userId,
        newJobEmailNotifications: settings.newJobEmailNotifications ?? false,
      },
    });
  }

  revalidateUserNotificationSettingsCache(settings.userId);
}

export async function updateUserNotificationSettings(
  userId: string,
  settings: UserNotificationSettingsUpdateInput
) {
  // Explicitly construct the data object to only include valid fields
  // This ensures we never accidentally include aiPrompt or any other removed fields
  // We completely bypass Prisma types and use plain object literals
  const newJobEmailNotifications = settings.newJobEmailNotifications ?? false;

  // Check if record exists first
  const existing = await prisma.userNotificationSettings.findUnique({
    where: { userId },
  });

  if (existing) {
    // Update existing record - only update if value actually changed
    if (existing.newJobEmailNotifications !== newJobEmailNotifications) {
      await prisma.userNotificationSettings.update({
        where: { userId },
        data: {
          newJobEmailNotifications: newJobEmailNotifications,
        },
      });
    }
  } else {
    // Create new record
    await prisma.userNotificationSettings.create({
      data: {
        userId,
        newJobEmailNotifications: newJobEmailNotifications,
      },
    });
  }

  revalidateUserNotificationSettingsCache(userId);
}
