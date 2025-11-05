import { inngest } from "@/services/inngest/client";
import { clerkCreateUser, clerkUpdateUser, clerkDeleteUser } from "@/services/inngest/functions/clerk";
import { dailyJobMatchFetcher } from "@/services/inngest/functions/email";
import { searchJobsOnPreferencesUpdate, updateMatchScoresOnResumeChange } from "@/services/inngest/functions/jobMatching";
import { createAiSummaryOfUploadedResume } from "@/services/inngest/functions/resume";
import { serve } from "inngest/next";


// Create an API that serves Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
    createAiSummaryOfUploadedResume,
    dailyJobMatchFetcher,
    searchJobsOnPreferencesUpdate,
    updateMatchScoresOnResumeChange,
  ],
});