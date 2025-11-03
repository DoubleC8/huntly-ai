import { getCurrentUserEmail } from "@/lib/auth-helpers";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";

import DashboardNavbar from "@/components/dashboard/navbars/DashboardNavbar";
import ActiveFiltersBar from "@/components/dashboard/ActiveFiltersBar";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getUserByEmail } from "@/app/actions/profile/get/getUserInfo";
import { searchJobs } from "@/app/actions/jobs/getJobs";
import { NoResultsFound } from "@/components/dashboard/cards/NoResultsFoundCard";
import { NoPreferencesCard } from "@/components/dashboard/cards/NoPreferencesCard";

interface SearchParams {
  search?: string;
  location?: string;
  employment?: string;
  remoteType?: string;
  salaryMin?: string;
  page?: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const email = await getCurrentUserEmail();

  //extra security, we have middleware but this is just incase it doesnt work for some reason
  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  //await since its a promise
  const user = await getUserByEmail(email);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const hasPreferences =
    Array.isArray(user.jobPreferences) && user.jobPreferences.length > 0;
  if (!hasPreferences) {
    return (
      <div className="pageContainer">
        <ErrorBoundary>
          <DashboardNavbar />
        </ErrorBoundary>
        <ErrorBoundary>
          <NoPreferencesCard />
        </ErrorBoundary>
      </div>
    );
  }

  // Await searchParams before using its properties
  const resolvedSearchParams = await searchParams;
  const { search, location, employment, remoteType, salaryMin }: SearchParams =
    resolvedSearchParams;

  const searchQuery = typeof search === "string" ? search.trim() : "";
  const locationQuery = typeof location === "string" ? location.trim() : "";

  const jobs = await searchJobs({
    userId: user.id,
    searchQuery,
    locationQuery,
    employment,
    remoteType,
    salaryMin: salaryMin ? Number(salaryMin) : undefined,
  });

  return (
    <div className="pageContainer">
      <ErrorBoundary>
        <DashboardNavbar />
      </ErrorBoundary>
      <ErrorBoundary>
        <ActiveFiltersBar />
      </ErrorBoundary>
      <ErrorBoundary>
        {jobs.length === 0 ? (
          <NoResultsFound />
        ) : (
          <RecommendedJobs jobs={jobs} />
        )}
      </ErrorBoundary>
    </div>
  );
}
