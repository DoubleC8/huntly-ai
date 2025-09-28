import { Resume } from "@/app/generated/prisma";

import DefaultResume from "../DefaultResume";

export default function UserResume({
  defaultResume,
}: {
  defaultResume: Resume;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-xl">Default Resume</h2>
      {defaultResume ? (
        <>
          <DefaultResume resume={defaultResume} />

          <p className="text-muted-foreground text-center">
            This is your{" "}
            <strong className="text-[var(--app-blue)]">Default Resume</strong>.
            It’s the one Huntly AI will use to calculate match scores when
            comparing you to job listings. You can change your default resume at
            any time in the Resume tab.
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
  );
}
