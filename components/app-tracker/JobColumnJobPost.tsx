"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Job, JobStage } from "@/app/generated/prisma";
import { Button } from "../ui/button";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { formatJobDate, formatSalary } from "@/lib/date-utils";
import RejectedButton from "../dashboard/buttons/RejectedButton";
import { updateJob } from "@/app/actions/jobs/updateJob";
import { useState } from "react";

/** Valid stage order for navigation */
const stageOrder: JobStage[] = ["APPLIED", "INTERVIEW", "OFFER"];

/** Helper to find next/previous stage */
function getAdjacentStage(
  stage: JobStage,
  direction: "up" | "down"
): JobStage | null {
  const index = stageOrder.indexOf(stage);
  if (index === -1) return null;

  return direction === "up"
    ? stageOrder[index - 1] ?? null
    : stageOrder[index + 1] ?? null;
}

export default function JobColumnJobPost({
  job,
  isDraggable = true,
  onStageChange,
  onJobDeletion,
}: {
  job: Job;
  isDraggable?: boolean;
  onStageChange?: (jobId: string, newStage: JobStage) => void;
  onJobDeletion?: (jobId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: job.id,
      data: { job },
      disabled: !isDraggable,
    });

  const [updating, setUpdating] = useState(false);

  /** Mobile stage change handler */
  async function handleStageChange(direction: "up" | "down") {
    const nextStage = getAdjacentStage(job.stage, direction);
    if (!nextStage) return;

    setUpdating(true);

    try {
      // Update the visual state immediately
      if (onStageChange) {
        onStageChange(job.id, nextStage);
      }

      // Update the backend
      await updateJob({
        type: "setStage",
        jobId: job.id,
        stage: nextStage,
      });

      toast.success(`Moved job to ${nextStage.toLowerCase()} stage.`, {
        description: `${job.title} @ ${job.company}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job stage.", {
        description: "Please try again later.",
      });

      // Revert the visual state on error
      if (onStageChange) {
        onStageChange(job.id, job.stage);
      }
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Card
      key={job.id}
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.6 : updating ? 0.7 : 1,
        zIndex: isDragging ? 50 : 0,
        position: isDragging ? "absolute" : "relative",
        width: isDragging ? "24%" : "100%",
      }}
      className={`p-3 flex flex-col justify-between transition-opacity duration-200 ${
        updating ? "pointer-events-none" : ""
      }`}
    >
      {/* HEADER */}
      <CardHeader
        className={`flex gap-3 items-center justify-between p-0 ${
          isDraggable ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        {...(isDraggable ? listeners : {})}
        {...(isDraggable ? attributes : {})}
      >
        <div className="flex gap-3">
          <a target="_blank" href={job.sourceUrl} rel="noopener noreferrer">
            <Image
              src={`https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
              width={45}
              height={45}
              alt="Company Logo"
              className="rounded-lg"
            />
          </a>
          <div>
            <h2 className="font-bold">{job.title}</h2>
            <p className="font-semibold text-xs text-muted-foreground">
              {job.company} — {job.location}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex justify-start p-0 mt-2">
        <div className="font-medium text-xs text-muted-foreground">
          <p>
            <span className="font-semibold">Salary:</span> $
            {formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}{" "}
            {job.currency}
          </p>
          <p>
            <span className="font-semibold">Job Type:</span> {job.employment},{" "}
            {job.remoteType}
          </p>
          {job.postedAt ? (
            <p>
              <span className="font-semibold">Posted:</span>{" "}
              {formatJobDate(job.postedAt)}
            </p>
          ) : (
            <p>
              <span className="font-semibold">Added:</span>{" "}
              {formatJobDate(job.createdAt)}
            </p>
          )}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex items-center justify-between md:gap-3 md:justify-center">
        {/* Mobile Up Button */}
        {job.stage !== JobStage.APPLIED && (
          <Button
            variant="ghost"
            className="lg:hidden"
            disabled={updating}
            onClick={() => handleStageChange("up")}
          >
            {updating ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <ChevronUp />
            )}
          </Button>
        )}

        {/* Center Actions */}
        <div className="flex items-center gap-3 mx-auto">
          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm">View Job Posting</Button>
          </a>
          <RejectedButton
            jobTitle={job.title}
            jobCompany={job.company}
            jobId={job.id}
            jobStage={job.stage}
            onJobDeletion={onJobDeletion}
          />
        </div>

        {/* Mobile Down Button */}
        {job.stage !== JobStage.OFFER && (
          <Button
            variant="ghost"
            className="lg:hidden"
            disabled={updating}
            onClick={() => handleStageChange("down")}
          >
            {updating ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <ChevronDown />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
