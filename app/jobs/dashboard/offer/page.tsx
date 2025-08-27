import { auth } from "@/auth";
import RecommendedJobsContainer from "@/components/dashboard/RecommendedJobsContainer";
import { Frown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JobStage } from "@/app/generated/prisma";

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
      stage: JobStage.OFFER,
    },
    orderBy: {
      postedAt: "desc",
    },
  });

  return (
    <div className="pageContainer">
      {jobs.length === 0 ? (
        <div className="flex flex-col gap-3 justify-center items-center my-auto">
          <Frown />
          <p className="text-muted-foreground text-center">
            No offers yet — but don’t worry!
            <br />
            Keep up the momentum and check back here for updates.
          </p>
        </div>
      ) : (
        <RecommendedJobsContainer jobs={jobs} />
      )}
    </div>
  );
}
