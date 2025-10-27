"use client";

import { getResumesByUserId } from "@/app/actions/resume/get/getResumes";
import { useQuery } from "@tanstack/react-query";

export function useGetResumes(userId: string){
    return useQuery({
        queryKey: ["resumes", userId], 
        queryFn: () => getResumesByUserId(userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000, 
    })
}