import { auth } from "@/auth";
import DashboardCard from "@/components/dashboard/DashboardCard";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";

import { JobStage } from "@/app/generated/prisma";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getUserByEmail } from "@/app/actions/profile/get/getUserInfo";
import { getJobsByStage } from "@/app/actions/jobs/getJobs";

// Define readable messages for each stage
const STAGE_CONTENT: Record<
  JobStage,
  { message: string; description: string }
> = {
  [JobStage.WISHLIST]: {
    message: "You haven’t wishlisted any jobs yet.",
    description:
      "Save interesting opportunities on the recommended jobs page and revisit them later.",
  },
  [JobStage.APPLIED]: {
    message: "You haven’t applied to any jobs yet.",
    description:
      "Once you mark them as applied, they’ll show up here to help track your progress.",
  },
  [JobStage.INTERVIEW]: {
    message: "You’re not interviewing anywhere yet.",
    description: "Keep applying — you’ll land an interview soon!",
  },
  [JobStage.OFFER]: {
    message: "No offers yet, but don’t worry!",
    description: "Keep up the momentum — you’re on the right track!",
  },
  // Optional: default fallbacks for unsupported stages
  [JobStage.REJECTED]: {
    message: "No rejected jobs yet.",
    description:
      "Keep going! Every rejection brings you closer to the right fit.",
  },
  [JobStage.DEFAULT]: {
    message: "No jobs in this stage.",
    description: "Start exploring jobs to get them here!",
  },
};

interface PageProps {
  params: Promise<{ stage: string }>;
}

export default async function StagePage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {session ? "User email not found." : "Please Sign In."}
      </div>
    );
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  // Await params and validate stage param
  const { stage: stageParam } = await params;
  const stageKey = stageParam.toUpperCase() as keyof typeof JobStage;
  const stage = JobStage[stageKey];

  if (!stage) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Invalid stage: {stageParam}
      </div>
    );
  }

  // Fetch jobs for that stage
  const jobs = await getJobsByStage(user.id, stage);
  const content = STAGE_CONTENT[stage];

  return (
    <div className="pageContainer">
      <ErrorBoundary>
        {jobs.length === 0 ? (
          <DashboardCard
            message={content.message}
            description={content.description}
          />
        ) : (
          <RecommendedJobs jobs={jobs} />
        )}
      </ErrorBoundary>
    </div>
  );
}
