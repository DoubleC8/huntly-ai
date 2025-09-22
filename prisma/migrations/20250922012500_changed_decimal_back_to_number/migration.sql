/*
  Warnings:

  - You are about to alter the column `salaryMin` on the `Job` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `salaryMax` on the `Job` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Job" ALTER COLUMN "salaryMin" SET DATA TYPE INTEGER,
ALTER COLUMN "salaryMax" SET DATA TYPE INTEGER;
