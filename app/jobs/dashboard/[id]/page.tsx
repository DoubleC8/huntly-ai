import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { formatDistanceToNow as formatFn } from "date-fns";
import { STAGE_LABELS, STAGE_COLORS } from "@/app/constants/jobStage";
import NotesEditor from "@/components/dashboard/NotesEditor";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";

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
        description="Looks like this job took a day off — or maybe the link’s a bit wonky. Try heading back to your dashboard and picking another one!"
      />
    );
  }

  return (
    <div className="pageContainer">
      <div className="flex items-center gap-4">
        <Image
          src={`https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
          width={60}
          height={60}
          alt={`${job.company} logo`}
          className="rounded"
        />
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-muted-foreground">{job.company}</p>
          <p className="text-muted-foreground text-sm">
            Posted{" "}
            {formatFn(new Date(job.postedAt ?? job.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <p className="text-muted-foreground">
          <strong>Salary:</strong> ${job.salaryMin.toLocaleString()} – $
          {job.salaryMax.toLocaleString()} {job.currency}
        </p>

        <p className="text-muted-foreground whitespace-pre-line">
          {job.description}
        </p>

        <div>
          <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
          <p>{job.aiSummary}</p>
        </div>

        <div className="mt-6">
          <NotesEditor jobId={job.id} initialNote={job.note || ""} />
        </div>

        <div className="mt-4 flex gap-3">
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
