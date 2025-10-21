"use server";


import { JobStage } from "@/app/generated/prisma";
import { requireUser } from "./updateJob";
import { prisma } from "@/lib/prisma";

export async function getJobStageCounts() {
    try {
        const user = await requireUser();
        
        const counts = await prisma.job.groupBy({
            by: ["stage"], 
            _count: { stage: true }, 
            where: { userId: user.id }
        });

        // Create a map for quick lookup
        const countsMap = new Map(
            counts.map(({ stage, _count }) => [stage, _count.stage])
        );

        // Initialize all stages with 0, then update with actual counts
        const result: Record<JobStage, number> = {} as Record<JobStage, number>;
        
        for (const stage of Object.values(JobStage)) {
            result[stage] = countsMap.get(stage) ?? 0;
        }

        return result;
    } catch (error) {
        console.error("Error fetching job stage counts:", error);
        return null;
    }
}