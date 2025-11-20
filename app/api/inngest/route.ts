import { inngest } from "@/services/inngest/client";
import { clerkCreateUser, clerkUpdateUser, clerkDeleteUser } from "@/services/inngest/functions/clerk";
import { createAiSummaryOfUploadedResume } from "@/services/inngest/functions/resume";
import { searchJobsForUser } from "@/services/inngest/functions/jobSearch";
import { prepareDailyJobNotifications, processDailyJobNotifications, sendDailyJobNotificationEmail } from "@/services/inngest/functions/email";
import { serve } from "inngest/next";


// Create an API that serves Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
    createAiSummaryOfUploadedResume,
    searchJobsForUser,
    prepareDailyJobNotifications,
    processDailyJobNotifications,
    sendDailyJobNotificationEmail,
  ],
});