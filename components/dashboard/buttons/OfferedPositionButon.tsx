"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { LoaderCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateJob } from "@/app/actions/job-post/updateJob";

export default function OfferedPostitionButton({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
  compact,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage;
  compact: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOfferedPostion, setIsOfferedPosition] = useState(
    jobStage === JobStage.OFFER
  );

  const handlePositionOffer = () => [
    startTransition(async () => {
      try {
        await updateJob({
          type: "setStage",
          jobId,
          stage: JobStage.OFFER,
        });
        toast.success(
          `${jobTitle} at ${jobCompany} has been marked as Interviewing.`,
          {
            description: "Congrats! Time to Celebrate!",
          }
        );
      } catch {
        toast.error("Failed to mark this job as Offered a Position.", {
          description: "Please try again later.",
        });
      }
    }),
  ];

  const showButton =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) === STAGE_ORDER.indexOf(JobStage.INTERVIEW);

  if (!showButton) return null;

  return compact ? (
    <button
      onClick={handlePositionOffer}
      disabled={isPending || isOfferedPostion}
      aria-pressed={isOfferedPostion}
      title={
        isOfferedPostion
          ? "You were offered a position"
          : "Mark this job as Offered"
      }
    >
      {isOfferedPostion ? (
        <PartyPopper className="text-[var(--app-light-blue)]" />
      ) : (
        <PartyPopper className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-light-blue)] hover:cursor-pointer" />
      )}
    </button>
  ) : (
    <Button
      onClick={handlePositionOffer}
      disabled={isPending || isOfferedPostion}
      aria-pressed={isOfferedPostion}
      title={
        isOfferedPostion
          ? "You were offered a position"
          : "Mark this job as Offered"
      }
      className="md:block
      hidden w-40"
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isOfferedPostion ? (
        "Offered Position"
      ) : (
        "Mark as Offered"
      )}
    </Button>
  );
}
