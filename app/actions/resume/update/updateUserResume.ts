"use server";

import { getCurrentUserEmail } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserResume({
  resumeUrl,
  filename,
}: {
  resumeUrl: string;
  filename: string;
}) {
  const email = await getCurrentUserEmail();
  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { resumes: true },
  });

  if (!user) throw new Error("User not found");

  const isFirstResume = user.resumes.length === 0;

  const newResume = await prisma.resume.create({
    data: {
      userId: user.id,
      publicUrl: resumeUrl,
      fileName: filename,
      isDefault: isFirstResume,
    },
  });

  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");

  return newResume;
}

export async function updateUserResumeJobTitle(values: {
  targetJobTitle: string, 
  resumeId: string,
}){
  const email = await getCurrentUserEmail();

  if(!email) throw new Error("Unauthorized");

  const updatedResume = await prisma.resume.update({
    where: {id: values.resumeId},
    data: {
      targetJobTitle: values.targetJobTitle
    }
  });

  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");
  return updatedResume;
}

export async function makeResumeDefault( resumeId: string ){
  const email = await getCurrentUserEmail();
  if (!email) { throw new Error("Unauthorized"); }

  const resume = await prisma.resume.findUnique({ where: { id: resumeId }});
  if(!resume) {throw new Error("Resume not found")}

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  })

  if (!user || resume.userId !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.resume.updateMany({
    where: { userId: user.id },
    data: { isDefault: false },
  })


  const updatedResume = await prisma.resume.update({
    where: { id: resumeId },
    data: {
      isDefault: true
    }
  });

  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");
  return updatedResume;
}