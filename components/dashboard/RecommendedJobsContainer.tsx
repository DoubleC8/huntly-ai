import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Frown } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

import DashboardJobPost from "../dashboard/DashboardJobPost";
import { Job } from "@/app/generated/prisma";

export default function RecommendedJobsContainer({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="pageContainer justify-center">
        <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
          <CardContent className="flex flex-col items-center gap-3">
            <Frown />
            <p>No Recommended Jobs Yet?</p>
            <CardDescription>
              Try Adding your Resume and Check Back Later!
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link href="/jobs/resume" className="w-1/2 mx-auto">
              <Button className="w-full">Add Resume</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <DashboardJobPost job={job} key={job.id} />
      ))}
    </div>
  );
}
