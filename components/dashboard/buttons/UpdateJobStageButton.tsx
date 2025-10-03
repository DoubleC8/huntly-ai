"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import {
  STAGE_COLORS,
  STAGE_LABELS,
  STAGE_ORDER,
} from "@/app/constants/jobStage";
import { CircleCheck, LoaderCircle, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateJob } from "@/app/actions/job-post/updateJob";

export default function UpdateJobStageButton({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
  compact = false,
  targetJobStage, // optional now
  Icon,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage | null;
  compact?: boolean;
  targetJobStage?: JobStage;
  Icon: LucideIcon;
}) {
  const [isPending, startTransition] = useTransition();
  const [currentStage, setCurrentStage] = useState<JobStage | null>(jobStage);

  // If target not given, pick the "next stage" in STAGE_ORDER
  const currentIndex = STAGE_ORDER.indexOf(currentStage ?? JobStage.DEFAULT);
  const nextStage =
    targetJobStage ??
    (currentIndex >= 0 && currentIndex < STAGE_ORDER.length - 1
      ? STAGE_ORDER[currentIndex + 1]
      : JobStage.DEFAULT); // fallback if at end

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

  const isTargetStage = currentStage === nextStage;

  return compact ? (
    <button
      onClick={handleUpdateJobStage}
      disabled={isPending || isTargetStage}
      aria-pressed={isTargetStage}
      className="transition-colors"
      style={{
        color: isTargetStage
          ? `var(${STAGE_COLORS[nextStage]})`
          : "var(--muted-foreground)",
      }}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isTargetStage ? (
        <Icon />
      ) : (
        <Icon className="hover:opacity-80" />
      )}
    </button>
  ) : (
    <Button
      onClick={handleUpdateJobStage}
      disabled={isPending || isTargetStage}
      aria-pressed={isTargetStage}
      style={{
        backgroundColor: isTargetStage
          ? `var(${STAGE_COLORS[nextStage]})`
          : "var(--app-dark-purple)",
      }}
      className="hidden md:block w-40 hover:opacity-85"
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isTargetStage ? (
        STAGE_LABELS[nextStage]
      ) : (
        `Mark as ${STAGE_LABELS[nextStage]}`
      )}
    </Button>
  );
}
