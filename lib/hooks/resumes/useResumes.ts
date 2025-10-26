"use client";


import { getResumesByUserId } from "@/app/actions/resume/get/getResumes";
import { useQuery } from "@tanstack/react-query";

export function useResumes(userId: string){
    return useQuery({
        queryKey: ["resumes", userId], 
        queryFn: () => getResumesByUserId(userId), 
    })
}