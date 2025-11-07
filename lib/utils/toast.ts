import { toast } from "sonner";
import { JobStage } from "@/app/generated/prisma";
import { STAGE_LABELS } from "@/lib/config/jobStage";
import { formatEntry, formatResumeTitle, formatTimestamp } from "../utils";

type JobCtx = { title: string, company: string };

type ResumeCtx = { resumeTitle: string };

type ProfileCtx = { 
  formattedKeys?: string, 
  fields?: string[], 
  fieldType?: "skills" | "jobPreferences" | "education" | "githubUrl" | "linkedInUrl" | "portfolioUrl" | "phoneNumber" | "city"
}

export const jobToasts = {
    stageChanged: (ctx: JobCtx, to: JobStage) =>
    toast.success(`${ctx.title} @ ${ctx.company}`, {
      description: `Moved to ${STAGE_LABELS[to]}.`,
    }),

  wishlistAdded: (ctx: JobCtx) =>
    toast.success(`${ctx.title} @ ${ctx.company}`, {
      description: `Added to Wishlist.`,
    }),

  wishlistRemoved: (ctx: JobCtx) =>
    toast.info(`${ctx.title} @ ${ctx.company}`, {
      description: `Removed from Wishlist.`,
    }),

  rejected: (ctx: JobCtx) =>
    toast.warning(`${ctx.title} @ ${ctx.company}`, {
      description: `Marked as Rejected.`,
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
    toast.info(`Made ${formatResumeTitle(ctx.resumeTitle)} your default resume.`, {
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
const getFieldLabel = (fieldType?: "skills" | "jobPreferences" | "education" | "githubUrl" | "linkedInUrl" | "portfolioUrl" | "phoneNumber" | "city"): string => {
  switch (fieldType) {
    case "skills":
      return "Skills";
    case "jobPreferences":
      return "Job Preferences";
    case "education":
      return "Education";
    case "githubUrl":
      return "GitHub URL";
    case "linkedInUrl":
      return "LinkedIn URL";
    case "portfolioUrl":
      return "Portfolio URL";
    case "phoneNumber":
      return "Phone Number";
    case "city":
      return "City";
    default:
      return "Item";
  }
};

const getFieldLabelPlural = (fieldType?: "skills" | "jobPreferences" | "education" | "githubUrl" | "linkedInUrl" | "portfolioUrl" | "phoneNumber" | "city"): string => {
  switch (fieldType) {
    case "skills":
      return "Skills";
    case "jobPreferences":
      return "Job Preferences";
    case "education":
      return "Education";
    case "githubUrl":
      return "GitHub URL";
    case "linkedInUrl":
      return "LinkedIn URL";
    case "portfolioUrl":
      return "Portfolio URL";
    case "phoneNumber":
      return "Phone Number";
    case "city":
      return "City";
    default:
      return "Items";
  }
};

export const profileToasts = {
  updatedPersonalInfo: (ctx: ProfileCtx) => 
    toast.success(`Updated ${ctx.formattedKeys}!`, {
      description: `${formatTimestamp()}`
    }),

  missingPrerequisites: (ctx: { missingResume: boolean; missingSkills: boolean }) => {
    const missingItems: string[] = [];
    if (ctx.missingResume) missingItems.push("a resume");
    if (ctx.missingSkills) missingItems.push("skills");

    const requirement =
      missingItems.length === 1
        ? missingItems[0]
        : `${missingItems[0]} and ${missingItems[1]}`;

    toast.warning("Add required profile info first", {
      description: `Please add ${requirement} before searching for jobs.`,
    });
  },

  jobPreferenceLimitReached: () =>
    toast.info("Job preference limit reached", {
      description: "You can save up to 5 job preferences.",
    }),

  jobPreferenceRateLimited: (seconds: number) =>
    toast.info("Slow down just a bit", {
      description: `Please wait ${seconds} seconds before adding another job preference.`,
    }),

  jobSearchCompleted: (ctx: { jobsFound?: number }) =>
    toast.success("Job search complete", {
      description:
        ctx.jobsFound && ctx.jobsFound > 0
          ? `Found ${ctx.jobsFound} new job${ctx.jobsFound === 1 ? "" : "s"} for you.`
          : "No new jobs matched this time, but we'll keep looking.",
    }),
  
  addedFields: (ctx: ProfileCtx) => {
    const fieldLabel = getFieldLabelPlural(ctx.fieldType);
    const count = ctx.fields?.length ?? 0;
    
    toast.success(`${fieldLabel} updated successfully!`, {
      description: `${count} ${count === 1 ? getFieldLabel(ctx.fieldType) : fieldLabel.toLowerCase()} saved to your profile.`,
    });
  },

  deletedField: (ctx: ProfileCtx & { field?: string }) => {
    const fieldLabel = getFieldLabel(ctx.fieldType);
    const deletedItem = ctx.field ?? "item";
    
    toast.warning(`"${formatEntry(deletedItem)}" removed from your ${fieldLabel}.`);
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