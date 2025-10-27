import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_LABELS } from "@/lib/config/jobStage";
import { formatResumeTitle, formatTimestamp } from "../utils";

type JobCtx = { title: string, company: string };

type ResumeCtx = { resumeTitle: string }

export const jobToasts = {
    stageChanged: (ctx: JobCtx, to: JobStage) =>
    toast.success(`Moved to ${STAGE_LABELS[to]}`, {
      description: `${ctx.title} @ ${ctx.company}`,
    }),

  wishlistAdded: (ctx: JobCtx) =>
    toast.success("Added to Wishlist", {
      description: `${ctx.title} @ ${ctx.company}`,
    }),

  wishlistRemoved: (ctx: JobCtx) =>
    toast.info("Removed from Wishlist", {
      description: `${ctx.title} @ ${ctx.company}`,
    }),

  rejected: (ctx: JobCtx) =>
    toast.warning("Marked as Rejected", {
      description: `${ctx.title} @ ${ctx.company}`,
    }),

  error: (message = "Something went wrong", description?: string) =>
    toast.error(message, { description }),
}

export const resumeToasts = {
  resumeAdded: (ctx: ResumeCtx) => 
    toast.success(`Added "${formatResumeTitle(ctx.resumeTitle)}" to your resume list.`, {
      description: `${formatTimestamp()}`
    }), 
  
  resumeDeleted: (ctx: ResumeCtx) => 
    toast.warning(`Deleted "${formatResumeTitle(ctx.resumeTitle)}" from your resume list.`, {
      description: `${formatTimestamp()}`
    }), 

  error: (message = "Something went wrong", description?: string) => 
      toast.error(message, { description })
}