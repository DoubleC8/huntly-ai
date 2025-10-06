import { JobStage } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string){
    return prisma.user.findUnique({
        where: {email: email}
    });
}

export async function getUserWithJobs(email: string){
    return prisma.user.findUnique({
        where: { email: email },
        include: { jobs: true }
    })
}

export async function getUserProfileData(email: string){
    return prisma.user.findUnique({
    where: { email: email },
    include: {
      resumes: {
        where: {
          isDefault: true,
        },
      },
      jobs: {
        where: {
          stage: {
            in: [ JobStage.APPLIED, JobStage.INTERVIEW, JobStage.OFFER, JobStage.REJECTED ],
          },
        },
      },
      education: true,
    },
  });
}

