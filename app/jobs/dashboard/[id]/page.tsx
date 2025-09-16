import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDistanceToNow as formatFn } from "date-fns";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Building,
  Clock,
  Crosshair,
  ExternalLink,
  ListTodo,
  MapPin,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function JobPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        User not found.
      </div>
    );
  }

  const job = await prisma.job.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!job) {
    return (
      <DashboardCard
        message="Hmm... Job Not Found"
        description="Looks like this job took a day off — or maybe the link’s a bit wonky. 
        Try heading back to your dashboard and picking another one!"
      />
    );
  }

  return (
    <div className="pageContainer">
      <div className="flex w-full justify-end">
        <a target="_blank" href={`${job.sourceUrl}`} rel="noopener noreferrer">
          <Button>
            Apply Now <ExternalLink />
          </Button>
        </a>
      </div>
      <div className="bg-[var(--background)] h-fit min-h-[100vh] rounded-3xl shadow-md p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3 h-[20vh]">
          <div className="flex items-center gap-3">
            <a
              target="_blank"
              href="https://logo.dev"
              rel="noopener noreferrer"
            >
              <Image
                src={`https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
                width={75}
                height={75}
                alt="Logo API"
                className="rounded-lg"
              />
            </a>

            {job.postedAt ? (
              <p>
                {job.company} •{" "}
                <span className="text-muted-foreground">
                  {formatFn(new Date(job.postedAt), {
                    addSuffix: true,
                  })}
                </span>
              </p>
            ) : (
              <p>
                {job.company} •{" "}
                <span className="text-muted-foreground">
                  {formatFn(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </p>
            )}
          </div>
          <div className="h-full flex flex-col justify-between">
            <h1 className="font-bold text-2xl">{job.title}</h1>
            <div className="flex gap-3 text-muted-foreground">
              {/**TODO: Add feature to when the user clicks on the location, it gives me a rough
               * estimate of their commute
               */}
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <p>{job.location}</p>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <p>{job.employment}</p>
              </div>
              <div className="flex items-center gap-1">
                <Building size={14} />
                <p>{job.remoteType}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Bot className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Ai Summary</h1>
          </div>
          <p>{job.aiSummary}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ListTodo className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Responsibilites</h1>
          </div>
          <ul className="list-disc ml-5 space-y-3">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Crosshair className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Qualifications</h1>
          </div>
          <ul className="list-disc ml-5 space-y-3">
            {job.qualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <NotebookPen className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Your Notes</h1>
          </div>
          <p>{job.note}</p>
        </div>
        <div className="flex gap-3 w-full justify-center">
          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
            <Button>Apply Now</Button>
          </a>
          <Link href="/jobs/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
