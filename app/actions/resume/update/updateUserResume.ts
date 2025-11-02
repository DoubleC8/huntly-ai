"use server";

import { getCurrentUserEmail } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { inngest } from "@/services/inngest/client";

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

  // Trigger Inngest event for AI analysis
  await inngest.send({
    name: "app/resume.uploaded",
    data: {
      user: {
        id: user.id,
      },
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

  const resume = await prisma.resume.findUnique({ 
    where: { id: resumeId },
    select: { userId: true, aiSummary: true }
  });
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

  // If the new default resume doesn't have an AI summary yet, trigger analysis
  // This ensures match scores always use data from the default resume
  if (!resume.aiSummary) {
    await inngest.send({
      name: "app/resume.uploaded",
      data: {
        user: {
          id: user.id,
        },
      },
    });
  }

  revalidatePath("/jobs/resume");
  revalidatePath("/jobs/profile");
  return updatedResume;
}