import { Job, JobStage } from "@/app/generated/prisma";
import { STAGE_ORDER } from "@/app/constants/jobStage";

/**
 * Find the next or previous stage in the job flow
 */
export function getAdjacentStage(
  stage: JobStage,
  direction: "up" | "down"
): JobStage | null {
  const index = STAGE_ORDER.indexOf(stage);
  if (index === -1) return null;

  return direction === "up"
    ? STAGE_ORDER[index - 1] ?? null
    : STAGE_ORDER[index + 1] ?? null;
}

/**
 * Get the main flow stages (APPLIED, INTERVIEW, OFFER)
 */
export function getMainFlowStages(): JobStage[] {
  return STAGE_ORDER.filter(stage => 
    stage === JobStage.APPLIED || 
    stage === JobStage.INTERVIEW || 
    stage === JobStage.OFFER
  );
}

/**
 * Find a job by ID across all columns
 */
export function findJobInColumns(
  jobId: string,
  columns: Record<JobStage, Job[]>
): Job | null {
  return Object.values(columns)
    .flat()
    .find(job => job.id === jobId) ?? null;
}

/**
 * Find which stage a job belongs to
 */
export function findJobStage(
  jobId: string,
  columns: Record<JobStage, Job[]>
): JobStage | null {
  const entry = Object.entries(columns).find(([, jobs]) =>
    jobs.some(job => job.id === jobId)
  );
  return entry?.[0] as JobStage ?? null;
}
