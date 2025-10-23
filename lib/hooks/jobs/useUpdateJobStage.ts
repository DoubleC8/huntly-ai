"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "@/app/actions/jobs/updateJob";

export function useUpdateJobStage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateJob, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobStageCounts"] });
        }
    })
}