import DashboardMobileNavbar from "@/components/dashboard/DashboardMobileNavbar";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { auth } from "@/auth";
//import DashboardDesktopNavbar from "@/components/dashboard/DashboardDesktopNavabar";
import RecommendedJobsContainer from "@/components/dashboard/RecommendedJobsContainer";
import { Ellipsis, Frown, ListFilter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Clock, ThumbsUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
                { aiSummary: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: {
      postedAt: "desc",
    },
  });

  return (
    <>
      <div className="page">
        <form className="mobileAppPageNav">
          <div className="flex gap-1">
            <Input
              type="text"
              name="q"
              placeholder="Search for a Job"
              className="bg-[var(--background)] h-9"
            />
            <Button type="submit">
              <Search />
            </Button>
          </div>

          <div className="flex gap-1">
            <Select>
              <SelectTrigger className="bg-[var(--background)] h-9">
                <SelectValue placeholder={<Ellipsis />} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="recommended">
                    <ThumbsUp />
                    Recommended
                  </SelectItem>
                  <SelectItem value="top matched">
                    <BadgeCheck />
                    Top Matched
                  </SelectItem>
                  <SelectItem value="most recent">
                    <Clock />
                    Most Recent
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button>
              <ListFilter />
            </Button>
          </div>
        </form>

        <DashboardTitle />

        {/**This code below will hold the recommended jobs */}
        <div className="pageContainer">
          {/* <DashboardDesktopNavbar /> */}
          <div className="md:flex w-full justify-between hidden">
            <form className="md:flex w-full justify-between gap-3 hidden">
              <div className="w-[75%] flex gap-2">
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
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="bg-[var(--background)] h-9">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="recommended">
                        <ThumbsUp color="#1F51FF" /> Recommended
                      </SelectItem>
                      <SelectItem value="top matched">
                        <BadgeCheck color="#1F51FF" /> Top Matched
                      </SelectItem>
                      <SelectItem value="most recent">
                        <Clock color="#1F51FF" /> Most Recent
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button>
                  Filter
                  <ListFilter />
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
        </div>
      </div>
    </>
  );
}
