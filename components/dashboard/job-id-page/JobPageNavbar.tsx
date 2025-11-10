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
  return (
    <div>
      {/**job stage buttons */}
      <div className="w-full flex gap-3 flex-col">
        <div className="flex w-full items-center justify-between">
          <RejectedButton
            jobTitle={jobTitle}
            jobCompany={jobCompany}
            jobId={jobId}
            jobStage={jobStage}
          />
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
        </div>
        <div className="w-full flex items-center justify-end">
          <ShareJobButton jobSourceUrl={jobSourceUrl} />
        </div>
      </div>
    </div>
  );
}
