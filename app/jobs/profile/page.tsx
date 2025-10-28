import { auth } from "@/auth";
import AppliedJobs from "@/components/profile/applied-jobs/AppliedJobs";
import UserEducation from "@/components/profile/education/UserEducation";
import UserJobPreferences from "@/components/profile/job-preferences/UserJobPreferences";
import UserSkills from "@/components/profile/skills/UserSkills";
import UserProfileSkeleton from "@/components/profile/ui/UserProfileSkeleton";
import UserResumeSkeleton from "@/components/profile/ui/UserResumeSkeleton";
import UserInfo from "@/components/profile/user-info/UserInfo";
import UserResume from "@/components/profile/user-resume/UserResume";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getDefaultResume } from "@/app/actions/resume/get/getResumes";
import { getUserProfileData } from "@/app/actions/profile/get/getUserInfo";
import { JOB_LIMIT } from "@/lib/constants/profile";

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

  const { user, totalJobs } = await getUserProfileData({
    email: session.user.email,
    page: currentPage,
    limit: JOB_LIMIT,
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
          <ErrorBoundary>
            <Suspense fallback={<UserProfileSkeleton />}>
              <UserInfo user={user} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<UserProfileSkeleton />}>
              <UserEducation education={user.education} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<UserProfileSkeleton />}>
              <UserSkills skills={user.skills} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<UserProfileSkeleton />}>
              <UserJobPreferences jobPreferences={user.jobPreferences} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<UserResumeSkeleton />}>
              <UserResume defaultResume={defaultResume} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <AppliedJobs
              initialJobs={user.jobs}
              totalJobs={totalJobs}
              limit={JOB_LIMIT}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
