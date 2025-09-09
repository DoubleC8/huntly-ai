"use client";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { Job } from "@/app/generated/prisma";
import DashboardJobPost from "./DashboardJobPost";

export default function RecommendedJobs({ jobs }: { jobs: Job[] }) {
  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <DashboardJobPost job={job} key={job.id} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
