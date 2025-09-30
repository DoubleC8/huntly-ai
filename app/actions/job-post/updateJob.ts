"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserJobNote(values: {
    jobNote: string, 
    jobId: string
}){
    const session = await auth();
    if(!session?.user?.email) throw new Error("Unauthorized");

    const job = await prisma.job.findUnique({ 
        where: { id: values.jobId }
    })
    if(!job)  throw new Error("Job not found");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    })

    if(!user || job.userId !== user.id){
        throw new Error("Forbidden");
    }

    const updatedJob = await prisma.job.update({
        where: {id: values.jobId },
        data: { note: values.jobNote }
    })

    revalidatePath("/jobs/dashboard");
    revalidatePath(`/jobs/dashboard/${values.jobId}`)
    return updatedJob;
}