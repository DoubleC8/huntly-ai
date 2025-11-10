import { getCurrentUserEmail } from "@/lib/auth-helpers";

import JobPageNavbar from "@/components/dashboard/job-id-page/JobPageNavbar";
import JobPageHeader from "@/components/dashboard/job-id-page/JobPageHeader";
import JobPageDescription from "@/components/dashboard/job-id-page/JobPageDescription";
import JobPageNotes from "@/components/dashboard/job-id-page/JobPageNotes";
import JobPageFooter from "@/components/dashboard/job-id-page/JobPageFooter";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getUserByEmail } from "@/app/actions/profile/get/getUserInfo";
import { getJobById } from "@/app/actions/jobs/getJobs";
import DashboardCard from "@/components/dashboard/cards/DashboardCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const email = await getCurrentUserEmail();
  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const { id } = await params;
  const job = await getJobById(id);
  if (!job) {
    return (
      <DashboardCard
        message="Hmm... Job Not Found"
        description="Looks like this job took a day off — or maybe the link’s a bit wonky. 
        Try heading back to your dashboard and picking another one!"
      />
    );
  }

  return (
    <div className="pageContainer">
      <ErrorBoundary>
        {/**contains buttons and dropdown  */}
        <JobPageNavbar
          jobTitle={job.title}
          jobCompany={job.company}
          jobId={job.id}
          jobStage={job.stage}
          jobSourceUrl={job.sourceUrl}
        />
      </ErrorBoundary>
      <div className="bg-[var(--background)] h-fit min-h-[100vh] rounded-3xl shadow-md p-3 flex flex-col gap-3 justify-between">
        <ErrorBoundary>
          {/**job header, contains job image, rank score, ai summary etc... */}
          <JobPageHeader
            jobTitle={job.title}
            jobCompany={job.company}
            jobPostedAt={job.postedAt ?? new Date()}
            jobCreatedAt={job.postedAt ?? new Date()}
            jobAiSummary={job.aiSummary ?? ""}
            jobLocation={job.location}
            jobEmployment={job.employment}
            jobRemoteType={job.remoteType}
            jobMatchScore={job.matchScore}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          {/**description contains job description, responsibilities, etc */}
          <JobPageDescription
            jobDescription={job.description}
            jobResponsibilities={job.responsibilities}
            jobQualifications={job.qualifications}
            jobSkills={job.skills}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          {/**notes */}
          <JobPageNotes jobId={job.id} initialNote={job.note} />
        </ErrorBoundary>
        <ErrorBoundary>
          {/**apply/go back to dashboard button */}
          <JobPageFooter jobSourceUrl={job.sourceUrl} jobStage={job.stage} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
