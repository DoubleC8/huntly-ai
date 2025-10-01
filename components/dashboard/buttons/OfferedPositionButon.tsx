"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { PartyPopper } from "lucide-react";
import { setJobasOfferedPostion } from "@/app/actions/job-post/updateJobStage";

export default function OfferedPostitionButton({
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
  const [isOfferedPostion, setIsOfferedPosition] = useState(
    jobStage === JobStage.OFFER
  );

  const handlePositionOffer = () => [
    startTransition(async () => {
      try {
        await setJobasOfferedPostion(jobId);
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

  return (
    <button
      onClick={handlePositionOffer}
      disabled={isPending || isOfferedPostion}
      aria-pressed={isOfferedPostion}
      title={
        isOfferedPostion
          ? "You were given a position at this Job."
          : "Mark this job as Offered Postion"
      }
    >
      {isOfferedPostion ? (
        <PartyPopper className="text-[var(--app-light-blue)]" />
      ) : (
        <PartyPopper className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-light-blue)] hover:cursor-pointer" />
      )}
    </button>
  );
}
