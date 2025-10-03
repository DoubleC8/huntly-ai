import { auth } from "@/auth";
import { Frown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import DashboardNavbar from "./DashboardNavbar";

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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

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

  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const searchQuery = typeof search === "string" ? search.trim() : "";
  const locationQuery = typeof location === "string" ? location.trim() : "";

  const jobs = await prisma.job.findMany({
    where: {
      userId: user.id,
      stage: "DEFAULT",
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { company: { contains: searchQuery, mode: "insensitive" } },
          { aiSummary: { contains: searchQuery, mode: "insensitive" } },
        ],
      }),
      ...(locationQuery && {
        location: { contains: locationQuery, mode: "insensitive" },
      }),
      ...(employment && { employment: employment as string }),
      ...(remoteType && { remoteType: remoteType as string }),
      ...(salaryMin && { salaryMin: { gte: Number(salaryMin) } }),
    },
    orderBy: { postedAt: "desc" },
    skip,
    take: limit,
  });

  // const totalJobs = await prisma.job.count({
  //   where: {
  //     userId: user.id,
  //     stage: "DEFAULT",
  //     ...(searchQuery && {
  //       OR: [
  //         { title: { contains: searchQuery, mode: "insensitive" } },
  //         { company: { contains: searchQuery, mode: "insensitive" } },
  //         { aiSummary: { contains: searchQuery, mode: "insensitive" } },
  //       ],
  //     }),
  //     ...(locationQuery && {
  //       location: { contains: locationQuery, mode: "insensitive" },
  //     }),
  //     ...(employment && { employment: employment as string }),
  //     ...(remoteType && { remoteType: remoteType as string }),
  //     ...(salaryMin && { salaryMin: { gte: Number(salaryMin) } }),
  //   },
  //   orderBy: { postedAt: "desc" },
  //   skip,
  //   take: limit,
  // });

  return (
    <div className="pageContainer">
      <DashboardNavbar />
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
    </div>
  );
}
