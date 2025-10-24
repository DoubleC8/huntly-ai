"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "@/app/actions/jobs/updateJob";

export function useUpdateJobStage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateJob, 
        onSuccess: () => {
            //marks any cached query with that key as “stale” and triggers a refetch the next time 
            // React Query thinks it’s appropriate. This is what keeps our data fresh 
            queryClient.invalidateQueries({ queryKey: ["jobStageCounts"] });
        }
    })
}