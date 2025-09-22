/*
  Warnings:

  - Added the required column `updatedAt` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."JobStage" ADD VALUE 'DEFAULT';

-- AlterTable
ALTER TABLE "public"."Job" ALTER COLUMN "salaryMin" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "salaryMax" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "aiSummary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Resume" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "education" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "public"."JobTitle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_UserPreferences" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserPreferences_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_title_key" ON "public"."JobTitle"("title");

-- CreateIndex
CREATE INDEX "JobTitle_title_idx" ON "public"."JobTitle"("title");

-- CreateIndex
CREATE INDEX "_UserPreferences_B_index" ON "public"."_UserPreferences"("B");

-- AddForeignKey
ALTER TABLE "public"."_UserPreferences" ADD CONSTRAINT "_UserPreferences_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."JobTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserPreferences" ADD CONSTRAINT "_UserPreferences_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
