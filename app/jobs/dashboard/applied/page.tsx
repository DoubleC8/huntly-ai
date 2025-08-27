import { auth } from "@/auth";
import RecommendedJobsContainer from "@/components/dashboard/RecommendedJobsContainer";
import { Frown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JobStage } from "@/app/generated/prisma";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default async function appliedJobsPage() {
  const session = await auth();

  //extra security, we have middleware but this is just incase it doesnt work for some reason
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const jobs = await prisma.job.findMany({
    where: {
      userId: user.id,
      stage: JobStage.APPLIED,
    },
    orderBy: {
      postedAt: "desc",
    },
  });

  return (
    <div className="pageContainer">
      {jobs.length === 0 ? (
        <DashboardCard
          message="You haven’t applied to any jobs yet."
          description="Once you apply, they’ll show up here to help track your progress."
        />
      ) : (
        <RecommendedJobsContainer jobs={jobs} />
      )}
    </div>
  );
}
