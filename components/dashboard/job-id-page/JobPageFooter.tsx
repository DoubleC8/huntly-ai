import { STAGE_ORDER } from "@/app/constants/jobStage";
import { JobStage } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
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

  let message: string;

  switch (jobStage) {
    case JobStage.WISHLIST:
      message = "You have Wishlisted this Job.";
      break;
    case JobStage.APPLIED:
      message = "You have Applied for this Job.";
      break;
    case JobStage.INTERVIEW:
      message = "You are currently Interviewing for this Job.";
      break;
    case JobStage.OFFER:
      message =
        "You have have been offered a position at this company. Go Celebrate!";
      break;
    default:
      message = "Try applying to this job today!";
  }

  return (
    <div className="w-full flex flex-col justify-center gap-3">
      <div className="w-full flex gap-3 mx-auto justify-center ">
        <a
          href={jobSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="md:w-1/6
            w-1/2"
        >
          <Button className="w-full">
            {applied ? "View Job" : "Apply Now"}
          </Button>
        </a>
        <Link
          href="/jobs/dashboard"
          className="md:w-1/6 
          w-1/2"
        >
          <Button variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
}
