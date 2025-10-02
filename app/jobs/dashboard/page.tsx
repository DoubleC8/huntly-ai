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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
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
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  //query if any
  const { search, location, employment, remoteType, salaryMin } = searchParams;

  const jobs = await prisma.job.findMany({
    where: {
      userId: user.id,
      stage: "DEFAULT",
      ...(search && {
        OR: [
          { title: { contains: search as string, mode: "insensitive" } },
          { company: { contains: search as string, mode: "insensitive" } },
          { aiSummary: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ],
      }),
      ...(location && {
        location: { contains: location as string, mode: "insensitive" },
      }),
      ...(employment && { employment: employment as string }),
      ...(remoteType && { remoteType: remoteType as string }),
      ...(salaryMin && { salaryMin: { gte: Number(salaryMin) } }),
    },
    orderBy: { postedAt: "desc" },
  });

  return (
    <div className="pageContainer">
      <DashboardNavbar />
      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <RecommendedJobs jobs={jobs} />
      )}
    </div>
  );
}
