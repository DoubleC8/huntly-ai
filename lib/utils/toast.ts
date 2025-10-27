import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_LABELS } from "@/lib/config/jobStage";
import { formatEntry, formatResumeTitle, formatTimestamp } from "../utils";

type JobCtx = { title: string, company: string };

type ResumeCtx = { resumeTitle: string };

type ProfileCtx = { formattedKeys?: string, fields?: string[], fieldType?: "skills" | "jobPreferences" }

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

  resumeMadeDefault: (ctx: ResumeCtx) => 
    toast.info(`Made ${formatResumeTitle(ctx.resumeTitle)} default resume.`, {
      description: "This resume will be used to get your match score."
    }), 
  
  resumeDeleted: (ctx: ResumeCtx) => 
    toast.warning(`Deleted "${formatResumeTitle(ctx.resumeTitle)}" from your resume list.`, {
      description: `${formatTimestamp()}`
    }), 

  error: (message = "Something went wrong", description?: string) => 
      toast.error(message, { description })
}

// Helper function to get field label
const getFieldLabel = (fieldType?: "skills" | "jobPreferences"): string => {
  switch (fieldType) {
    case "skills":
      return "Skills";
    case "jobPreferences":
      return "Job Preferences";
    default:
      return "Item";
  }
};

const getFieldLabelPlural = (fieldType?: "skills" | "jobPreferences"): string => {
  switch (fieldType) {
    case "skills":
      return "Skills";
    case "jobPreferences":
      return "Job Preferences";
    default:
      return "Items";
  }
};

export const profileToasts = {
  updatedPersonalInfo: (ctx: ProfileCtx) => 
    toast.success(`Updated ${ctx.formattedKeys}!`, {
      description: `${formatTimestamp()}`
    }),
  
  addedFields: (ctx: ProfileCtx) => {
    const fieldLabel = getFieldLabelPlural(ctx.fieldType);
    const count = ctx.fields?.length ?? 0;
    
    toast.success(`${fieldLabel} added successfully!`, {
      description: `${count} ${count === 1 ? getFieldLabel(ctx.fieldType) : fieldLabel.toLowerCase()} saved to your profile.`,
    });
  },

  deletedField: (ctx: ProfileCtx & { field?: string }) => {
    const fieldLabel = getFieldLabel(ctx.fieldType);
    const deletedItem = ctx.field ?? "item";
    
    toast.warning(`${formatEntry(deletedItem)} removed from your ${fieldLabel}.`);
  },

  noInfoChanged: () => {
    toast.info("No values changed.");
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

  deletedEducation: () => {
    toast.warning("Education entry deleted successfully!", {
      description: `${formatTimestamp()}`
    })
  },

  error: (message = "Something went wrong", description?: string) => 
      toast.error(message, { description })
}