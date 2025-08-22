import DashboardMobileNavbar from "@/components/dashboard/DashboardMobileNavbar";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { auth } from "@/auth";
import DashboardDesktopNavbar from "@/components/dashboard/DashboardDesktopNavabar";
import RecommendedJobsContainer from "@/components/dashboard/RecommendedJobsContainer";
import { Job } from "@/app/generated/prisma";
import { fakeJobs } from "@/mockJobsData";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
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
    where: { userId: user.id },
  });

  return (
    <>
      <div className="page">
        <DashboardMobileNavbar />

        <DashboardTitle />

        {/**This code below will hold the recommended jobs */}
        <div className="pageContainer">
          <DashboardDesktopNavbar />

          <RecommendedJobsContainer jobs={jobs} />
        </div>
      </div>
    </>
  );
}
