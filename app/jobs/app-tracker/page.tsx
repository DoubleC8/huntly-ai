import { auth } from "@/auth";
import AppTrackerColumns from "@/components/app-tracker/AppTrackerColumns";
import AppTrackerNavbar from "@/components/app-tracker/AppTrackerNavbar";
import AppTrackerTitle from "@/components/app-tracker/AppTrackerTitle";
import { prisma } from "@/lib/prisma";

export default async function ApplicationTrackerPage() {
  const session = await auth();

  // extra security check
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please Sign In.
      </div>
    );
  }

  // get the logged-in user
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

  // fetch jobs for each stage
  const [wishlistJobs, appliedJobs, interviewJobs, offeredJobs] =
    await Promise.all([
      prisma.job.findMany({
        where: {
          userId: user.id,
          stage: "WISHLIST",
        },
      }),
      prisma.job.findMany({
        where: {
          userId: user.id,
          stage: "APPLIED",
        },
      }),
      prisma.job.findMany({
        where: {
          userId: user.id,
          stage: "INTERVIEW",
        },
      }),
      prisma.job.findMany({
        where: {
          userId: user.id,
          stage: "OFFER",
        },
      }),
    ]);

  return (
    <div className="page">
      <AppTrackerTitle />
      <div
        className="
      pageContainer !min-h-[94vh]"
      >
        <AppTrackerNavbar />
        <AppTrackerColumns
          wishlist={wishlistJobs}
          applied={appliedJobs}
          interview={interviewJobs}
          offered={offeredJobs}
        />
      </div>
    </div>
  );
}
