'use server';

import { JobStage } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

export async function setJobAsRejected(jobId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.userId !== user.id) {
    throw new Error("Job not found or does not belong to the user");
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: { stage: JobStage.REJECTED }
  });

    revalidatePath("/jobs/app-tracker");
    revalidatePath("/jobs/dashboard");

  return updated;
}