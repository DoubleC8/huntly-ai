import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ResumeDashboardClient from "@/components/resume/ResumeDashboardClient";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default async function ResumePage() {
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
    where: { email: session?.user?.email! },
    //we need this since users have a relationship with the resumes
    include: { resumes: true },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  return (
    <div className="page">
      <div className="pageTitleContainer">
        <h1 className="pageTitle">Resume</h1>
      </div>
      <div
        className="
            pageContainer !min-h-[94vh]"
      >
        <ErrorBoundary>
          <ResumeDashboardClient email={session?.user?.email!} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
