import { auth } from "@/auth";
import AppliedJobs from "@/components/profile/applied-jobs/AppliedJobs";
import UserEducation from "@/components/profile/education/UserEducation";
import UserJobPreferences from "@/components/profile/job-preferences/UserJobPreferences";
import UserSkills from "@/components/profile/skills/UserSkills";
import UserInfo from "@/components/profile/user-info/UserInfo";
import UserResume from "@/components/profile/user-resume/UserResume";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

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
    include: {
      resumes: {
        where: {
          isDefault: true,
        },
      },
      jobs: {
        where: {
          stage: {
            in: ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"],
          },
        },
      },
      education: true,
    },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const defaultResume = user.resumes[0];
  console.log(user);
  return (
    <div className="page">
      <div className="pageTitleContainer">
        <h1 className="pageTitle">Profile</h1>
      </div>

      <div className="pageContainer">
        <div className="bg-[var(--background)] h-fit  rounded-3xl shadow-md p-5 flex flex-col gap-5">
          {/**user info section */}
          <UserInfo user={user} />

          <UserEducation education={user.education} />

          <UserSkills skills={user.skills} />

          <UserJobPreferences jobPreferences={user.jobPreferences} />

          {/**user resume section */}
          <UserResume defaultResume={defaultResume} />

          {/**user job table */}
          <AppliedJobs jobs={user.jobs} />
        </div>
      </div>
    </div>
  );
}
