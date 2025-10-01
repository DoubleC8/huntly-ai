import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Building, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Job } from "@/app/generated/prisma";
import { STAGE_COLORS, STAGE_LABELS } from "@/app/constants/jobStage";
import Link from "next/link";
import StarButton from "./buttons/StarButton";
import { formatJobDate, formatSalary } from "@/lib/date-utils";
import RejectedButton from "./buttons/RejectedButton";
import AddNoteButton from "./buttons/AddNoteButton";
import AppliedButton from "./buttons/AppliedButton";

export default function DashboardJobPost({ job }: { job: Job }) {
  return (
    <Card
      key={job.id}
      className={`bg-[var(--background)] flex ${job.stage ? "pt-0" : ""}`}
    >
      {job.stage && job.stage !== "DEFAULT" ? (
        <div
          className="w-full h-1/10 rounded-t-xl px-6 py-1"
          style={{ backgroundColor: `var(${STAGE_COLORS[job.stage]})` }}
        >
          <p className="text-[var(--background)] font-bold">
            {STAGE_LABELS[job.stage]}
          </p>
        </div>
      ) : (
        <div className="w-full h-1/10 rounded-t-xl px-6 py-1"></div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center justify-center">
            <a
              target="_blank"
              href="https://logo.dev"
              rel="noopener noreferrer"
            >
              <Image
                src={`https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
                width={65}
                height={65}
                alt="Logo API"
                className="rounded-lg"
              />
            </a>
            <div>
              <h2 className="text-xl font-bold">{job.title}</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                {job.company}
              </div>

              {job.postedAt ? (
                <p className="text-sm text-muted-foreground">
                  Posted {formatJobDate(job.postedAt)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  We found this job for you {formatJobDate(job.createdAt)}
                </p>
              )}
            </div>
          </div>
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
            <RejectedButton
              jobTitle={job.title}
              jobCompany={job.company}
              jobId={job.id}
              jobStage={job.stage}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm">
          ${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}{" "}
          {job.currency}
        </p>
        <p>{job.aiSummary}</p>
      </CardContent>
      <CardFooter
        className="lg:flex-row lg:gap-0
      flex-col gap-3 justify-between text-sm text-muted-foreground"
      >
        <div
          className="md:flex-row
        flex flex-col gap-3 items-center justify-between w-full"
        >
          {/**job info row */}
          <div
            className="md:w-1/2
          flex gap-3"
          >
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

          {/**view job and view/edit note on desktop*/}
          <div
            className="md:flex md:flex-row md:justify-end md:w-1/2
          flex flex-col-reverse gap-2 w-full "
          >
            {/**add notes button */}
            <div
              className="md:w-1/2 lg:w-1/4
            w-full"
            >
              <AddNoteButton jobId={job.id} initialNote={job.note || ""} />
            </div>
            {/** view job button */}
            <Link
              href={`/jobs/dashboard/${job.id}`}
              className="md:w-1/2 lg:w-1/4
            w-full"
            >
              <Button className="w-full">View Job</Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
