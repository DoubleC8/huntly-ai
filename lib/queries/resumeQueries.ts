import { prisma } from "@/lib/prisma";

export async function getResumesByUserId(userId: string) {
    return prisma.resume.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "desc" }
    })
}

export async function getDefaultResume(userId: string){
    return prisma.resume.findFirst({
    where: { 
        userId: userId,
         isDefault: true 
        },
  });
}