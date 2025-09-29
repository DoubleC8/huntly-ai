import { Job } from "@/app/generated/prisma";
import JobsTable from "./JobsTable";
import Link from "next/link";

export default function AppliedJobs({ jobs }: { jobs: Job[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-xl">Jobs You have Applied to</h2>
      {jobs.length ? (
        <>
          <JobsTable jobs={jobs} />
          {jobs.length > 1 ? (
            <p className="text-muted-foreground text-center">
              You've applied to{" "}
              <strong className="text-[var(--app-blue)]">{jobs.length}</strong>{" "}
              jobs so far! Congrats!
            </p>
          ) : (
            <p className="text-muted-foreground text-center">
              You've applied to{" "}
              <strong className="text-[var(--app-blue)]">{jobs.length}</strong>{" "}
              job so far! Congrats! Keep Going!
            </p>
          )}
        </>
      ) : (
        <p className="text-muted-foreground">
          You haven’t applied to any jobs yet. Once you do, they’ll show up
          here! Try applying to one today! <br /> Go to{" "}
          <Link
            href={"/jobs/dashboard"}
            className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]"
          >
            Dashboard
          </Link>
          .
        </p>
      )}
    </div>
  );
}
