import { updateJob, type UpdateJobInput } from "@/app/actions/jobs/updateJob";
import { JobStage } from "@/app/generated/prisma";

export const jobService = {
  async setStage(jobId: string, stage: JobStage) {
    const payload: UpdateJobInput = { type: "setStage", jobId, stage };
    return await updateJob(payload);
  },

  async toggleWishlist(jobId: string) {
    const payload: UpdateJobInput = { type: "toggleWishlist", jobId };
    return await updateJob(payload);
  },

  async setNote(jobId: string, note: string) {
    const payload: UpdateJobInput = { type: "setNote", jobId, note };
    return await updateJob(payload);
  },
};