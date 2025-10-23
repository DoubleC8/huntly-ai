"use client";

import { useState } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import {
  STAGE_COLORS,
  STAGE_LABELS,
  STAGE_ICONS,
} from "@/app/constants/jobStage";
import { LoaderCircle } from "lucide-react";
import { useUpdateJobStage } from "@/lib/hooks/jobs/useUpdateJobStage";

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
  const allowedStages: JobStage[] = [
    JobStage.APPLIED,
    JobStage.INTERVIEW,
    JobStage.OFFER,
  ];

  const initialStage =
    jobStage && allowedStages.includes(jobStage) ? jobStage : JobStage.DEFAULT;

  const [currentStage] = useState<JobStage>(initialStage);

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

  const mutation = useUpdateJobStage();

  const handleUpdateJobStageClick = async () => {
    try {
      await mutation.mutateAsync({
        type: "setStage",
        stage: nextStage,
        jobId,
      });

      toast.success(
        `${jobTitle} @${jobCompany} added to ${STAGE_LABELS[nextStage]} list.`
      );
    } catch (error) {
      toast.error(`Failed to add job to ${STAGE_LABELS[nextStage]} list.`, {
        description: "Please try again later.",
      });
    }
  };

  // The icon should show the NEXT stage — not current one
  const isMaxStage = currentStage === JobStage.OFFER;
  const NextIcon = STAGE_ICONS[nextStage];

  return (
    <button
      onClick={handleUpdateJobStageClick}
      disabled={mutation.isPending || isMaxStage}
      title={`Mark as ${STAGE_LABELS[nextStage]}`}
      aria-pressed={isMaxStage}
      className="transition-colors ease-in-out duration-200 hover:cursor-pointer"
      style={{
        color: isMaxStage
          ? `var(${STAGE_COLORS[nextStage]})`
          : "var(--muted-foreground)",
      }}
    >
      {mutation.isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <NextIcon className="hover:opacity-80" />
      )}
    </button>
  );
}
