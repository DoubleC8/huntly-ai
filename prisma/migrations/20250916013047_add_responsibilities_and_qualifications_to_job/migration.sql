-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "skills" SET DEFAULT ARRAY[]::TEXT[];
