import { Button } from "@/components/ui/button";
import AppliedButton from "../buttons/AppliedButton";
import InterviewingButton from "../buttons/InterviewingButton";
import OfferedPostitionButton from "../buttons/OfferedPositionButon";
import RejectedButton from "../buttons/RejectedButton";
import ShareJobButton from "../buttons/ShareJob";
import StarButton from "../buttons/StarButton";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_MESSAGES } from "@/app/constants/jobStage";

export default function JobPageNavbar({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
  jobSourceUrl,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage;
  jobSourceUrl: string;
}) {
  return (
    <div
      className="md:justify-between
      flex w-full gap-3 items-center justify-center"
    >
      <div>
        <RejectedButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
        />
      </div>

      <p
        className="md:block 
      text-muted-foreground hidden"
      >
        <span
          className={
            jobStage === JobStage.REJECTED ? "text-[var(--app-red)]" : ""
          }
        >
          {STAGE_MESSAGES[jobStage]}
        </span>
      </p>

      {/**job stage buttons */}
      <div className="flex items-center gap-3">
        <StarButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
        />
        <AppliedButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
          compact={false}
        />
        <InterviewingButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
          compact={false}
        />
        <OfferedPostitionButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
          compact={false}
        />
        <ShareJobButton jobSourceUrl={jobSourceUrl} />
        <a target="_blank" href={`${jobSourceUrl}`} rel="noopener noreferrer">
          <Button className="w-40">Apply Now</Button>
        </a>
      </div>
    </div>
  );
}
