import DashboardMobileNavbar from "@/components/dashboard/DashboardMobileNavbar";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { auth } from "@/auth";
import DashboardDesktopNavbar from "@/components/dashboard/DashboardDesktopNavabar";
import RecommendedJobsContainer from "@/components/dashboard/RecommendedJobsContainer";
import { Job } from "@/app/generated/prisma";
import { fakeJobs } from "@/mockJobsData";

export default async function DashboardPage() {
  const session = await auth();
  const jobs: Job[] = fakeJobs;

  //extra security, we have middleware but this is just incase it doesnt work for some reason
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

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
