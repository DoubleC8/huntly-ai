import { formatSalary } from "@/lib/date-utils";

export default function JobPostDescription({
  jobSalaryMin,
  jobSalaryMax,
  jobCurrency,
  jobAiSummary,
}: {
  jobSalaryMin: number;
  jobSalaryMax: number;
  jobCurrency: string;
  jobAiSummary: string;
}) {
  return (
    <>
      <p className="text-muted-foreground text-sm">
        ${formatSalary(jobSalaryMin)} - ${formatSalary(jobSalaryMax)}{" "}
        {jobCurrency}
      </p>
      <p>{jobAiSummary}</p>
    </>
  );
}
