import { auth } from "@/auth";
import AppTrackerColumnContainer from "@/components/app-tracker/AppTrackerColumnContainer";
import AppTrackerDesktopNavbar from "@/components/app-tracker/AppTrackerDesktopNavbar";
import AppTrackerMobileNavbar from "@/components/app-tracker/AppTrackerMobileNavabar";
import AppTrackerTitle from "@/components/app-tracker/AppTrackerTitle";

export default async function ApplicationTrackerPage() {
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
          <AppTrackerColumnContainer />
        </div>
      </div>
    </>
  );
}
