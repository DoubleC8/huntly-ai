import { auth } from "@/auth";
import ResumeDashboardClient from "@/components/resume/ResumeDashboardClient";
import { prisma } from "@/lib/prisma";

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

  // get the logged-in user
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
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
      <ResumeDashboardClient email={session?.user?.email!} />
    </div>
  );
}
