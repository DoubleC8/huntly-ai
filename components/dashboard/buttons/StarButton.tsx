"use client";
import { useState, useTransition } from "react";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { toggleWishlist } from "@/app/actions/toggleWishlist";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { JobStage } from "@/app/generated/prisma";

export default function StarButton({
  jobId,
  jobStage,
}: {
  jobId: string;
  jobStage: JobStage | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [isWishlisted, setIsWishlisted] = useState(jobStage === "WISHLIST");

  const handleStarClick = () => {
    setIsWishlisted((prev) => !prev);

    startTransition(async () => {
      try {
        const updatedJob = await toggleWishlist(jobId);
        setIsWishlisted(updatedJob.stage === "WISHLIST");
        toast.success(
          updatedJob.stage === "WISHLIST"
            ? "Job added to Wishlist!"
            : "Job removed from Wishlist."
        );
      } catch (error) {
        setIsWishlisted((prev) => !prev);
        toast.error("Failed to toggle wishlist.");
      }
    });
  };

  // Only show star if job is not yet applied or earlier
  const showStar =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) < STAGE_ORDER.indexOf("APPLIED");

  if (!showStar) return null;

  return jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) < STAGE_ORDER.indexOf("APPLIED") ? (
    <button
      onClick={handleStarClick}
      disabled={isPending}
      className="hover:cursor-pointer"
      aria-pressed={isWishlisted}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isWishlisted ? (
        <Star fill="yellow" className="text-[var(--app-yellow)]" />
      ) : (
        <Star className="hover:text-[var(--app-yellow)]" />
      )}
    </button>
  ) : null;
}
