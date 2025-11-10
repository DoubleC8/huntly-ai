import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { resend } from "@/services/resend/client";
import DailyJobListingEmail from "@/services/resend/components/DailyJobListingEmail";
import {
  searchJobsForEmail,
  type UserProfile,
  type JobSearchResult,
} from "../utils/jobSearchUtils";

async function saveJobsToDatabase(userId: string, jobs: JobSearchResult[]) {
  if (jobs.length === 0) return;

  let saved = 0;
  for (const job of jobs) {
    try {
      const salaryMin = Number.isFinite(job.salaryMin)
        ? Math.round(job.salaryMin)
        : 0;
      const salaryMax = Number.isFinite(job.salaryMax)
        ? Math.round(job.salaryMax)
        : 0;
      const description =
        job.description ||
        job.aiSummary ||
        "Job description not available.";

      await prisma.job.upsert({
        where: {
          userId_title_company_sourceUrl: {
            userId,
            title: job.title || "Unknown",
            company: job.company || "Unknown",
            sourceUrl: job.sourceUrl,
          },
        },
        update: {
          location: job.location || "Unknown",
          employment: job.employment || "Full-time",
          remoteType: job.remoteType || "On-site",
          salaryMin,
          salaryMax,
          currency: job.currency || "USD",
          description,
          aiSummary: job.aiSummary,
          skills: job.skills || [],
          responsibilities: job.responsibilities || [],
          qualifications: job.qualifications || [],
          postedAt: job.postedAt ? new Date(job.postedAt) : null,
          matchScore: job.matchScore,
        },
        create: {
          userId,
          sourceUrl: job.sourceUrl,
          title: job.title || "Unknown",
          company: job.company || "Unknown",
          location: job.location || "Unknown",
          employment: job.employment || "Full-time",
          remoteType: job.remoteType || "On-site",
          salaryMin,
          salaryMax,
          currency: job.currency || "USD",
          description,
          aiSummary: job.aiSummary,
          skills: job.skills || [],
          responsibilities: job.responsibilities || [],
          qualifications: job.qualifications || [],
          postedAt: job.postedAt ? new Date(job.postedAt) : null,
          matchScore: job.matchScore,
        },
      });
      saved += 1;
    } catch (error) {
      console.error(
        `Failed to save job ${job.title} at ${job.company} for user ${userId}:`,
        error
      );
    }
  }

  console.log(`Saved or updated ${saved} jobs to database for user ${userId}`);
}

// Main function to prepare daily job notifications
// This function runs daily at 6am PST and prepares job notification events for users
export const prepareDailyJobNotifications = inngest.createFunction(
  {
    id: "prepare-daily-job-notifications",
    name: "Prepare Daily Job Notifications",
  },
  {
    cron: "TZ=America/Los_Angeles 0 6 * * *", // 6am PST
  },
  async ({ step, event }) => {
    // Get all users with notifications enabled - query UserNotificationSettings first
    const notificationSettings = await step.run("get-users-with-notifications", async () => {
      return await prisma.userNotificationSettings.findMany({
        where: {
          newJobEmailNotifications: true,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              jobPreferences: true,
              skills: true,
              resumes: {
                where: { isDefault: true },
                select: {
                  aiSummary: true,
                },
                take: 1,
              },
            },
          },
        },
      });
    });

    if (notificationSettings.length === 0) {
      console.log("No users with notifications enabled");
      return { message: "No users with notifications enabled" };
    }

    console.log(`Found ${notificationSettings.length} users with notifications enabled`);

    // Create events for each user
    const events = notificationSettings.map((settings) => {
      const userData = {
        userId: settings.user.id,
        userEmail: settings.user.email,
        userName: settings.user.name || "User",
        jobPreferences: settings.user.jobPreferences || [],
        skills: settings.user.skills || [],
        resumeSummary: settings.user.resumes[0]?.aiSummary || null,
      };

      console.log(`Creating event for user: ${userData.userId} with preferences: ${userData.jobPreferences.join(", ")}`);

      return {
        name: "app/email.daily-job-notifications" as const,
        data: userData,
      };
    });

    await step.sendEvent("send-notification-events", events);

    return {
      message: `Prepared notifications for ${notificationSettings.length} users`,
      userIds: notificationSettings.map((s) => s.user.id),
    };
  }
);

// Function to send daily job notification emails
export const sendDailyJobNotificationEmail = inngest.createFunction(
  {
    id: "send-daily-job-notification-email",
    name: "Send Daily Job Notification Email",
    throttle: {
      limit: 10,
      period: "1m",
    },
  },
  { event: "app/email.daily-job-notifications" },
  async ({ event, step }) => {
    // Access event data - handle both direct data and nested data structures
    const eventData = (event as any).data || event;
    const { userId, userEmail, userName, jobPreferences, skills, resumeSummary } = eventData;

    console.log(`Processing job notifications for user: ${userId} (${userEmail})`);
    console.log(`Event data:`, JSON.stringify(eventData, null, 2));
    console.log(`User job preferences: ${JSON.stringify(jobPreferences)}`);
    console.log(`User skills: ${JSON.stringify(skills)}`);

    // Validate required data
    if (!userId || !userEmail) {
      console.error("Missing required user data in event:", eventData);
      return { message: "Missing required user data", eventData };
    }

    if (!jobPreferences || jobPreferences.length === 0) {
      console.log(`User ${userId} has no job preferences, skipping email`);
      return { message: "User has no job preferences", userId };
    }

    // Create user profile for job search
    const userProfile: UserProfile = {
      id: userId,
      jobPreferences: jobPreferences || [],
      skills: skills || [],
      resumeSummary: resumeSummary || null,
    };

    // Search and match jobs for this user
    const jobs = await step.run("search-and-match-jobs", async () => {
      console.log(`Starting job search for user ${userId} with preferences: ${userProfile.jobPreferences.join(", ")}`);
      const result = await searchJobsForEmail(userProfile, 5);
      console.log(`searchJobsForEmail returned ${result.length} jobs`);
      return result;
    });

    console.log(`Found ${jobs.length} jobs for user ${userId}`);

    if (jobs.length === 0) {
      console.log(`No jobs found for user ${userId}, skipping email`);
      return { message: "No jobs found for user", userId, jobPreferences };
    }

    await step.run("save-jobs-to-database", async () => {
      await saveJobsToDatabase(userId, jobs);
    });

    // Send email
    await step.run("send-email", async () => {
      // Get server URL from environment or use defaults
      let serverUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!serverUrl) {
        if (process.env.VERCEL_URL) {
          serverUrl = `https://${process.env.VERCEL_URL}`;
        } else {
          serverUrl = "http://localhost:3000";
        }
      }

      console.log(`Sending email to ${userEmail} with ${jobs.length} jobs`);

      await resend.emails.send({
        from: "Huntly AI <onboarding@resend.dev>",
        to: userEmail,
        subject: `Daily Job Recommendations - ${jobs.length} New ${jobs.length === 1 ? "Job" : "Jobs"}`,
        react: DailyJobListingEmail({
          jobListings: jobs.map((job) => ({
            id: job.sourceUrl, // Use URL as ID for email
            title: job.title,
            company: job.company,
            location: job.location,
            employment: job.employment,
            remoteType: job.remoteType,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            currency: job.currency,
            description: job.description,
            aiSummary: job.aiSummary,
            sourceUrl: job.sourceUrl,
            matchScore: job.matchScore,
          })),
          userName: userName || "User",
          serverUrl: serverUrl,
        }),
      });
    });

    return {
      message: "Email sent successfully",
      userId,
      jobsCount: jobs.length,
    };
  }
);
