"use client";

import { useState, useCallback } from "react";
import { Job, JobStage } from "@/app/generated/prisma";
import { useUpdateJobStage } from "./useUpdateJobStage";

import { findJobInColumns } from "@/lib/utils/jobUtils";
import { STAGE_LABELS } from "@/lib/config/jobStage";
import { jobToasts } from "@/lib/utils/toast";

interface UseStageChangeOperationsProps {
  initialColumns: Record<JobStage, Job[]>;
}

export function useStageChangeOperations({ initialColumns }: UseStageChangeOperationsProps) {
  const [columns, setColumns] = useState(initialColumns);
  const mutation = useUpdateJobStage();

  // Generic function to move a job between stages
  const moveJobToStage = useCallback((
    jobId: string,
    newStage: JobStage,
    sourceStage?: JobStage
  ) => {
    const job = sourceStage 
      ? columns[sourceStage].find(j => j.id === jobId)
      : findJobInColumns(jobId, columns);

    if (!job) return;

    setColumns(prev => {
      const updated = { ...prev };
      
      // Remove from all stages first
      Object.keys(updated).forEach(stage => {
        updated[stage as JobStage] = updated[stage as JobStage].filter(
          j => j.id !== jobId
        );
      });

      // Add to new stage
      updated[newStage] = [{ ...job, stage: newStage }, ...updated[newStage]];
      
      return updated;
    });

    return job;
  }, [columns]);

  // Generic function to revert a job move
  const revertJobMove = useCallback((
    jobId: string,
    originalStage: JobStage,
    newStage: JobStage
  ) => {
    setColumns(prev => {
      const updated = { ...prev };
      
      // Remove from new stage
      updated[newStage] = updated[newStage].filter(j => j.id !== jobId);
      
      // Add back to original stage
      const job = Object.values(prev).flat().find(j => j.id === jobId);
      if (job) {
        updated[originalStage] = [job, ...updated[originalStage]];
      }
      
      return updated;
    });
  }, []);

  // Generic stage change handler with error handling
  const handleStageChange = useCallback(async (
    jobId: string,
    newStage: JobStage,
    sourceStage?: JobStage
  ) => {
    const job = moveJobToStage(jobId, newStage, sourceStage);
    if (!job) return;

    try {
      await mutation.mutateAsync({
        type: "setStage",
        jobId,
        stage: newStage,
      });

      jobToasts.stageChanged({ title: job.title, company: job.company }, newStage);
    } catch (error) {
      console.error("Error updating job stage:", error);
      jobToasts.error("Failed to update job stage. Reverting...");
      
      revertJobMove(jobId, job.stage, newStage);
    }
  }, [mutation, moveJobToStage, revertJobMove]);

  // Function to handle job deletion
  const handleJobDeletion = useCallback((jobId: string) => {
    setColumns(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(stage => {
        updated[stage as JobStage] = updated[stage as JobStage].filter(
          job => job.id !== jobId
        );
      });
      return updated;
    });
  }, []);

  return {
    columns,
    setColumns,
    handleStageChange,
    handleJobDeletion,
    isPending: mutation.isPending,
  };
}
