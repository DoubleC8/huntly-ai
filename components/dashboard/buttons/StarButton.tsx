"use client";
import { useState, useTransition } from "react";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { JobStage } from "@/app/generated/prisma";
import { updateJob } from "@/app/actions/job-post/updateJob";

export default function StarButton({
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
  const [isWishlisted, setIsWishlisted] = useState(
    jobStage === JobStage.WISHLIST
  );

  const handleStarClick = () => {
    setIsWishlisted((prev) => !prev);

    startTransition(async () => {
      try {
        const updatedJob = await updateJob({ type: "toggleWishlist", jobId });
        setIsWishlisted(updatedJob.stage === "WISHLIST");
        toast.success(
          updatedJob.stage === "WISHLIST"
            ? `${jobTitle} at ${jobCompany} added to Wishlist!`
            : `${jobTitle} at ${jobCompany} removed from Wishlist.`
        );
      } catch {
        setIsWishlisted((prev) => !prev);
        toast.error("Failed to toggle wishlist.", {
          description: "Please try again later.",
        });
      }
    });
  };

  // Only show star if job is not yet applied or earlier
  const showButton =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) < STAGE_ORDER.indexOf("APPLIED");

  if (!showButton) return null;

  return (
    <button
      onClick={handleStarClick}
      disabled={isPending}
      aria-pressed={isWishlisted}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isWishlisted ? (
        <Star
          fill="yellow"
          className="text-[var(--app-yellow)] hover:cursor-pointer ease-in-out duration-200"
        />
      ) : (
        <Star className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-yellow)] hover:cursor-pointer" />
      )}
    </button>
  );
}
