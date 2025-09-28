import { Job } from "@/app/generated/prisma";
import JobsTable from "../JobsTable";

export default function AppliedJobs({ appliedJobs }: { appliedJobs: Job[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-xl">Jobs You have Applied to</h2>
      {appliedJobs.length ? (
        <>
          <JobsTable jobs={appliedJobs} />
          {appliedJobs.length > 1 ? (
            <p className="text-muted-foreground text-center">
              You've applied to{" "}
              <strong className="text-[var(--app-blue)]">
                {appliedJobs.length}
              </strong>{" "}
              jobs so far! Congrats!
            </p>
          ) : (
            <p className="text-muted-foreground text-center">
              You've applied to{" "}
              <strong className="text-[var(--app-blue)]">
                {appliedJobs.length}
              </strong>{" "}
              job so far! Congrats! Keep Going!
            </p>
          )}
        </>
      ) : (
        <p className="text-muted-foreground">
          You haven’t applied to any jobs yet. Once you do, they’ll show up
          here!
        </p>
      )}
    </div>
  );
}
