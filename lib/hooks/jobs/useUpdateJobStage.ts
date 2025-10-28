"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/lib/services/jobService";
import { JobStage } from "@/app/generated/prisma";

type UpdateJobPayload = 
  | { type: "setStage"; jobId: string; stage: JobStage }
  | { type: "toggleWishlist"; jobId: string }
  | { type: "setNote"; jobId: string; note: string };

/**
 * Generic mutation hook for any job update (stage change, wishlist toggle, etc.)
 * Handles cache invalidation and error logging in one place.
 */
export function useUpdateJobStage() {
  const queryClient = useQueryClient();

  return useMutation({
    // the actual async function to run
    mutationFn: async (payload: UpdateJobPayload) => {
      switch (payload.type) {
        case "setStage":
          return jobService.setStage(payload.jobId, payload.stage);
        case "toggleWishlist":
          return jobService.toggleWishlist(payload.jobId);
        case "setNote":
          return jobService.setNote(payload.jobId, payload.note);
        default:
          throw new Error(`Unknown job update type: ${(payload as UpdateJobPayload).type}`);
      }
    },

    // on success: refresh cached counts everywhere
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobStageCounts"] });
    },

    // optional global error fallback
    onError: (error) => {
      console.error("Job update failed:", error);
    },
  });
}