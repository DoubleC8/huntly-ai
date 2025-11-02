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
    await prisma.userNotificationSettings.create({
      data: settings,
    });
  }

  revalidateUserNotificationSettingsCache(settings.userId);
}

export async function updateUserNotificationSettings(
  userId: string,
  settings: UserNotificationSettingsUpdateInput
) {
  // Use upsert to insert if doesn't exist, update if exists (equivalent to onConflictDoUpdate)
  await prisma.userNotificationSettings.upsert({
    where: { userId },
    create: {
      userId,
      ...settings,
    },
    update: settings,
  });

  revalidateUserNotificationSettingsCache(userId);
}
