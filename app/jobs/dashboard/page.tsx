import { auth } from "@/auth";
import RecommendedJobsContainer from "@/components/dashboard/RecommendedJobsContainer";
import { Frown, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const { q } = await searchParams;
  const query = q as string | undefined;

  const jobs = await prisma.job.findMany({
    where: {
      userId: user.id,
      stage: null,
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
          { aiSummary: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: {
      postedAt: "desc",
    },
  });

  return (
    <>
      <div className="desktopAppPageNav">
        <form className="flex w-full justify-between gap-3">
          <div className="w-full flex gap-2">
            <Input
              type="text"
              name="q"
              placeholder="Search for a Job"
              className="bg-[var(--background)] h-9"
            />
            <Button type="submit">
              Search
              <Search />
            </Button>
          </div>
        </form>
      </div>
      {jobs.length === 0 ? (
        <div className="flex flex-col gap-3 justify-center items-center my-auto">
          <Frown />
          <p className="text-muted-foreground text-center">
            No jobs matched your search.
          </p>
        </div>
      ) : (
        <RecommendedJobsContainer jobs={jobs} />
      )}
    </>
  );
}
