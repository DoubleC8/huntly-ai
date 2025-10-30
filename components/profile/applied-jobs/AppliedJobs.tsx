"use client";

import { Job } from "@/app/generated/prisma";
import JobsTable from "./JobsTable";
import Link from "next/link";
import { AppliedJobsPaginationBar } from "./AppliedJobsPaginationBar";
import { useSearchParams } from "next/navigation";

import { usePaginatedJobs } from "@/lib/hooks/profile/usePaginatedJobs";
import JobsTableSkeleton from "../ui/JobsTableSkeleton";

export default function AppliedJobs({
  initialJobs,
  totalJobs,
  limit,
}: {
  initialJobs: Job[];
  totalJobs: number;
  limit: number;
}) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Use React Query with initial data for SSR hydration
  const { data, isLoading, isPending } = usePaginatedJobs(currentPage, limit);

  // Use React Query data if available, otherwise fall back to initialJobs
  const jobs = data?.jobs ?? initialJobs;
  const finalTotalJobs = data?.totalJobs ?? totalJobs;

  if (jobs.length === 0 && !isLoading && !isPending) {
    return (
      <p className="text-muted-foreground">
        You haven’t applied to any jobs yet. Once you do, they’ll show up here!
        Try applying to one today! <br /> Go to{" "}
        <Link
          href={"/jobs/dashboard"}
          className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]"
        >
          Dashboard
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-xl">Jobs You have Applied to</h2>

      <div className="flex flex-col items-center gap-3">
        {isLoading || isPending ? (
          <JobsTableSkeleton />
        ) : (
          <JobsTable jobs={jobs} />
        )}

        <AppliedJobsPaginationBar
          currentPage={currentPage}
          totalPages={Math.ceil(finalTotalJobs / limit)}
        />

        {finalTotalJobs > 0 && (
          <p className="text-muted-foreground text-center">
            You've applied to{" "}
            <strong className="text-[var(--app-blue)]">{finalTotalJobs}</strong>{" "}
            {finalTotalJobs === 1 ? "job" : "jobs"} so far! Keep it up!
          </p>
        )}
      </div>
    </div>
  );
}
