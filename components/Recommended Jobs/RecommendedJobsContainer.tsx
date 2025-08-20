import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Frown } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Clock, ThumbsUp } from "lucide-react";

export interface JobPosting {
  id: String;
  sourceUrl: String;
  title: String;
  company: String;
  location: String;
  employment: String;
  remoteType: String;
  salaryMin: Number;
  salaryMax: Number;
  currency: String;
  description: String;
  aiSummary: String;
  skills: String[];
  createdAt: Date;
}

export default function RecommendedJobsContainer() {
  let jobs: JobPosting[] = [];

  if (jobs.length === 0) {
    return (
      <div
        className="bg-[var(--card)] min-h-screen md:rounded-tl-4xl md:rounded-tr-none
          rounded-t-xl flex flex-col items-center justify-center"
      >
        <Card
          className="md:w-1/2
          bg-[var(--background)] w-[95%] mx-auto"
        >
          <CardContent className="flex flex-col items-center gap-3">
            <Frown />
            <p>No Recommended Jobs Yet?</p>
            <CardDescription>
              Try Adding your Resume and Check Back Later!
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link href={"/jobs/resume"} className="w-1/2 mx-auto">
              <Button className="w-full">Add Resume</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div
      className="bg-[var(--card)] min-h-screen md:rounded-tl-4xl md:rounded-tr-none
         px-4 py-5 rounded-t-xl"
    >
      <div className="hidden w-full md:flex justify-end">
        <Select>
          <SelectTrigger className="bg-[var(--background)] min-w-2/10">
            <SelectValue placeholder="Select Category" />
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
      </div>
    </div>
  );
}
