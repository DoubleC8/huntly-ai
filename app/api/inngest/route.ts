import { dailyJobSearchForAllUsers, searchJobsForUser } from "@/services/inngest/ai/getJobs";
import { inngest } from "@/services/inngest/client";
import { clerkCreateUser, clerkUpdateUser, clerkDeleteUser } from "@/services/inngest/functions/clerk";
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
    //searchJobsForUser,
    //dailyJobSearchForAllUsers,
  ],
});