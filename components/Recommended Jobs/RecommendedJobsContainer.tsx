import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Frown, ListFilter, Search, Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow, formatDistanceToNow as formatFn } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { Job } from "@/app/generated/prisma";

export default function RecommendedJobsContainer() {
  const jobs: (Job & { skills: string[] })[] = [
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
      stage: null,
      userId: "dev_user_id",
      createdAt: new Date("2025-08-16T12:00:00Z"),
      postedAt: new Date("2025-08-15T12:00:00Z"),
    },
    {
      id: "7",
      sourceUrl: "https://jobs.spotify.com/777",
      title: "Mobile Engineer",
      company: "Spotify",
      location: "Boston, MA",
      employment: "Full-time",
      remoteType: "Remote",
      salaryMin: 120000,
      salaryMax: 150000,
      currency: "USD",
      description:
        "Join Spotify’s mobile team to deliver music to millions of users through native iOS and Android apps.",
      aiSummary:
        "Spotify is hiring a mobile engineer for its music app team. Fully remote position.",
      skills: ["Swift", "Kotlin", "React Native", "CI/CD", "Agile"],
      stage: null,
      userId: "dev_user_id",
      createdAt: new Date("2025-08-18T10:00:00Z"),
      postedAt: new Date("2025-08-17T10:00:00Z"),
    },
    {
      id: "8",
      sourceUrl: "https://jobs.meta.com/888",
      title: "Machine Learning Engineer",
      company: "Meta",
      location: "Menlo Park, CA",
      employment: "Full-time",
      remoteType: "Hybrid",
      salaryMin: 160000,
      salaryMax: 210000,
      currency: "USD",
      description:
        "Build intelligent systems that power Facebook and Instagram recommendation algorithms.",
      aiSummary:
        "Meta seeks an ML engineer for recommendation systems across its products. Hybrid in Menlo Park.",
      skills: ["Python", "PyTorch", "TensorFlow", "Data Engineering", "ML Ops"],
      stage: null,
      userId: "dev_user_id",
      createdAt: new Date("2025-08-19T09:15:00Z"),
      postedAt: new Date("2025-08-18T09:00:00Z"),
    },
    {
      id: "9",
      sourceUrl: "https://jobs.doordash.com/999",
      title: "DevOps Engineer",
      company: "DoorDash",
      location: "Austin, TX",
      employment: "Full-time",
      remoteType: "On-site",
      salaryMin: 110000,
      salaryMax: 130000,
      currency: "USD",
      description:
        "Manage cloud infrastructure and CI/CD pipelines for a fast-moving logistics platform.",
      aiSummary:
        "On-site DevOps position at DoorDash managing AWS and CI/CD systems.",
      skills: ["AWS", "Terraform", "Kubernetes", "Jenkins", "Monitoring"],
      stage: null,
      userId: "dev_user_id",
      createdAt: new Date("2025-08-20T14:00:00Z"),
      postedAt: new Date("2025-08-19T14:00:00Z"),
    },
    {
      id: "10",
      sourceUrl: "https://jobs.nvidia.com/1010",
      title: "Graphics Software Engineer",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      employment: "Full-time",
      remoteType: "Hybrid",
      salaryMin: 135000,
      salaryMax: 160000,
      currency: "USD",
      description:
        "Work on cutting-edge real-time graphics tools and APIs used in gaming and AI simulations.",
      aiSummary:
        "NVIDIA is hiring a graphics engineer for real-time rendering. Hybrid in Santa Clara.",
      skills: [
        "C++",
        "DirectX",
        "Vulkan",
        "Shader Programming",
        "Real-Time Graphics",
      ],
      stage: null,
      userId: "dev_user_id",
      createdAt: new Date("2025-08-21T11:30:00Z"),
      postedAt: new Date("2025-08-20T11:30:00Z"),
    },
  ];

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
    <div className="pageContainer">
      <div className="md:flex w-full justify-between hidden">
        <div className="md:flex w-full justify-between gap-3 hidden">
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
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-[var(--background)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
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
                    <p className="text-sm text-muted-foreground">
                      Posted{" "}
                      {formatDistanceToNow(new Date(job.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <Star className="hover:text-yellow-400 ease-in-out duration-200" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="mt-2 text-sm">{job.aiSummary}</p>
            </CardContent>
            <CardFooter className="justify-between text-sm text-muted-foreground">
              <span>
                ${job.salaryMin.toLocaleString()} - $
                {job.salaryMax.toLocaleString()} {job.currency}
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>View</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
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
                    </DialogTitle>
                    <DialogDescription asChild>
                      <div className="flex flex-col gap-3">
                        <div>
                          <p>
                            <strong>Employment Type:</strong> {job.employment}
                          </p>
                          <p>
                            <strong>Remote Type:</strong> {job.remoteType}
                          </p>
                          <p>
                            <strong>Salary:</strong> $
                            {job.salaryMin.toLocaleString()} - $
                            {job.salaryMax.toLocaleString()} {job.currency}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p>
                            <strong>Description:</strong>
                            <br />
                            {job.description}
                          </p>
                          <p>
                            <strong>Skills:</strong>
                          </p>
                          {job.skills.map((skill) => (
                            <p key={skill}>• {skill}</p>
                          ))}
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <a
                      target="_blank"
                      href={job.sourceUrl}
                      rel="noopener noreferrer"
                      className="mx-auto"
                    >
                      <Button>Apply</Button>
                    </a>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
