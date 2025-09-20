import { auth } from "@/auth";
import JobsTable from "@/components/profile/JobsTable";
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
        <div className="bg-[var(--background)] h-fit min-h-[100vh] rounded-3xl shadow-md p-3 flex flex-col gap-3">
          {/**user info section */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">{user.name}</h2>
            <p>{user.email}</p>
            <h2 className="font-bold text-lg">Education</h2>
            <p>{user.email}</p>
            <h2 className="font-bold text-lg">Skills</h2>
            <p>{user.email}</p>
          </div>

          {/**user resume section */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">Your Default Resume</h2>
            <div className="flex items-center gap-1">
              <Star fill="yellow" className="text-[var(--app-yellow)]" />
              <a
                target="_blank"
                href={defaultResume.publicUrl}
                rel="noopener noreferrer"
              >
                {defaultResume.fileName.split(".")[0]}
              </a>
            </div>
            <p className="text-muted-foreground">
              You can change your default resume at any time in the resume tab.
            </p>
          </div>

          {/**user job table */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">Jobs You have Applied to</h2>
            <JobsTable jobs={user.jobs} />
          </div>

          {/**user job preferences */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">Your Job Preferences</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
