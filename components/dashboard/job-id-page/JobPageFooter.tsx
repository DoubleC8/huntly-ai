import { JobStage } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { STAGE_MESSAGES, STAGE_ORDER } from "@/lib/config/jobStage";
import Link from "next/link";

export default function JobPageFooter({
  jobSourceUrl,
  jobStage,
}: {
  jobSourceUrl: string;
  jobStage: JobStage;
}) {
  const applied =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) >= STAGE_ORDER.indexOf("APPLIED");

  return (
    <div className="grid grid-cols-1 gap-3">
      <div
        className="md:w-1/2 md:mx-auto
        w-full grid grid-cols-2 gap-3"
      >
        <a href={jobSourceUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full">
            {applied ? "View Job" : "Apply Now"}
          </Button>
        </a>
        <Link href="/jobs/dashboard">
          <Button variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground text-center">
        <span
          className={
            jobStage === JobStage.REJECTED ? "text-[var(--app-red)]" : ""
          }
        >
          {STAGE_MESSAGES[jobStage]}
        </span>
      </p>
    </div>
  );
}
