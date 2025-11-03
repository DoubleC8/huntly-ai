// Test script for job search function
// Run with: npx tsx scripts/test-job-search.ts

import { inngest } from "../services/inngest/client";

async function testJobSearch() {
  // Replace with your actual user ID
  const userId = process.env.TEST_USER_ID || "your-user-id-here";

  if (userId === "your-user-id-here") {
    console.error("Please set TEST_USER_ID environment variable or update the script");
    process.exit(1);
  }

  console.log("Triggering job search for user:", userId);

  await inngest.send({
    name: "app/jobPreferences.updated",
    data: {
      user: {
        id: userId,
      },
    },
  });

  console.log("Event sent! Check Inngest dev server for results.");
}

testJobSearch().catch(console.error);

