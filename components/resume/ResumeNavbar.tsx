import { PartyPopper } from "lucide-react";
import ResumeUploadClient from "./ResumeUploadClient";
import { Resume } from "@/app/generated/prisma";

export default function ResumeNavbar({
  email,
  resumeCount,
  setResumes,
}: {
  email: string;
  resumeCount: number;
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>;
}) {
  return (
    <div className="desktopAppPageNav">
      <div className="w-full flex gap-2 items-center justify-between">
        {resumeCount === 5 ? (
          <p
            className="md:text-base
              text-sm font-semibold text-[var(--app-blue)] flex items-center gap-2"
          >
            <PartyPopper size={16} /> You’ve uploaded all 5 resumes – You’re all
            set!
          </p>
        ) : (
          <p
            className="md:text-base
              text-sm font-semibold text-muted-foreground"
          >
            <span
              style={{
                color: resumeCount === 5 ? "var(--app-blue)" : "",
              }}
            >
              {resumeCount}
            </span>
            <span className="text-[var(--app-blue)]"> / 5 </span>Resumes Left
          </p>
        )}
        <ResumeUploadClient
          email={email}
          resumeCount={resumeCount}
          setResumes={setResumes}
        />
      </div>
    </div>
  );
}
