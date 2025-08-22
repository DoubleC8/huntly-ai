'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { JobStage } from "../generated/prisma";
import { revalidatePath } from "next/cache";



export async function setJobAsWishlist(jobId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  await prisma.job.update({
    where: {
      id: jobId,
      userId: user.id,
    },
    data: {
      stage: JobStage.WISHLIST,
    },
  });

  // after the update
    await prisma.job.update({
     where: { id: jobId, userId: user.id },
    data: { stage: JobStage.WISHLIST },
    });

    revalidatePath("/jobs/app-tracker");
}