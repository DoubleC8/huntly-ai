/*
  Warnings:

  - Made the column `stage` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Job" ALTER COLUMN "stage" SET NOT NULL,
ALTER COLUMN "stage" SET DEFAULT 'DEFAULT';
