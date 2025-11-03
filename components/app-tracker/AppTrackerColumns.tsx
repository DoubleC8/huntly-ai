"use client";

import { Job, JobStage } from "@/app/generated/prisma";
import JobColumn from "./JobColumn";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import ErrorBoundary from "../ui/ErrorBoundary";
import useIsLargeScreen from "@/lib/hooks/useIsLargeScreen";
import { useJobStageCounts } from "@/lib/hooks/jobs/useJobStageCounts";
import { useStageChangeOperations } from "@/lib/hooks/jobs/useStageChangeOperations";
import { COLUMN_CONFIGS } from "./columnConfig";
import LoadingWrapper from "./LoadingWrapper";
import { findJobStage } from "@/lib/utils/jobUtils";

export default function AppTrackerColumns({
  groupedJobs,
}: {
  groupedJobs: Record<JobStage, Job[]>;
}) {
  const isLargeScreen = useIsLargeScreen();
  const { data: counts, isLoading: countsLoading } = useJobStageCounts();

  const { columns, handleStageChange, isPending } = useStageChangeOperations({
    initialColumns: groupedJobs,
  });

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id.toString();
    const destinationStage = over.id.toString() as JobStage;
    const sourceStage = findJobStage(jobId, columns);

    if (!sourceStage || sourceStage === destinationStage) return;

    await handleStageChange(jobId, destinationStage, sourceStage);
  }

  const gridContent = (
    <div className="lg:grid-cols-3 grid grid-cols-1 gap-5 h-full min-h-[94vh] flex-1">
      {COLUMN_CONFIGS.map((config) => (
        <JobColumn
          key={config.id}
          id={config.id}
          jobs={columns[config.id]}
          title={config.title}
          count={counts?.[config.id] ?? columns[config.id].length}
          isLoading={countsLoading}
          color={config.color}
          icon={config.icon}
          description={config.description}
          isDraggable={isLargeScreen}
          onStageChange={handleStageChange}
        />
      ))}
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
          <LoadingWrapper isLoading={isPending}>{gridContent}</LoadingWrapper>
        </DndContext>
      ) : (
        <LoadingWrapper isLoading={isPending}>{gridContent}</LoadingWrapper>
      )}
    </ErrorBoundary>
  );
}
