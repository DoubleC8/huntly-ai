-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
