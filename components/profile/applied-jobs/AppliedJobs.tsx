"use client";

import { Job } from "@/app/generated/prisma";
import JobsTable from "./JobsTable";
import Link from "next/link";
import { AppliedJobsPaginationBar } from "./AppliedJobsPaginationBar";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { getPaginatedJobs } from "@/app/actions/profile/get/getPaginatedJobs";
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
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalJobs / limit);

  useEffect(() => {
    startTransition(async () => {
      const { jobs } = await getPaginatedJobs(currentPage, limit);
      setJobs(jobs);
    });
  }, [currentPage, limit]);

  if (jobs.length === 0 && !isPending) {
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
        {isPending ? <JobsTableSkeleton /> : <JobsTable jobs={jobs} />}

        <AppliedJobsPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
        />

        {totalJobs > 0 && (
          <p className="text-muted-foreground text-center">
            You’ve applied to{" "}
            <strong className="text-[var(--app-blue)]">{totalJobs}</strong>{" "}
            {totalJobs === 1 ? "job" : "jobs"} so far! Keep it up!
          </p>
        )}
      </div>
    </div>
  );
}
