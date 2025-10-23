"use client";

import { Job, JobStage } from "@/app/generated/prisma";
import { CircleCheck, CircleUserRound, PartyPopper } from "lucide-react";
import JobColumn from "./JobColumn";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useState } from "react";
import { toast } from "sonner";

import ErrorBoundary from "../ui/ErrorBoundary";
import { updateJob } from "@/app/actions/jobs/updateJob";
import useIsLargeScreen from "@/lib/hooks/useIsLargeScreen";

export default function AppTrackerColumns({
  groupedJobs,
}: {
  groupedJobs: Record<JobStage, Job[]>;
}) {
  const [columns, setColumns] = useState(groupedJobs);
  const isLargeScreen = useIsLargeScreen();

  // Function to handle stage changes from mobile buttons
  const handleStageChange = (jobId: string, newStage: JobStage) => {
    setColumns((prev) => {
      const updated = { ...prev };

      // Find the job in any column and remove it
      Object.keys(updated).forEach((stage) => {
        updated[stage as JobStage] = updated[stage as JobStage].filter(
          (job) => job.id !== jobId
        );
      });

      // Add the job to the new stage
      const job = Object.values(prev)
        .flat()
        .find((j) => j.id === jobId);

      if (job) {
        updated[newStage] = [{ ...job, stage: newStage }, ...updated[newStage]];
      }

      return updated;
    });
  };

  // Function to handle job deletion (rejection)
  const handleJobDeletion = (jobId: string) => {
    setColumns((prev) => {
      const updated = { ...prev };

      // Remove the job from all columns
      Object.keys(updated).forEach((stage) => {
        updated[stage as JobStage] = updated[stage as JobStage].filter(
          (job) => job.id !== jobId
        );
      });

      return updated;
    });
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id.toString();
    const destinationStage = over.id.toString() as JobStage;

    const sourceStage = Object.entries(columns).find(([, jobs]) =>
      jobs.some((job) => job.id === jobId)
    )?.[0] as JobStage;

    if (!sourceStage || sourceStage === destinationStage) return;

    const draggedJob = columns[sourceStage].find((j) => j.id === jobId);
    if (!draggedJob) return;

    setColumns((prev) => {
      const updated = { ...prev };
      updated[sourceStage] = updated[sourceStage].filter((j) => j.id !== jobId);
      updated[destinationStage] = [draggedJob, ...updated[destinationStage]];
      return updated;
    });

    try {
      await updateJob({
        type: "setStage",
        jobId,
        stage: destinationStage,
      });

      toast.success(
        `Moved job to the ${destinationStage
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase())} column!`
      );
    } catch (error) {
      console.error("Error updating job stage: ", error);
      toast.error("Failed to update job stage. Reverting...");

      setColumns((prev) => {
        const updated = { ...prev };
        updated[destinationStage] = updated[destinationStage].filter(
          (j) => j.id !== jobId
        );
        updated[sourceStage] = [draggedJob, ...updated[sourceStage]];
        return updated;
      });
    }
  }

  const gridContent = (
    <div className="lg:grid-cols-3 grid grid-cols-1 gap-5 h-full min-h-0 flex-1">
      <JobColumn
        id="APPLIED"
        jobs={columns.APPLIED}
        title="Applied"
        color="--app-dark-purple"
        icon={CircleCheck}
        description="Track jobs you've submitted an application to."
        isDraggable={isLargeScreen}
        onStageChange={handleStageChange}
        onJobDeletion={handleJobDeletion}
      />
      <JobColumn
        id="INTERVIEW"
        jobs={columns.INTERVIEW}
        title="Interview"
        color="--app-blue"
        icon={CircleUserRound}
        description="Once you've landed an interview, it will show up here."
        isDraggable={isLargeScreen}
        onStageChange={handleStageChange}
        onJobDeletion={handleJobDeletion}
      />
      <JobColumn
        id="OFFER"
        jobs={columns.OFFER}
        title="Offer"
        color="--app-light-blue"
        icon={PartyPopper}
        description="Congrats! Companies that have offered you a position will appear here."
        isDraggable={isLargeScreen}
        onStageChange={handleStageChange}
        onJobDeletion={handleJobDeletion}
      />
    </div>
  );

  return (
    <ErrorBoundary>
      {isLargeScreen ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          {gridContent}
        </DndContext>
      ) : (
        gridContent
      )}
    </ErrorBoundary>
  );
}
