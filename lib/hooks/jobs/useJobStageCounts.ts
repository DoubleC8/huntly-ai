"use client"

import { getJobStageCounts } from "@/app/actions/jobs/getJobStageCounts";
import { useQuery } from "@tanstack/react-query";

export function useJobStageCounts(){
    return useQuery({
        /**this says store the that the function (getJobStageCounts) returns under
        this jobStageCounts */
        queryKey: ["jobStageCounts"], 
        /**this is the function we are using to fetch the data, 
        in this case it is a server action */
        queryFn: getJobStageCounts, 
    })
}