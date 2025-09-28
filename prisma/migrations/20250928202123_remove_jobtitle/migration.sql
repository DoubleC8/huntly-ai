/*
  Warnings:

  - You are about to drop the `JobTitle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserPreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserPreferences" DROP CONSTRAINT "_UserPreferences_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserPreferences" DROP CONSTRAINT "_UserPreferences_B_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "jobPreferences" TEXT[],
ADD COLUMN     "jobTitleId" TEXT;

-- DropTable
DROP TABLE "public"."JobTitle";

-- DropTable
DROP TABLE "public"."_UserPreferences";
