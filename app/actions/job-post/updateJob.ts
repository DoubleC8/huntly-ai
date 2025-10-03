"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { JobStage } from "@/app/generated/prisma";

const base = z.object({
    jobId: z.string().min(1),
});

const toggleWishlist = base.extend({
    type: z.literal("toggleWishlist"),
});

const setStage = base.extend({
    type: z.literal("setStage"), 
    stage: z.enum(JobStage),
});

const setNote = base.extend({
    type: z.literal("setNote"),
    note: z.string().max(1000),
});

const updateFields = base.extend({
  type: z.literal("updateFields"),
  data: z.object({
    title: z.string().optional(),
    location: z.string().optional(),
    employment: z.string().optional(),
    remoteType: z.string().optional(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    currency: z.string().optional(),
    // add more fields as needed
  }),
});

const InputSchema = z.union([setStage, toggleWishlist, setNote, updateFields]);
export type UpdateJobInput = z.infer<typeof InputSchema>;

async function requireUser() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })
    if (!user) throw new Error("User not found");
    return user;
}

async function requireOwnedJob(jobId: string, userId: string){
    const job = await prisma.job.findUnique({ where: { id: jobId }});
    if(!job || job.userId !== userId){
        throw new Error("Job not found or does not belong to the user");
    }

    return job;
}

function revalidateJobViews(jobId: string) {
  revalidatePath("/jobs/app-tracker");
  revalidatePath("/jobs/dashboard");
  revalidatePath(`/jobs/dashboard/${jobId}`);
}


export async function updateJob(input: UpdateJobInput){
    const parsed = InputSchema.parse(input);

    const user = await requireUser();
    const job = await requireOwnedJob(parsed.jobId, user.id);

    let updated;

    switch(parsed.type) {
       case "setStage": {
        // Optional: add guards for invalid transitions here
        updated = await prisma.job.update({
        where: { id: parsed.jobId },
        data: { stage: parsed.stage },
      });
      break;
    }

    case "toggleWishlist": {
      const isWishlisted = job.stage === JobStage.WISHLIST;
      updated = await prisma.job.update({
        where: { id: parsed.jobId },
        data: { stage: isWishlisted ? JobStage.DEFAULT : JobStage.WISHLIST },
      });
      break;
    }

    case "setNote": {
        updated = await prisma.job.update({
            where: { id: parsed.jobId }, 
            data: { note: parsed.note }
        })
        break;
    }

    case "updateFields": {
      updated = await prisma.job.update({
        where: { id: parsed.jobId },
        data: parsed.data,
      });
      break;
    }
    }

    revalidateJobViews(parsed.jobId);
    return updated;
}