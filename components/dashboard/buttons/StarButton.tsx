"use client";
import { useState } from "react";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { JobStage } from "@/app/generated/prisma";
import { useUpdateJobStage } from "@/lib/hooks/jobs/useUpdateJobStage";

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
  const [isWishlisted, setIsWishlisted] = useState(
    jobStage === JobStage.WISHLIST
  );

  const mutation = useUpdateJobStage();

  const handleStarClick = async () => {
    setIsWishlisted((prev) => !prev);

    try {
      const updatedJob = await mutation.mutateAsync({
        type: "toggleWishlist",
        jobId,
      });

      setIsWishlisted(updatedJob.stage === JobStage.WISHLIST);

      toast.success(
        updatedJob.stage === JobStage.WISHLIST
          ? `${jobTitle} @${jobCompany} added to Wishlist!`
          : `${jobTitle} @${jobCompany} removed from Wishlist.`
      );
    } catch {
      // revert if error
      setIsWishlisted((prev) => !prev);
      toast.error("Failed to toggle wishlist.", {
        description: "Please try again later.",
      });
    }
  };

  // Only show star if job is not yet applied or earlier
  const showButton =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) < STAGE_ORDER.indexOf("APPLIED");

  if (!showButton) return null;

  return (
    <button
      onClick={handleStarClick}
      disabled={mutation.isPending} //is pending is part of useQuery
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
