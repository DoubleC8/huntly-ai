import { auth } from "@/auth";
import RecommendedJobsContainer from "@/components/dashboard/RecommendedJobsContainer";
import { Frown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JobStage } from "@/app/generated/prisma";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default async function wishlistedJobsPage() {
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
      stage: JobStage.WISHLIST,
    },
    orderBy: {
      postedAt: "desc",
    },
  });

  return (
    <div className="pageContainer">
      {jobs.length === 0 ? (
        <DashboardCard
          message="You haven’t wishlisted any jobs yet."
          description="Save interesting opportunities on the recommended jobs page and come
            back here to revisit them later."
        />
      ) : (
        <RecommendedJobsContainer jobs={jobs} />
      )}
    </div>
  );
}
