import { Button } from "@/components/ui/button";
import RejectedButton from "../buttons/RejectedButton";
import ShareJobButton from "../buttons/ShareJob";
import StarButton from "../buttons/StarButton";
import { JobStage } from "@/app/generated/prisma";

import UpdateJobStageDropdown from "../buttons/UpdateJobStageDropdown";
import { STAGE_MESSAGES, STAGE_ORDER } from "@/lib/config/jobStage";

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
  const applied =
    jobStage === null ||
    STAGE_ORDER.indexOf(jobStage) >= STAGE_ORDER.indexOf("APPLIED");
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
      <div className="w-full flex gap-3 flex-col">
        <div className="flex items-center w-full justify-between">
          <StarButton
            jobTitle={jobTitle}
            jobCompany={jobCompany}
            jobId={jobId}
            jobStage={jobStage}
          />
          <UpdateJobStageDropdown
            jobTitle={jobTitle}
            jobCompany={jobCompany}
            jobId={jobId}
            jobStage={jobStage}
          />
        </div>{" "}
        <div className="w-full flex justify-end">
          <ShareJobButton jobSourceUrl={jobSourceUrl} />
        </div>
      </div>
    </div>
  );
}
