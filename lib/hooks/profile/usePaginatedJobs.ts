"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaginatedJobs } from "@/app/actions/profile/get/getPaginatedJobs";

/**
 * React Query hook for fetching paginated applied jobs
 * Automatically handles caching, loading states, and refetching
 */
export function usePaginatedJobs(page: number, limit: number) {
  return useQuery({
    queryKey: ["profileJobs", page, limit],
    queryFn: () => getPaginatedJobs(page, limit),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

