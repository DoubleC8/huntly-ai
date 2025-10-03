"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateJob } from "@/app/actions/job-post/updateJob";

export default function AppliedButton({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
  compact,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage | null;
  compact: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isApplied, setIsApplied] = useState(jobStage === JobStage.APPLIED);

  const handleApply = () => [
    startTransition(async () => {
      try {
        await updateJob({
          type: "setStage",
          jobId,
          stage: JobStage.APPLIED,
        });
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
    STAGE_ORDER.indexOf(jobStage) < STAGE_ORDER.indexOf(JobStage.APPLIED);
  if (!showButton) return null;

  return compact ? (
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
  ) : (
    <Button
      onClick={handleApply}
      disabled={isPending || isApplied}
      aria-pressed={isApplied}
      title={
        isApplied ? "You Applied for this Job" : "Mark this job as Applied."
      }
      className="md:block
      hidden w-40 bg-[var(--app-dark-purple)] hover:bg-[var(--app-dark-purple)]/85"
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isApplied ? (
        "Applied"
      ) : (
        "Mark as Applied"
      )}
    </Button>
  );
}
