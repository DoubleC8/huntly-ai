import { formatSalary } from "@/lib/utils";

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
  // Check if salary information is available
  const hasValidSalary = jobSalaryMin > 0 || jobSalaryMax > 0;

  // Format salary display
  const salaryDisplay = hasValidSalary ? (
    <p className="text-muted-foreground text-sm">
      {jobSalaryMin > 0 && jobSalaryMax > 0 ? (
        <>
          ${formatSalary(jobSalaryMin)} - ${formatSalary(jobSalaryMax)}{" "}
          {jobCurrency}
        </>
      ) : jobSalaryMin > 0 ? (
        <>
          ${formatSalary(jobSalaryMin)}+ {jobCurrency}
        </>
      ) : (
        <>
          Up to ${formatSalary(jobSalaryMax)} {jobCurrency}
        </>
      )}
    </p>
  ) : (
    <p className="text-muted-foreground text-sm italic">
      Huntly could not Extract Salary Information
    </p>
  );

  return (
    <>
      {salaryDisplay}
      <p>{jobAiSummary}</p>
    </>
  );
}
