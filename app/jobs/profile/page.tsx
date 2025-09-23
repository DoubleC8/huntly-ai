import { auth } from "@/auth";
import JobPreferences from "@/components/profile/JobPreferences";
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
        <div className="bg-[var(--background)] h-fit min-h-[100vh] rounded-3xl shadow-md p-3 flex flex-col gap-3">
          {/**user info section */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">{user.name}</h2>
            <p className="font-semibold">{user.email}</p>
            <h2 className="font-bold text-lg">Education</h2>
            {user.education?.length ? (
              <ul className="list-disc ml-5 space-y-1">
                {user?.education?.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No education details yet, upload a resume so Huntly Ai can
                extract them!
              </p>
            )}
            <h2 className="font-bold text-lg">Skills</h2>
            {user?.skills?.length ? (
              <ul className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <li
                    key={i}
                    className="px-2 py-1 rounded-md bg-muted text-sm text-muted-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No skills detected yet, try uploading a resume to get let Huntly
                Ai get your personalized skills.
              </p>
            )}
          </div>

          {/**user resume section */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xl">Default Resume</h2>
            {defaultResume ? (
              <>
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
