"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import {
  STAGE_COLORS,
  STAGE_LABELS,
  STAGE_ICONS,
} from "@/app/constants/jobStage";
import { LoaderCircle } from "lucide-react";
import { updateJob } from "@/app/actions/job-post/updateJob";

export default function UpdateJobStageButton({
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

  const allowedStages: JobStage[] = [
    JobStage.APPLIED,
    JobStage.INTERVIEW,
    JobStage.OFFER,
  ];

  const initialStage =
    jobStage && allowedStages.includes(jobStage) ? jobStage : JobStage.DEFAULT;

  const [currentStage, setCurrentStage] = useState<JobStage>(initialStage);

  let nextStage: JobStage;

  if (currentStage === JobStage.DEFAULT || currentStage === JobStage.WISHLIST) {
    nextStage = JobStage.APPLIED;
  } else {
    const currentIndex = allowedStages.indexOf(currentStage);
    nextStage =
      currentIndex >= 0 && currentIndex < allowedStages.length - 1
        ? allowedStages[currentIndex + 1]
        : JobStage.OFFER;
  }

  const handleUpdateJobStage = () => {
    startTransition(async () => {
      try {
        await updateJob({
          type: "setStage",
          jobId,
          stage: nextStage,
        });

        setCurrentStage(nextStage);

        toast.success(
          `${jobTitle} at ${jobCompany} has been marked as ${STAGE_LABELS[nextStage]}`
        );
      } catch {
        toast.error(`Failed to mark as ${STAGE_LABELS[nextStage]}.`, {
          description: "Please try again later.",
        });
      }
    });
  };

  // The icon should show the NEXT stage — not current one
  const isMaxStage = currentStage === JobStage.OFFER;
  const NextIcon = STAGE_ICONS[nextStage];

  return (
    <button
      onClick={handleUpdateJobStage}
      disabled={isPending || isMaxStage}
      aria-pressed={isMaxStage}
      className="transition-colors"
      style={{
        color: isMaxStage
          ? `var(${STAGE_COLORS[nextStage]})`
          : "var(--muted-foreground)",
      }}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <NextIcon className="hover:opacity-80" />
      )}
    </button>
  );
}
