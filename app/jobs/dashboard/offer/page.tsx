import { auth } from "@/auth";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";
import { prisma } from "@/lib/prisma";
import { JobStage } from "@/app/generated/prisma";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default async function offeredJobsPage() {
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

  if (!session.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User email not found.
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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
      stage: JobStage.OFFER,
    },
    orderBy: {
      postedAt: "desc",
    },
  });

  return (
    <div className="pageContainer">
      {jobs.length === 0 ? (
        <DashboardCard
          message="No offers yet — but don’t worry!"
          description="Keep up the momentum and check back here for updates."
        />
      ) : (
        <RecommendedJobs jobs={jobs} />
      )}
    </div>
  );
}
