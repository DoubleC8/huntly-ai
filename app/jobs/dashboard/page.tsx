import { auth } from "@/auth";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { getUserByEmail } from "@/lib/queries/userQueries";
import { searchJobs } from "@/lib/queries/jobQueries";
import DashboardNavbar from "@/components/dashboard/navbars/DashboardNavbar";
import ActiveFiltersBar from "@/components/dashboard/ActiveFiltersBar";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

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

  //await since its a promise
  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
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
          <div className="my-auto">
            <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
              <CardContent className="flex flex-col items-center gap-3">
                <Frown className="text-[var(--app-blue)]" />
                <p>No Jobs Matched your Search</p>
                <CardDescription>Try Refining your Seach!</CardDescription>
              </CardContent>
              <CardFooter className="mx-auto">
                <Link href="/jobs/dashboard" className="mx-auto">
                  <Button className="w-full">Go Back</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <RecommendedJobs jobs={jobs} />
        )}
      </ErrorBoundary>
    </div>
  );
}
