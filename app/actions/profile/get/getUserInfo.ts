import { JobStage } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserWithJobs(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { jobs: true },
  });
}

export async function getUserProfileData({
  email,
  page,
  limit,
}: {
  email: string;
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;

  const [user, totalJobs] = await Promise.all([
    prisma.user.findUnique({
      where: { email },
      include: {
        resumes: {
          where: { isDefault: true },
        },
        jobs: {
          where: {
            stage: {
              in: [
                JobStage.APPLIED,
                JobStage.INTERVIEW,
                JobStage.OFFER,
                JobStage.REJECTED,
              ],
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        },
        education: true,
      },
    }),
    prisma.job.count({
      where: {
        user: { email },
        stage: {
          in: [
            JobStage.APPLIED,
            JobStage.INTERVIEW,
            JobStage.OFFER,
            JobStage.REJECTED,
          ],
        },
      },
    }),
  ]);

  return { user, totalJobs };
}