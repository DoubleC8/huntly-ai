import { Resume } from "@/app/generated/prisma";

import DefaultResume from "./DefaultResume";
import Link from "next/link";

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
        <p className="text-muted-foreground">
          No <strong className="text-[var(--app-blue)]">Default Resume</strong>{" "}
          found. Add one to get started.
          <br /> Go to{" "}
          <Link
            href={"/jobs/resume"}
            className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]"
          >
            Resume Page
          </Link>
          .
        </p>
      )}
    </div>
  );
}
