import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Frown, ListFilter, Search } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Clock, ThumbsUp } from "lucide-react";
import { Input } from "../ui/input";

export interface JobPosting {
  id: string;
  sourceUrl: string;
  title: string;
  company: string;
  location: string;
  employment: string;
  remoteType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  aiSummary: string;
  skills: string[];
  createdAt: Date;
}

export default function RecommendedJobsContainer() {
  const jobs: JobPosting[] = [
    {
      id: "1",
      sourceUrl: "https://jobs.lever.co/openai/123",
      title: "Frontend Engineer",
      company: "OpenAI",
      location: "San Francisco, CA",
      employment: "Full-time",
      remoteType: "Hybrid",
      salaryMin: 140000,
      salaryMax: 180000,
      currency: "USD",
      description:
        "We are looking for a frontend engineer to build and optimize user-facing applications that interact with AI models.",
      aiSummary:
        "OpenAI is seeking a frontend engineer to improve user interfaces for AI applications. Hybrid role based in SF.",
      skills: ["React", "TypeScript", "TailwindCSS", "Next.js", "UX Design"],
      createdAt: new Date("2025-08-16T12:00:00Z"),
    },
    {
      id: "2",
      sourceUrl: "https://jobs.atlassian.com/456",
      title: "Product Designer",
      company: "Atlassian",
      location: "Remote - US",
      employment: "Contract",
      remoteType: "Remote",
      salaryMin: 80000,
      salaryMax: 120000,
      currency: "USD",
      description:
        "Work closely with PMs and engineers to design collaborative tools that empower millions of users.",
      aiSummary:
        "Contract design role at Atlassian to improve collaboration tools. Remote within the US.",
      skills: ["Figma", "UI Design", "User Research", "Accessibility"],
      createdAt: new Date("2025-08-17T09:30:00Z"),
    },
    {
      id: "3",
      sourceUrl: "https://jobs.airbnb.com/789",
      title: "Data Analyst",
      company: "Airbnb",
      location: "New York, NY",
      employment: "Full-time",
      remoteType: "On-site",
      salaryMin: 95000,
      salaryMax: 115000,
      currency: "USD",
      description:
        "Help shape data-driven decisions across product and marketing teams through dashboards and reporting.",
      aiSummary:
        "Airbnb is hiring a data analyst to support decision-making with data insights. On-site in NYC.",
      skills: ["SQL", "Python", "Looker", "Statistics", "A/B Testing"],
      createdAt: new Date("2025-08-14T15:45:00Z"),
    },
    {
      id: "4",
      sourceUrl: "https://jobs.lever.co/openai/123",
      title: "Frontend Engineer",
      company: "OpenAI",
      location: "San Francisco, CA",
      employment: "Full-time",
      remoteType: "Hybrid",
      salaryMin: 140000,
      salaryMax: 180000,
      currency: "USD",
      description:
        "We are looking for a frontend engineer to build and optimize user-facing applications that interact with AI models.",
      aiSummary:
        "OpenAI is seeking a frontend engineer to improve user interfaces for AI applications. Hybrid role based in SF.",
      skills: ["React", "TypeScript", "TailwindCSS", "Next.js", "UX Design"],
      createdAt: new Date("2025-08-16T12:00:00Z"),
    },
    {
      id: "5",
      sourceUrl: "https://jobs.atlassian.com/456",
      title: "Product Designer",
      company: "Atlassian",
      location: "Remote - US",
      employment: "Contract",
      remoteType: "Remote",
      salaryMin: 80000,
      salaryMax: 120000,
      currency: "USD",
      description:
        "Work closely with PMs and engineers to design collaborative tools that empower millions of users.",
      aiSummary:
        "Contract design role at Atlassian to improve collaboration tools. Remote within the US.",
      skills: ["Figma", "UI Design", "User Research", "Accessibility"],
      createdAt: new Date("2025-08-17T09:30:00Z"),
    },
    {
      id: "6",
      sourceUrl: "https://jobs.airbnb.com/789",
      title: "Data Analyst",
      company: "Airbnb",
      location: "New York, NY",
      employment: "Full-time",
      remoteType: "On-site",
      salaryMin: 95000,
      salaryMax: 115000,
      currency: "USD",
      description:
        "Help shape data-driven decisions across product and marketing teams through dashboards and reporting.",
      aiSummary:
        "Airbnb is hiring a data analyst to support decision-making with data insights. On-site in NYC.",
      skills: ["SQL", "Python", "Looker", "Statistics", "A/B Testing"],
      createdAt: new Date("2025-08-14T15:45:00Z"),
    },
  ];

  if (jobs.length === 0) {
    return (
      <div className="pageContainer justify-center">
        <Card
          className="lg:w-6/10
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
    <div className="pageContainer">
      <div
        className="md:flex
        w-full justify-between hidden"
      >
        <div
          className="md:flex 
          w-full justify-between gap-3 hidden"
        >
          <div className="w-[75%] flex gap-2">
            <Input
              type="url"
              placeholder="Add External Job Link"
              className="bg-[var(--background)] h-9"
            />
            <Button>
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
                    <ThumbsUp color="#1F51FF" />
                    Recommended
                  </SelectItem>
                  <SelectItem value="top matched">
                    <BadgeCheck color="#1F51FF" />
                    Top Matched
                  </SelectItem>
                  <SelectItem value="most recent">
                    <Clock color="#1F51FF" />
                    Most Recent
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button>
              Filter
              <ListFilter />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <Card key={job?.id} className="bg-[var(--background)]">
            <CardContent className="flex flex-col gap-2">
              <div className="flex gap-3">
                <a
                  target="_blank"
                  href="https://logo.dev"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
                    width={50}
                    height={50}
                    alt="Logo API"
                    className="rounded-lg"
                  />
                </a>
                <div>
                  <h2 className="text-xl font-bold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {job.company} — {job.location}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm">{job.aiSummary}</p>
            </CardContent>
            <CardFooter className="justify-between text-sm text-muted-foreground">
              <span>
                ${job.salaryMin.toLocaleString()} - $
                {job.salaryMax.toLocaleString()} {job.currency}
              </span>
              <Link href={job.sourceUrl} target="_blank">
                <Button>View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
