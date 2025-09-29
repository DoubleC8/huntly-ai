"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function updateUserResume({
  resumeUrl,
  fileName,
}: {
  resumeUrl: string;
  fileName: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { resumes: true },
  });

  if (!user) throw new Error("User not found");

  const isFirstResume = user.resumes.length === 0;

  const newResume = await prisma.resume.create({
    data: {
      userId: user.id,
      publicUrl: resumeUrl,
      fileName,
      isDefault: isFirstResume,
    },
  });

  revalidatePath("/jobs/resume");

  return newResume;
}

export async function updateUserResumeJobTitle(values: {
  targetJobTitle: string, 
  resumeId: string,
}){
  const session = await auth();

  if(!session?.user?.email) throw new Error("Unauthorized");

  const updatedResume = await prisma.resume.update({
    where: {id: values.resumeId},
    data: {
      targetJobTitle: values.targetJobTitle
    }
  })

  revalidatePath("/jobs/resume");
  return updatedResume;
}