import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { resend } from "@/services/resend/client";
import DailyJobListingEmail from "@/services/resend/components/DailyJobListingEmail";
import {
  searchJobsForEmail,
  type UserProfile,
  type JobSearchResult,
} from "../utils/jobSearchUtils";
import { startOfDay } from "date-fns";
import { JOB_PREFERENCE_LIMIT } from "@/lib/constants/profile";

const DAILY_JOB_LIMIT = 5;

type SaveJobsResult = {
  created: number;
  updated: number;
  skippedDueToLimit: number;
};

async function saveJobsToDatabase(
  userId: string,
  jobs: JobSearchResult[],
  maxNewJobsPerDay: number = DAILY_JOB_LIMIT
): Promise<SaveJobsResult> {
  if (jobs.length === 0) {
    return { created: 0, updated: 0, skippedDueToLimit: 0 };
  }

  const todayStart = startOfDay(new Date());

  let createdToday = await prisma.job.count({
    where: {
      userId,
      createdAt: {
        gte: todayStart,
      },
    },
  });

  let created = 0;
  let updated = 0;
  let skippedDueToLimit = 0;

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

      const existingJob = await prisma.job.findUnique({
        where: {
          userId_title_company_sourceUrl: {
            userId,
            title: job.title || "Unknown",
            company: job.company || "Unknown",
            sourceUrl: job.sourceUrl,
          },
        },
      });

      const data = {
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
      };

      if (existingJob) {
        await prisma.job.update({
          where: { id: existingJob.id },
          data,
        });
        updated += 1;
        continue;
      }

      if (createdToday >= maxNewJobsPerDay) {
        skippedDueToLimit += 1;
        continue;
      }

      await prisma.job.create({
        data: {
          userId,
          sourceUrl: job.sourceUrl,
          title: job.title || "Unknown",
          company: job.company || "Unknown",
          ...data,
        },
      });

      created += 1;
      createdToday += 1;
    } catch (error) {
      console.error(
        `Failed to save job ${job.title} at ${job.company} for user ${userId}:`,
        error
      );
    }
  }

  console.log(
    `Daily job save summary for ${userId}: created=${created}, updated=${updated}, skippedDueToLimit=${skippedDueToLimit}`
  );

  return { created, updated, skippedDueToLimit };
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
    const usersWithPreferences = await step.run(
      "get-users-with-job-preferences",
      async () => {
        return await prisma.user.findMany({
          where: {
            jobPreferences: {
              isEmpty: false,
            },
          },
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
            notificationSettings: {
              select: {
                newJobEmailNotifications: true,
              },
            },
          },
        });
      }
    );

    if (usersWithPreferences.length === 0) {
      console.log("No users with job preferences configured");
      return { message: "No users with job preferences configured" };
    }

    console.log(
      `Found ${usersWithPreferences.length} users with job preferences`
    );

    const events = usersWithPreferences
      .filter((user) => (user.jobPreferences || []).length > 0)
      .map((user) => {
        const limitedPreferences = (user.jobPreferences || []).slice(
          0,
          JOB_PREFERENCE_LIMIT
        );
        const userData = {
          userId: user.id,
          userEmail: user.email,
          userName: user.name || "User",
          jobPreferences: limitedPreferences,
          skills: user.skills || [],
          resumeSummary: user.resumes[0]?.aiSummary || null,
          newJobEmailNotifications:
            user.notificationSettings?.newJobEmailNotifications ?? false,
        };

        console.log(
          `Creating job processing event for user: ${userData.userId} (preferences: ${limitedPreferences.join(", ")})`
        );

        return {
          name: "app/jobs.daily-processing" as const,
          data: userData,
        };
      });

    await step.sendEvent("send-daily-job-processing-events", events);

    return {
      message: `Prepared daily job processing for ${usersWithPreferences.length} users`,
      userIds: usersWithPreferences.map((user) => user.id),
    };
  }
);

export const processDailyJobNotifications = inngest.createFunction(
  {
    id: "process-daily-job-notifications",
    name: "Process Daily Job Notifications",
    throttle: {
      limit: 3,
      period: "1m",
    },
  },
  { event: "app/jobs.daily-processing" },
  async ({ event, step }) => {
    const eventData = (event as any).data || event;
    const {
      userId,
      userEmail,
      userName,
      jobPreferences = [],
      skills = [],
      resumeSummary,
      newJobEmailNotifications = false,
    } = eventData;

    if (!userId) {
      console.error("Missing userId in daily processing event:", eventData);
      return { message: "Missing userId", eventData };
    }

    const limitedPreferences = jobPreferences.slice(0, JOB_PREFERENCE_LIMIT);

    if (!limitedPreferences.length) {
      console.log(`User ${userId} has no job preferences, skipping processing`);
      return { message: "User has no job preferences", userId };
    }

    const userProfile: UserProfile = {
      id: userId,
      jobPreferences: limitedPreferences,
      skills,
      resumeSummary: resumeSummary || null,
    };

    const jobs = await step.run("search-and-match-jobs", async () => {
      console.log(
        `Starting daily job search for user ${userId} with preferences: ${limitedPreferences.join(", ")}`
      );
      return await searchJobsForEmail(userProfile, DAILY_JOB_LIMIT);
    });

    if (jobs.length === 0) {
      console.log(`No jobs found for user ${userId}, skipping email dispatch`);
      return {
        message: "No jobs found for user",
        userId,
        jobPreferences: limitedPreferences,
      };
    }

    const saveResult = await step.run("save-jobs-to-database", async () => {
      return await saveJobsToDatabase(userId, jobs, DAILY_JOB_LIMIT);
    });

    if (newJobEmailNotifications) {
      await step.sendEvent("queue-email-notification", {
        name: "app/email.daily-job-notifications" as const,
        data: {
          userId,
          userEmail,
          userName: userName || "User",
          jobPreferences: limitedPreferences,
          skills,
          resumeSummary: resumeSummary || null,
          jobs,
          jobsAlreadyPersisted: true,
        },
      });

      console.log(
        `Queued daily job email for user ${userId} with ${jobs.length} jobs`
      );
    } else {
      console.log(
        `User ${userId} has email notifications disabled; jobs saved without email`
      );
    }

    return {
      message: "Processed daily job search for user",
      userId,
      jobsFound: jobs.length,
      jobsCreated: saveResult.created,
      jobsUpdated: saveResult.updated,
      jobsSkippedDueToLimit: saveResult.skippedDueToLimit,
      emailQueued: newJobEmailNotifications && jobs.length > 0,
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
    const {
      userId,
      userEmail,
      userName,
      jobPreferences,
      skills,
      resumeSummary,
      jobs: precomputedJobs,
      jobsAlreadyPersisted = false,
    } = eventData;

    const limitedPreferences = (jobPreferences || []).slice(
      0,
      JOB_PREFERENCE_LIMIT
    );

    console.log(`Processing job notifications for user: ${userId} (${userEmail})`);
    console.log(`Event data:`, JSON.stringify(eventData, null, 2));
    console.log(
      `User job preferences: ${JSON.stringify(limitedPreferences)}`
    );
    console.log(`User skills: ${JSON.stringify(skills)}`);

    // Validate required data
    if (!userId || !userEmail) {
      console.error("Missing required user data in event:", eventData);
      return { message: "Missing required user data", eventData };
    }

    if (!limitedPreferences.length) {
      console.log(`User ${userId} has no job preferences, skipping email`);
      return { message: "User has no job preferences", userId };
    }

    let jobs: JobSearchResult[] = Array.isArray(precomputedJobs)
      ? precomputedJobs
      : [];

    if (jobs.length === 0) {
      // Create user profile for job search
      const userProfile: UserProfile = {
        id: userId,
        jobPreferences: limitedPreferences,
        skills: skills || [],
        resumeSummary: resumeSummary || null,
      };

      // Search and match jobs for this user if not provided
      jobs = await step.run("search-and-match-jobs", async () => {
        console.log(
          `Starting job search for user ${userId} with preferences: ${userProfile.jobPreferences.join(", ")}`
        );
        const result = await searchJobsForEmail(userProfile, DAILY_JOB_LIMIT);
        console.log(`searchJobsForEmail returned ${result.length} jobs`);
        return result;
      });
    } else {
      console.log(
        `Using ${jobs.length} precomputed jobs for user ${userId} (already persisted: ${jobsAlreadyPersisted})`
      );
    }

    console.log(`Found ${jobs.length} jobs for user ${userId}`);

    if (jobs.length === 0) {
      console.log(`No jobs found for user ${userId}, skipping email`);
      return { message: "No jobs found for user", userId, jobPreferences };
    }

    if (!jobsAlreadyPersisted) {
      await step.run("save-jobs-to-database", async () => {
        await saveJobsToDatabase(userId, jobs, DAILY_JOB_LIMIT);
      });
    } else {
      console.log(
        `Skipping database persistence for user ${userId} because jobs are already saved`
      );
    }

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
