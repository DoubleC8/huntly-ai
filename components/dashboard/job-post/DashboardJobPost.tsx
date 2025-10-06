import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Job } from "@/app/generated/prisma";
import { STAGE_COLORS, STAGE_LABELS } from "@/app/constants/jobStage";
import JobPostHeader from "./JobPostHeader";
import JobPostDescription from "./JobPostDescription";
import JobPostFooter from "./JobPostFooter";

export default function DashboardJobPost({ job }: { job: Job }) {
  return (
    <Card
      key={job.id}
      className={`bg-[var(--background)] flex ${job.stage ? "pt-0" : ""}`}
    >
      {job.stage && job.stage !== "DEFAULT" ? (
        <div
          className="w-full h-1/10 rounded-t-xl px-6 py-1"
          style={{ backgroundColor: `var(${STAGE_COLORS[job.stage]})` }}
        >
          <p className="text-[var(--background)] font-bold">
            {STAGE_LABELS[job.stage]}
          </p>
        </div>
      ) : (
        <div className="w-full h-1/10 rounded-t-xl px-6 py-1"></div>
      )}
      <CardHeader>
        <JobPostHeader
          jobCompany={job.company}
          jobTitle={job.title}
          jobPostedAt={job.postedAt ?? new Date()}
          jobCreatedAt={job.postedAt ?? new Date()}
          jobId={job.id}
          jobStage={job.stage}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <JobPostDescription
          jobSalaryMin={job.salaryMin}
          jobSalaryMax={job.salaryMax}
          jobCurrency={job.currency}
          jobAiSummary={job.aiSummary ?? ""}
        />
      </CardContent>
      <CardFooter
        className="lg:flex-row lg:gap-0
      flex-col gap-3 justify-between text-sm text-muted-foreground"
      >
        <JobPostFooter
          jobLocation={job.location}
          jobEmployment={job.employment}
          jobRemoteType={job.remoteType}
          jobId={job.id}
          jobNote={job.note ?? ""}
        />
      </CardFooter>
    </Card>
  );
}
