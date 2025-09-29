"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export async function deleteUserResume(id: string, filePath: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  // 1. Delete from Supabase Storage
  const supabase = createClient();
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .remove([filePath]);

  if (storageError) {
    console.error("Supabase delete error:", storageError);
    throw new Error("Failed to delete file from storage");
  }

  // 2. Find resume in DB
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) throw new Error("Resume not found");

  // 3. Ownership check
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { resumes: true },
  });

  const ownsResume = user?.resumes.some((r) => r.id === id);
  if (!ownsResume) throw new Error("Forbidden");

  // 4. Delete from DB
  await prisma.resume.delete({ where: { id } });

  // 5. Revalidate so UI updates
  revalidatePath("/jobs/resume");

  return { success: true };
}