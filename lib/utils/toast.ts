import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_LABELS } from "@/lib/config/jobStage";

type JobCtx = { title: string, company: string };

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