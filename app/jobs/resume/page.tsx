import { auth } from "@/auth";
import ResumeTable from "@/components/resume/ResumeTable";
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

  if (!session.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User email not found.
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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
        <ResumeTable resumes={user.resumes} email={user.email} />
      </div>
    </div>
  );
}
