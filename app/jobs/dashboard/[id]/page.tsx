import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import DashboardCard from "@/components/dashboard/DashboardCard";
import JobPageNavbar from "@/components/dashboard/job-id-page/JobPageNavbar";
import JobPageHeader from "@/components/dashboard/job-id-page/JobPageHeader";
import JobPageDescription from "@/components/dashboard/job-id-page/JobPageDescription";
import JobPageNotes from "@/components/dashboard/job-id-page/JobPageNotes";
import JobPageFooter from "@/components/dashboard/job-id-page/JobPageFooter";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  if (!session.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User email not found.
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: {
      id,
    },
  });

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
      <JobPageNavbar
        jobTitle={job.title}
        jobCompany={job.company}
        jobId={job.id}
        jobStage={job.stage}
        jobSourceUrl={job.sourceUrl}
      />
      <div className="bg-[var(--background)] h-fit min-h-[100vh] rounded-3xl shadow-md p-3 flex flex-col gap-3 justify-between">
        <JobPageHeader
          jobTitle={job.title}
          jobCompany={job.company}
          jobPostedAt={job.postedAt ?? new Date()}
          jobCreatedAt={job.postedAt ?? new Date()}
          jobAiSummary={job.aiSummary ?? ""}
          jobLocation={job.location}
          jobEmployment={job.employment}
          jobRemoteType={job.remoteType}
        />
        {/**description */}
        <JobPageDescription
          jobDescription={job.description}
          jobResponsibilities={job.responsibilities}
          jobQualifications={job.qualifications}
          jobSkills={job.skills}
          jobTags={job.tags}
        />

        {/**notes */}
        <JobPageNotes jobId={job.id} initialNote={job.note} />
        {/**apply/go back to dashboard button */}
        <JobPageFooter jobSourceUrl={job.sourceUrl} jobStage={job.stage} />
      </div>
    </div>
  );
}
