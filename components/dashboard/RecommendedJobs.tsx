"use client";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { Job } from "@/app/generated/prisma";
import DashboardJobPost from "./job-post/DashboardJobPost";

export default function RecommendedJobs({ jobs }: { jobs: Job[] }) {
  return (
    //error boundary is insise a client component
    <ErrorBoundary>
      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <DashboardJobPost job={job} key={job.id} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
