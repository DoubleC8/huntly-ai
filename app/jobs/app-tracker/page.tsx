import { JobStage } from "@/app/generated/prisma";
import { auth } from "@/auth";
import AppTrackerColumns from "@/components/app-tracker/AppTrackerColumns";
import AppTrackerTitle from "@/components/app-tracker/AppTrackerTitle";
import { prisma } from "@/lib/prisma";

export default async function ApplicationTrackerPage() {
  const session = await auth();
  if (!session?.user?.email)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please Sign In.
      </div>
    );

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const jobs = await prisma.job.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const groupedJobs = Object.values(JobStage).reduce(
    (acc, stage) => ({
      ...acc,
      [stage]: jobs.filter((job) => job.stage === stage),
    }),
    {} as Record<JobStage, typeof jobs>
  );

  return (
    <div className="page h-screen">
      <AppTrackerTitle />
      <div className="pageContainer !min-h-[94vh] flex-1 flex flex-col">
        <AppTrackerColumns groupedJobs={groupedJobs} />
      </div>
    </div>
  );
}
