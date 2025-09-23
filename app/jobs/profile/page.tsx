import { auth } from "@/auth";
import DefaultResume from "@/components/profile/DefaultResume";
import JobPreferences from "@/components/profile/JobPreferences";
import JobsTable from "@/components/profile/JobsTable";
import UserInfo from "@/components/profile/user-info/UserInfo";
import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";

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
      jobPreferences: true,
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
  return (
    <div className="page">
      <div className="pageTitleContainer">
        <h1 className="pageTitle">Profile</h1>
      </div>

      <div className="pageContainer">
        <div className="bg-[var(--background)] h-fit min-h-[100vh] rounded-3xl shadow-md p-5 flex flex-col gap-3">
          {/**user info section */}
          <UserInfo user={user} />

          {/**user resume section */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">Default Resume</h2>
            {defaultResume ? (
              <>
                <DefaultResume resume={user.resumes[0]} />

                <p className="text-muted-foreground">
                  This is your{" "}
                  <span className="font-semibold">default resume</span>. It’s
                  the one Huntly AI will use to calculate match scores when
                  comparing you to job listings. You can change your default
                  resume at any time in the Resume tab.
                </p>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">
                  No default resume found. Upload a resume to get started! (
                  <a
                    href="/jobs/resume"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    Go to Resume Tab
                  </a>
                  )
                </p>
              </div>
            )}
          </div>

          {/**user job table */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">Jobs You have Applied to</h2>
            {user?.jobs?.length ? (
              <>
                <JobsTable jobs={user.jobs} />
                {user.jobs.length > 1 ? (
                  <p className="text-muted-foreground">
                    You've applied to {user?.jobs.length} jobs so far! Congrats!
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    You've applied to {user?.jobs.length} job so far! Congrats!
                    Keep Going!
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                You haven’t applied to any jobs yet. Once you do, they’ll show
                up here!
              </p>
            )}
          </div>

          {/**user job preferences */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">Job Preferences</h2>
            {user?.jobPreferences.length ? (
              <JobPreferences />
            ) : (
              <p className="text-muted-foreground">
                No job preferences set yet. Add some job titles you would be
                interested in and let Huntly Ai find jobs based on these titles!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
