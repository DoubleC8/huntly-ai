"use client";

import { useQuery } from "@tanstack/react-query";
import { searchJobs } from "@/app/actions/jobs/getJobs";

export function useJobSearch({
  userId,
  searchQuery,
  locationQuery,
  employment,
  remoteType,
  salaryMin,
}: {
  userId: string;
  searchQuery?: string;
  locationQuery?: string;
  employment?: string;
  remoteType?: string;
  salaryMin?: number;
}) {
  return useQuery({
    queryKey: ["jobSearch", userId, searchQuery, locationQuery, employment, remoteType, salaryMin],
    queryFn: () =>
      searchJobs({
        userId,
        searchQuery,
        locationQuery,
        employment,
        remoteType,
        salaryMin,
      }),
    enabled: !!userId,
  });
}