"use server"

import {auth} from "@/auth"
import { prisma } from '@/lib/prisma';
import { JobStage } from '@/app/generated/prisma';
import { revalidatePath } from 'next/cache';

export async function updateJobStage(jobId: string, newStage: JobStage){
    const session = await auth();

    //some extra precaution
    if(!session?.user?.email) throw new Error("Unauthorized")
    
    // Validate that newStage is not null or undefined
    if (!newStage) throw new Error("Invalid stage: stage cannot be null or undefined")

    //making sure the user exist by checking that the id of the user exists in our db
    const user = await prisma.user.findUnique({
        where: {email: session.user.email},
    });

    if (!user) throw new Error("User not found.");

    const job = await prisma.job.findUnique({
        where: {
            id: jobId
        },
    })

    //checking that the job exists and that the user has a relation with that job
    if(!job || job.userId !== user.id) throw new Error("Job not found or does not belong to the user.");


    //updating the job stage by the job id and the stage we are trying to move it to
    const updated = await prisma.job.update({
        where: {id: jobId}, 
        data: {
            stage: newStage, 
        }
    })

    //this keeps our data fresh, so that the user can see the change in real time
    revalidatePath('/jobs/app-tracker');

    return updated;
}
