import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow as formatFn } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Job } from "@/app/generated/prisma";

export default function DashboardJobPost({ job }: { job: Job }) {
  return (
    <Card key={job.id} className="bg-[var(--background)]">
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
                width={60}
                height={60}
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
                {formatFn(new Date(job.createdAt), {
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
          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}{" "}
          {job.currency}
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
                      <strong>Salary:</strong> ${job.salaryMin.toLocaleString()}{" "}
                      - ${job.salaryMax.toLocaleString()} {job.currency}
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
  );
}
