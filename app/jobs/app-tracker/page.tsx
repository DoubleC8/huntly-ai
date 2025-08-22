import { Job } from "@/app/generated/prisma";
import { auth } from "@/auth";
import AppTrackerColumnContainer from "@/components/app-tracker/AppTrackerColumnContainer";
import AppTrackerDesktopNavbar from "@/components/app-tracker/AppTrackerDesktopNavbar";
import AppTrackerMobileNavbar from "@/components/app-tracker/AppTrackerMobileNavabar";
import AppTrackerTitle from "@/components/app-tracker/AppTrackerTitle";
import { fakeJobs } from "@/mockJobsData";

export default async function ApplicationTrackerPage() {
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
        {/**Hidden on mobile */}
        <AppTrackerMobileNavbar />

        <AppTrackerTitle />

        <div className="pageContainer">
          {/**Hidden on mobile */}
          <AppTrackerDesktopNavbar />

          {/**This code below will hold the job columns */}
          <AppTrackerColumnContainer
            wishlist={jobs}
            applied={jobs}
            interview={jobs}
            offered={jobs}
          />
        </div>
      </div>
    </>
  );
}
