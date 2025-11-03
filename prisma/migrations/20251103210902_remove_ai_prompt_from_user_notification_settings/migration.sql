/*
  Warnings:

  - You are about to drop the column `aiPrompt` on the `UserNotificationSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."UserNotificationSettings" DROP COLUMN "aiPrompt";
