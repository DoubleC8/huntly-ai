import { auth } from "@/auth";
import AppliedJobs from "@/components/profile/applied-jobs/AppliedJobs";
import UserEducation from "@/components/profile/education/UserEducation";
import UserJobPreferences from "@/components/profile/job-preferences/UserJobPreferences";
import UserSkills from "@/components/profile/skills/UserSkills";
import UserInfo from "@/components/profile/user-info/UserInfo";
import UserResume from "@/components/profile/user-resume/UserResume";
import { getDefaultResume } from "@/lib/queries/resumeQueries";
import { getUserProfileData } from "@/lib/queries/userQueries";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please Sign In.
      </div>
    );
  }

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;

  const { user, totalJobs } = await getUserProfileData({
    email: session.user.email,
    page: currentPage,
    limit,
  });
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const defaultResume = (await getDefaultResume(user.id)) ?? user.resumes[0];

  return (
    <div className="page">
      <div className="pageTitleContainer">
        <h1 className="pageTitle">Profile</h1>
      </div>

      <div className="pageContainer">
        <div className="bg-[var(--background)] h-fit rounded-3xl shadow-md p-5 flex flex-col gap-5">
          <UserInfo user={user} />
          <UserEducation education={user.education} />
          <UserSkills skills={user.skills} />
          <UserJobPreferences jobPreferences={user.jobPreferences} />
          <UserResume defaultResume={defaultResume} />

          <AppliedJobs
            initialJobs={user.jobs}
            totalJobs={totalJobs}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
}
