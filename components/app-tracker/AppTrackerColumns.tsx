"use client";

import { CircleCheck, CircleUserRound, PartyPopper, Star } from "lucide-react";
import JobColumn from "./JobColumn";
import { Job, JobStage } from "@/app/generated/prisma";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { toast } from "sonner";
import { updateJobStage } from "@/app/actions/updateJobStage";
import { useState } from "react";
import useIsLargeScreen from "@/hooks/useIsLargeScreen";

export default function AppTrackerColumns({
  wishlist,
  applied,
  interview,
  offered,
}: {
  wishlist: Job[];
  applied: Job[];
  interview: Job[];
  offered: Job[];
}) {
  const isLargeScreen = useIsLargeScreen();

  const [columns, setColumns] = useState<Record<JobStage, Job[]>>({
    WISHLIST: wishlist,
    APPLIED: applied,
    INTERVIEW: interview,
    OFFER: offered,
    REJECTED: [],
  });
  //handles the drag and drop event
  //uses toast to notify the user if the change was successful
  //only calls the function if the job moves columns
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id.toString();
    const destinationStage = over.id.toString() as JobStage;

    // Skip if dropped into same column
    const sourceStage = Object.entries(columns).find(([_, jobs]) =>
      jobs.find((j) => j.id === jobId)
    )?.[0] as JobStage;

    if (sourceStage === destinationStage) return;

    const draggedJob = columns[sourceStage].find((job) => job.id === jobId);
    if (!draggedJob) return;

    setColumns((prev) => {
      const updated = { ...prev };
      updated[sourceStage] = updated[sourceStage].filter((j) => j.id !== jobId);
      updated[destinationStage] = [draggedJob, ...updated[destinationStage]];
      return updated;
    });

    try {
      await updateJobStage(jobId, destinationStage);
      toast.success(
        `Moved job to the ${
          destinationStage.charAt(0).toUpperCase() +
          destinationStage.slice(1).toLowerCase()
        } column.`,
        {
          description: "Congrats!",
        }
      );
    } catch (err) {
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
  };

  //checks if the screen is large, if it is then allow drag and drop else disable it
  return isLargeScreen ? (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <Layout columns={columns} />
    </DndContext>
  ) : (
    <Layout columns={columns} />
  );
}

function Layout({ columns }: { columns: Record<JobStage, Job[]> }) {
  return (
    <div
      className="lg:flex-row lg:justify-between lg:h-[85vh]
    relative w-full flex flex-col gap-3 "
    >
      <JobColumn
        id="WISHLIST"
        jobs={columns.WISHLIST}
        title="Wishlist"
        color="--app-purple"
        icon={Star}
        total_jobs={columns.WISHLIST.length}
        description="Jobs you’re interested in but haven’t applied to yet. Start building your wishlist!"
      />
      <JobColumn
        id="APPLIED"
        jobs={columns.APPLIED}
        title="Applied"
        color="--app-dark-purple"
        icon={CircleCheck}
        total_jobs={columns.APPLIED.length}
        description="Track jobs you've submitted an application to. Try applying to one today!"
      />
      <JobColumn
        id="INTERVIEW"
        jobs={columns.INTERVIEW}
        title="Interview"
        color="--app-blue"
        icon={CircleUserRound}
        total_jobs={columns.INTERVIEW.length}
        description="Once you’ve landed an interview, it will show up here. Keep pushing!"
      />
      <JobColumn
        id="OFFER"
        jobs={columns.OFFER}
        title="Offer"
        color="--app-light-blue"
        icon={PartyPopper}
        total_jobs={columns.OFFER.length}
        description="Congrats! Companies that have offered you a position will appear here. Time to celebrate!"
      />
    </div>
  );
}
