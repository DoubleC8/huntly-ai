import { PartyPopper } from "lucide-react";
import AddResumeButton from "./buttons/AddResumeButton";

export const RESUME_LIMIT = 10;

export default function ResumeNavbar({
  email,
  resumeCount,
}: {
  email: string;
  resumeCount: number;
}) {
  return (
    <div className="desktopAppPageNav">
      <div className="w-full flex gap-2 items-center justify-between">
        {resumeCount === RESUME_LIMIT ? (
          <p
            className="md:text-base
              text-sm font-semibold text-[var(--app-blue)] flex items-center gap-2"
          >
            <PartyPopper size={16} /> You’ve uploaded all {RESUME_LIMIT} resumes
            – You’re all set!
          </p>
        ) : (
          <div className="w-full flex items-center justify-between">
            <p
              className="md:text-base
              text-sm font-semibold text-muted-foreground"
            >
              <span
                style={{
                  color: resumeCount === RESUME_LIMIT ? "var(--app-blue)" : "",
                }}
              >
                {resumeCount}
              </span>
              <span className="text-[var(--app-blue)]"> / {RESUME_LIMIT} </span>
              Resumes Left
            </p>
            <AddResumeButton resumeCount={resumeCount} email={email} />
          </div>
        )}
      </div>
    </div>
  );
}
