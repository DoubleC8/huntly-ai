import CompanyLogo from "@/components/ui/CompanyLogo";
import StarButton from "../buttons/StarButton";
import RejectedButton from "../buttons/RejectedButton";
import { JobStage } from "@/app/generated/prisma";
import UpdateJobStageButton from "../buttons/UpdateJobStageButton";
import { formatJobDate } from "@/lib/utils";

export default function JobPostHeader({
  jobCompany,
  jobTitle,
  jobPostedAt,
  jobCreatedAt,
  jobId,
  jobStage,
}: {
  jobCompany: string;
  jobTitle: string;
  jobPostedAt: Date;
  jobCreatedAt: Date;
  jobId: string;
  jobStage: JobStage;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3 items-center justify-center">
        <CompanyLogo
          company={jobCompany}
          jobTitle={jobTitle}
          width={65}
          height={65}
          className="rounded-lg"
        />
        <div>
          <h2 className="text-xl font-bold">{jobTitle}</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            {jobCompany}
          </div>

          {jobPostedAt ? (
            <p className="text-sm text-muted-foreground">
              Posted {formatJobDate(jobPostedAt)}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              We found this job for you {formatJobDate(jobCreatedAt)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StarButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
        />
        <UpdateJobStageButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
        />
        <RejectedButton
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          jobId={jobId}
          jobStage={jobStage}
        />
      </div>
    </div>
  );
}
