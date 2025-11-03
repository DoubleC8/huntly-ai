import { getUserByEmail } from "@/app/actions/profile/get/getUserInfo";
import { NoPreferencesCard } from "@/components/dashboard/cards/NoPreferencesCard";
import DashboardClient from "@/components/dashboard/dashboard-client/DashboardClient";
import DashboardNavbar from "@/components/dashboard/navbars/DashboardNavbar";
import { getCurrentUserEmail } from "@/lib/auth-helpers";
import { Suspense } from "react";
import JobsPostingsSkeleton from "@/components/ui/loaders/JobPostingsSkeleton";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const email = await getCurrentUserEmail();
  if (!email) return <div className="center">Please Sign In.</div>;

  const user = await getUserByEmail(email);
  if (!user) return <div className="center">User not found.</div>;

  const hasPreferences =
    Array.isArray(user.jobPreferences) && user.jobPreferences.length > 0;
  if (!hasPreferences) {
    return (
      <div className="pageContainer">
        <DashboardNavbar />
        <NoPreferencesCard />
      </div>
    );
  }

  const resolvedParams = await searchParams;
  const filters = {
    searchQuery:
      typeof resolvedParams.search === "string"
        ? resolvedParams.search.trim()
        : "",
    locationQuery:
      typeof resolvedParams.location === "string"
        ? resolvedParams.location.trim()
        : "",
    employment: resolvedParams.employment as string,
    remoteType: resolvedParams.remoteType as string,
    salaryMin: resolvedParams.salaryMin
      ? Number(resolvedParams.salaryMin)
      : undefined,
  };

  return (
    <div className="pageContainer">
      <DashboardNavbar />
      <Suspense fallback={<JobsPostingsSkeleton postings={5} />}>
        <DashboardClient userId={user.id} filters={filters} />
      </Suspense>
    </div>
  );
}
