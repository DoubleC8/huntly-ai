"use client";

import { resumeService } from "@/lib/services/resumeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateResumePayload = 
  | { type: "updateResume"; resumeUrl: string; filename: string }
  | { type: "toggleDefaultResume"; resumeId: string }
  | { type: "setResumeJobTitle"; targetJobTitle: string; resumeId: string}
  | { type: "deleteResume";  resumeId: string, filePath: string };

export function useResumeMutations(){
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async(payload: UpdateResumePayload) => {
      switch(payload.type){
        case "updateResume":
          return resumeService.updateResume(
            payload.resumeUrl, payload.filename
          );
        case "toggleDefaultResume":
          return resumeService.toggleDefault(payload.resumeId);
        case "setResumeJobTitle":
          return resumeService.updateResumeJobTitle(
            payload.targetJobTitle, payload.resumeId
          );
        case "deleteResume":
          return resumeService.deleteResume(
            payload.resumeId, payload.filePath
          );
        default:
          throw new Error(`Unknown resume update type: ${(payload as UpdateResumePayload).type}`);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },


    // optional global error fallback
    onError: (error) => {
      console.error("Job update failed:", error);
    },

  })
}