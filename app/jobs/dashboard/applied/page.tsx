import { auth } from "@/auth";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";
import { JobStage } from "@/app/generated/prisma";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { getUserByEmail } from "@/lib/queries/userQueries";
import { getJobsByStage } from "@/lib/queries/jobQueries";

export default async function appliedJobsPage() {
  const session = await auth();
  //extra security, we have middleware but this is just incase it doesnt work for some reason
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

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const jobs = await getJobsByStage(user.id, JobStage.APPLIED);

  return (
    <div className="pageContainer">
      {jobs.length === 0 ? (
        <DashboardCard
          message="You haven’t applied to any jobs yet."
          description="Once you mark them as applied, they’ll show up here to help track your progress."
        />
      ) : (
        <RecommendedJobs jobs={jobs} />
      )}
    </div>
  );
}
