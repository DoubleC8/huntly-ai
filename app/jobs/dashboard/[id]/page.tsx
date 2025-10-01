import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDistanceToNow as formatFn } from "date-fns";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import {
  Building,
  Clock,
  Crosshair,
  FileText,
  Lightbulb,
  ListTodo,
  MapPin,
  NotebookPen,
  Tags,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ShareJobButton from "@/components/dashboard/buttons/ShareJob";
import StarButton from "@/components/dashboard/buttons/StarButton";
import JobPageNotes from "@/components/dashboard/JobPageNotes";
import { ResumeMatchScore } from "@/components/dashboard/charts/ResumeMatchScore";
import { Badge } from "@/components/ui/badge";
import AppliedButton from "@/components/dashboard/buttons/AppliedButton";
import RejectedButton from "@/components/dashboard/buttons/RejectedButton";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import InterviewingButton from "@/components/dashboard/buttons/InterviewingButton";
import OfferedPostitionButton from "@/components/dashboard/buttons/OfferedPositionButon";
import { JobStage } from "@/app/generated/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const session = await auth();

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

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: {
      id,
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

  const applied =
    job.stage === null ||
    STAGE_ORDER.indexOf(job.stage) >= STAGE_ORDER.indexOf("APPLIED");

  let message: string;

  switch (job.stage) {
    case JobStage.WISHLIST:
      message = "You have Wishlisted this Job.";
      break;
    case JobStage.APPLIED:
      message = "You have Applied for this Job.";
      break;
    case JobStage.INTERVIEW:
      message = "You are currently Interviewing for this Job.";
      break;
    case JobStage.OFFER:
      message =
        "You have have been offered a position at this company. Go Celebrate!";
      break;
    default:
      message = "Try applying to this job today!";
  }

  return (
    <div className="pageContainer">
      <div
        className="md:justify-between
      flex w-full gap-3 items-center justify-center"
      >
        <div>
          <RejectedButton
            jobTitle={job.title}
            jobCompany={job.company}
            jobId={job.id}
            jobStage={job.stage}
          />
        </div>

        {/**job stage buttons */}
        <div className="flex items-center gap-3">
          <StarButton
            jobTitle={job.title}
            jobCompany={job.company}
            jobId={job.id}
            jobStage={job.stage}
          />
          <AppliedButton
            jobTitle={job.title}
            jobCompany={job.company}
            jobId={job.id}
            jobStage={job.stage}
          />
          <InterviewingButton
            jobTitle={job.title}
            jobCompany={job.company}
            jobId={job.id}
            jobStage={job.stage}
          />
          <OfferedPostitionButton
            jobTitle={job.title}
            jobCompany={job.company}
            jobId={job.id}
            jobStage={job.stage}
          />
          <ShareJobButton jobSourceUrl={job?.sourceUrl} />
          <a
            target="_blank"
            href={`${job.sourceUrl}`}
            rel="noopener noreferrer"
          >
            <Button className="w-40">Apply Now</Button>
          </a>
        </div>
      </div>
      <div className="bg-[var(--background)] h-fit min-h-[100vh] rounded-3xl shadow-md p-3 flex flex-col gap-3 justify-between">
        {/**header */}
        <div
          className="md:min-h-[20vh] md:max-h-fit md:flex-row md:justify-between md:gap-0 items-center
        flex flex-col gap-3 justify-between"
        >
          <div
            className="md:w-3/4
          flex flex-col gap-3 "
          >
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
                <p className="font-semibold">
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
            <div
              className="md:items-start
            h-full flex flex-col  gap-3 justify-between"
            >
              <h1 className="font-bold text-2xl">{job.title}</h1>
              <div className="flex flex-col gap-1">
                {job.aiSummary ? (
                  <>
                    <p className="font-semibold">{job.aiSummary}</p>
                    <p className="text-muted-foreground">(Ai Summary)</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Our AI is still sharpening its resume writing skills. Check
                    back soon!
                  </p>
                )}
              </div>

              <div className="flex gap-3 text-muted-foreground">
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
          <ResumeMatchScore />
        </div>
        {/**description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <FileText className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Description</h1>
          </div>
          {job.description ? (
            <p>{job.description}</p>
          ) : (
            <p className="text-muted-foreground">
              Our AI is still hasnt gotten the jobs description, try checking
              back later!
            </p>
          )}
        </div>
        {/**reponsibilities */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ListTodo className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Responsibilites</h1>
          </div>
          {job.responsibilities?.length ? (
            <ul className="list-disc ml-5 space-y-3">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Oops! The responsibility list seems to be on a coffee break.
            </p>
          )}
        </div>
        {/**qualifications */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Crosshair className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Qualifications</h1>
          </div>
          {job.qualifications?.length ? (
            <ul className="list-disc ml-5 space-y-3">
              {job.qualifications.map((qualification, index) => (
                <li key={index}>{qualification}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Qualifications are currently out of office — stay tuned!
            </p>
          )}
        </div>
        {/**skills */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Skills</h1>
          </div>
          {job.skills?.length ? (
            <ul className="list-disc ml-5 space-y-3">
              {job.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Our skill scanner might’ve blinked — give it a sec to catch up!
            </p>
          )}
        </div>
        {/**tags */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Tags className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Tags</h1>
          </div>
          {job.tags.length ? (
            <div className="flex gap-2">
              {job.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Looks like no tags have been added yet — try checking back later!
            </p>
          )}
        </div>
        {/**notes */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <NotebookPen className="text-[var(--app-blue)]" />
            <h1 className="font-bold text-2xl">Your Notes</h1>
          </div>
          <JobPageNotes jobId={job.id} initialNote={job.note} />
        </div>
        {/**apply/go back to dashboard button */}
        <div className="w-full flex flex-col justify-center gap-3">
          <div className="w-full flex gap-3 mx-auto justify-center ">
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md:w-1/6
            w-1/2"
            >
              <Button className="w-full">
                {applied ? "View Job" : "Apply Now"}
              </Button>
            </a>
            <Link
              href="/jobs/dashboard"
              className="md:w-1/6 
          w-1/2"
            >
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-center">{message}</p>
        </div>
      </div>
    </div>
  );
}
