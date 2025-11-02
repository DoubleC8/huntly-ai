import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

type UserResumeInsertInput = Prisma.ResumeUncheckedCreateInput;
type UserResumeUpdateInput = Prisma.ResumeUncheckedUpdateInput;

export async function insertUserResume(resume: UserResumeInsertInput) {
  await prisma.resume.create({
    data: resume,
  });

  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");
}

export async function updateUserResume(
  userId: string,
  resume: UserResumeUpdateInput
) {
  // Update the user's default resume or the first resume found
  const existingResume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });

  if (existingResume) {
    await prisma.resume.update({
      where: { id: existingResume.id },
      data: resume,
    });
  }

  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");
}

export async function deleteUserResume(resumeId: string) {
  await prisma.resume.delete({
    where: { id: resumeId },
  });

  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");
}

