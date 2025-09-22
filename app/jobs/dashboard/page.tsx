import { auth } from "@/auth";
import { Frown, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
  const { q } = await searchParams;
  const query = q as string | undefined;

  //getting all jobs attached to the user
  const jobs = await prisma.job.findMany({
    where: {
      userId: user.id,
      stage: "DEFAULT",
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
    <div className="pageContainer">
      {/**conditionally render jobs */}
      {jobs.length === 0 ? (
        query ? (
          <>
            <form className="flex w-full justify-between gap-3">
              <div className="w-full flex gap-2">
                <Input
                  type="text"
                  name="q"
                  placeholder="Search for a Job"
                  className="bg-[var(--background)] h-9"
                />
                <Button type="submit">
                  <span
                    className="md:block
          hidden"
                  >
                    Search
                  </span>
                  <Search />
                </Button>
              </div>
            </form>
            <div className="flex flex-col gap-3 justify-center items-center my-auto">
              <Frown />
              <p className="text-muted-foreground text-center">
                No jobs matched your search.
              </p>
            </div>
          </>
        ) : (
          <div className="my-auto">
            <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
              <CardContent className="flex flex-col items-center gap-3">
                <Frown />
                <p>No Recommended Jobs Yet?</p>
                <CardDescription>
                  Try Adding your Resume and Check Back Later!
                </CardDescription>
              </CardContent>
              <CardFooter className="mx-auto">
                <Link href="/jobs/resume" className="mx-auto">
                  <Button className="w-full">Add Resume</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )
      ) : (
        <>
          <form className="flex w-full justify-between gap-3">
            <div className="w-full flex gap-2">
              <Input
                type="text"
                name="q"
                placeholder="Search for a Job"
                className="bg-[var(--background)] h-9"
              />
              <Button type="submit">
                <span
                  className="md:block
          hidden"
                >
                  Search
                </span>
                <Search />
              </Button>
            </div>
          </form>
          <RecommendedJobs jobs={jobs} />
        </>
      )}
    </div>
  );
}
