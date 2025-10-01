"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { CircleUser } from "lucide-react";
import { setJobAsInterviewing } from "@/app/actions/job-post/updateJobStage";

export default function InterviewingButton({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage;
}) {
  const [isPending, startTransition] = useTransition();
  const [isInterviewing, setIsInterviewing] = useState(
    jobStage === JobStage.INTERVIEW
  );

  const handleInterviewing = () => [
    startTransition(async () => {
      try {
        await setJobAsInterviewing(jobId);
        toast.success(
          `${jobTitle} at ${jobCompany} has been marked as Interviewing.`,
          {
            description: "Congrats and Good Luck!",
          }
        );
      } catch {
        toast.error("Failed to mark this job as Interviewing.", {
          description: "Please try again later.",
        });
      }
    }),
  ];

  const showButton =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) === STAGE_ORDER.indexOf(JobStage.APPLIED);

  if (!showButton) return null;

  return (
    <button
      onClick={handleInterviewing}
      disabled={isPending || isInterviewing}
      aria-pressed={isInterviewing}
      title={
        isInterviewing
          ? "You are Interviewing for this Job"
          : "Mark this job as Interviewing."
      }
    >
      {isInterviewing ? (
        <CircleUser className="text-[var(--app-blue)]" />
      ) : (
        <CircleUser className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-blue)] hover:cursor-pointer" />
      )}
    </button>
  );
}
