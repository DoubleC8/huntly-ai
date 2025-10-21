import { auth } from "@/auth";
import ResumeTable from "@/components/resume/ResumeTable";
import { prisma } from "@/lib/prisma";
import { getResumesByUserId } from "@/lib/queries/resumeQueries";
import { getUserByEmail } from "@/lib/queries/userQueries";
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

  if (!session.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User email not found.
      </div>
    );
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const resumes = await getResumesByUserId(user.id);

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
          <ResumeTable resumes={resumes} email={user.email} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
