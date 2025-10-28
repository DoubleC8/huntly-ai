"use client";

import { getUserProfileData } from "@/app/actions/profile/get/getUserInfo";
import { JOB_LIMIT } from "@/lib/constants/profile";
import { useQuery } from "@tanstack/react-query";


interface UseGetUserInfoParams {
  email: string;
  page?: number;
  limit?: number;
}

export function useGetUserInfo({ email, page = 1, limit = JOB_LIMIT}: UseGetUserInfoParams){
    return useQuery({
        queryKey: ["userProfile", email, page, limit], 
        queryFn: async () => {
            if(!email) throw new Error("Email is required to fetch profile data");
            return await getUserProfileData({ email, page, limit })
        }, 
        enabled: !!email, //only fetch if email is provided
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000, 
    });
}