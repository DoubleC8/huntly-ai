import { getCurrentUserEmail } from "@/lib/auth-helpers";
import ResumeTable from "@/components/resume/ResumeTable";
import { getResumesByUserId } from "@/app/actions/resume/get/getResumes";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getUserByEmail } from "@/app/actions/profile/get/getUserInfo";

export default async function ResumePage() {
  const email = await getCurrentUserEmail();

  //extra security, we have middleware but this is just incase it doesnt work for some reason
  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  const user = await getUserByEmail(email);

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
          <ResumeTable resumes={resumes ?? []} email={user.email} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
