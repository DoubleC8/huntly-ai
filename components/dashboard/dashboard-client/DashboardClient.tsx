"use client";

import { useJobSearch } from "@/lib/hooks/jobs/useJobSearch";

import { NoResultsFound } from "@/components/dashboard/cards/NoResultsFoundCard";
import ActiveFiltersBar from "../ActiveFiltersBar";
import RecommendedJobs from "../RecommendedJobs";
import JobsPostingsSkeleton from "@/components/ui/loaders/JobPostingsSkeleton";
import { NoJobsErrorCard } from "../cards/NoJobsErrorCard";

export default function DashboardClient({
  userId,
  filters,
}: {
  userId: string;
  filters: {
    searchQuery?: string;
    locationQuery?: string;
    employment?: string;
    remoteType?: string;
    salaryMin?: number;
  };
}) {
  const {
    data: jobs,
    isLoading,
    isError,
  } = useJobSearch({
    userId,
    ...filters,
  });

  if (isLoading) return <JobsPostingsSkeleton postings={5} />;

  if (isError)
    return (
      <div className="w-full h-full my-auto">
        <NoJobsErrorCard />
      </div>
    );

  if (!jobs?.length) return <NoResultsFound />;

  return (
    <>
      <ActiveFiltersBar />
      <RecommendedJobs jobs={jobs} />
    </>
  );
}
