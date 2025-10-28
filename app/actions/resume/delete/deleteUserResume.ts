"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteUserResume(id: string, filePath: string) {
  const session = await auth();
  if (!session?.user?.email) { throw new Error("Unauthorized"); }

  // 1. Find resume in DB and verify ownership FIRST (before deleting from storage)
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) throw new Error("Resume not found");

  // 2. Ownership check - do this BEFORE deleting from storage
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { resumes: true },
  });

  const ownsResume = user?.resumes.some((r) => r.id === id);
  if (!ownsResume) throw new Error("Forbidden");

  // 3. Now safe to delete from Supabase Storage using admin client
  // Note: We use admin client because users authenticate via NextAuth (not Supabase Auth),
  // so RLS policies that require auth.uid() won't work for us.
  const supabase = createAdminClient();
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .remove([filePath]);

  if (storageError) {
    console.error("Supabase delete error:", storageError);
    throw new Error("Failed to delete file from storage");
  }

  const wasDefault = resume.isDefault;
  const remainingResumes = user!.resumes.filter((r) => r.id !== id);

  // 4. Delete from database
  await prisma.resume.delete({ where: { id } });

  // 5. If we deleted the default resume and there are other resumes, make the oldest remaining one the default
  if (wasDefault && remainingResumes.length > 0) {
    // Sort by creation date (oldest first) and make the oldest the default
    const oldestRemaining = remainingResumes.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )[0];

    // Make the oldest remaining resume the default
    await prisma.resume.updateMany({
      where: { userId: user!.id },
      data: { isDefault: false },
    });

    await prisma.resume.update({
      where: { id: oldestRemaining.id },
      data: { isDefault: true },
    });
  }

  // 6. Revalidate paths so UI updates
  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");

  return { success: true };
}