"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { CircleCheck } from "lucide-react";
import { setJobAsApplied } from "@/app/actions/job-post/updateJobStage";

export default function AppliedButton({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [isApplied, setIsApplied] = useState(jobStage === "APPLIED");

  const handleApply = () => [
    startTransition(async () => {
      try {
        await setJobAsApplied(jobId);
        toast.success(
          `${jobTitle} at ${jobCompany} has been marked as Applied.`,
          {
            description: "Congrats and Good Luck!",
          }
        );
      } catch {
        toast.error("Failed to mark this job as Applied.", {
          description: "Please try again later.",
        });
      }
    }),
  ];

  const showButton =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) <= STAGE_ORDER.indexOf("APPLIED");
  if (!showButton) return null;

  return jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) <= STAGE_ORDER.indexOf("APPLIED") ? (
    <button
      onClick={handleApply}
      disabled={isPending || isApplied}
      aria-pressed={isApplied}
      title={
        isApplied ? "You Applied for this Job" : "Mark this job as Applied."
      }
    >
      {isApplied ? (
        <CircleCheck className="text-[var(--app-dark-purple)]" />
      ) : (
        <CircleCheck className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-dark-purple)] hover:cursor-pointer" />
      )}
    </button>
  ) : null;
}
