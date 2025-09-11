import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { Job } from "@/app/generated/prisma";
import { STAGE_LABELS, STAGE_ORDER } from "@/app/constants/jobStage";

export default function ViewJob({ job }: { job: Job }) {
  console.log(
    `https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`
  );
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="md:block
          hidden"
      >
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
                  <strong>Salary:</strong> ${job.salaryMin.toLocaleString()} - $
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
          {job.stage === null ||
          STAGE_ORDER.indexOf(job.stage) < STAGE_ORDER.indexOf("APPLIED") ? (
            <a
              target="_blank"
              href={job.sourceUrl}
              rel="noopener noreferrer"
              className="mx-auto"
            >
              <Button>Apply</Button>
            </a>
          ) : (
            <Button className="mx-auto" disabled>
              {STAGE_LABELS[job.stage]}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
