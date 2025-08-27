"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Building, Clock, MapPin, Pin, Star } from "lucide-react";
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
import { toast } from "sonner";
import { toggleWishlist } from "@/app/actions/toggleWishlist";
import {
  STAGE_COLORS,
  STAGE_LABELS,
  STAGE_ORDER,
} from "@/app/constants/jobStage";

export default function DashboardJobPost({ job }: { job: Job }) {
  const [isPending, startTransition] = useTransition();
  const [isWishlisted, setIsWishlisted] = useState(job.stage === "WISHLIST");

  const handleStarClick = () => {
    setIsWishlisted((prev) => !prev);

    startTransition(async () => {
      try {
        const updatedJob = await toggleWishlist(job.id);
        setIsWishlisted(updatedJob.stage === "WISHLIST");
        toast.success(
          updatedJob.stage === "WISHLIST"
            ? "Job added to Wishlist!"
            : "Job removed from Wishlist."
        );
      } catch (error) {
        setIsWishlisted(job.stage === "WISHLIST");
        toast.error("Failed to toggle wishlist.");
      }
    });
  };

  return (
    <Card
      key={job.id}
      className={`bg-[var(--background)] flex ${job.stage ? "pt-0" : ""}`}
    >
      {job.stage && (
        <div
          className="w-full h-1/10 rounded-t-xl px-6 py-1"
          style={{ backgroundColor: `var(${STAGE_COLORS[job.stage]})` }}
        >
          <p className="text-[var(--background)] font-bold">
            {STAGE_LABELS[job.stage]}
          </p>
        </div>
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
                  Posted{" "}
                  {formatFn(new Date(job.postedAt), {
                    addSuffix: true,
                  })}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  We found this job for you{" "}
                  {formatFn(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>
          </div>
          {job.stage === null ||
          STAGE_ORDER.indexOf(job.stage) < STAGE_ORDER.indexOf("APPLIED") ? (
            <button
              onClick={handleStarClick}
              disabled={isPending}
              className="hover:cursor-pointer"
            >
              {isWishlisted ? (
                <Star fill="yellow" className="text-[var(--app-yellow)]" />
              ) : (
                <Star className="hover:text-[var(--app-yellow)]" />
              )}
            </button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm">
          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}{" "}
          {job.currency}
        </p>
        <p>{job.aiSummary}</p>
      </CardContent>
      <CardFooter
        className="lg:flex-row lg:gap-0
      flex-col gap-3 justify-between text-sm text-muted-foreground"
      >
        <div className="flex gap-3">
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
              {job.stage === null ||
              STAGE_ORDER.indexOf(job.stage) <
                STAGE_ORDER.indexOf("APPLIED") ? (
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
        <a
          className="md:hidden flex w-3/4"
          target="_blank"
          rel="noopener noreferrer"
          href={job.sourceUrl}
        >
          <Button className="w-full">Apply</Button>
        </a>
      </CardFooter>
    </Card>
  );
}
