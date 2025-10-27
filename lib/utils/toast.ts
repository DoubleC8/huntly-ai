import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_LABELS } from "@/lib/config/jobStage";
import { formatEntry, formatResumeTitle, formatTimestamp } from "../utils";

type JobCtx = { title: string, company: string };

type ResumeCtx = { resumeTitle: string };

type ProfileCtx = { formattedKeys?: string, fields?: string[] }

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

  resumeUpdatedJobTitle: (ctx: ResumeCtx) => 
    toast.info(`Target job title changed to: "${formatResumeTitle(ctx.resumeTitle)}".`, {
      description: `${formatTimestamp()}`
    }),
  
  resumeDeleted: (ctx: ResumeCtx) => 
    toast.warning(`Deleted "${formatResumeTitle(ctx.resumeTitle)}" from your resume list.`, {
      description: `${formatTimestamp()}`
    }), 

  error: (message = "Something went wrong", description?: string) => 
      toast.error(message, { description })
}

export const profileToasts = {
  updatedPersonalInfo: (ctx: ProfileCtx) => 
    toast.success(`Updated ${ctx.formattedKeys}!`, {
      description: `${formatTimestamp()}`
    }),
  
  addedFields: (ctx: ProfileCtx) => {
    toast.success("Skills added successfully!", {
        description: `${
          ctx.fields?.length ?? 0
        } skills saved to your profile.`,
      });
  },
  
  addedEducation: () => {
    toast.success("Education entry added successfully!", {
      description: `${formatTimestamp()}`
    })
  }, 
  
  updateEducation: () => {
    toast.info("Education updated successfully!", {
      description: `${formatTimestamp()}`
    })
  },

  deletedField: (field: string) => {
    toast.warning(`"${formatEntry(field)}" deleted.`, {
      description: `${formatTimestamp()}`
    })
  },

  noInfoChanged: () => {
    toast.info("No values changed.");
  }, 

  error: (message = "Something went wrong", description?: string) => 
      toast.error(message, { description })
}