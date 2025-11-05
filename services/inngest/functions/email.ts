import { jobMatchAgent } from "../ai/agents/jobMatchAgent";
import { getLastOutputMessage } from "../ai/jobMatchingAgent";
import { inngest } from "../client";
import { prisma } from "@/lib/prisma";


export const dailyJobMatchFetcher = inngest.createFunction(
  { id: "daily-job-match-fetcher", name: "Fetch Daily Job Matches" },
  { cron: "TZ=America/Los_Angeles 0 7 * * *" },
  async ({ step }) => {
    const users = await step.run("get-users", async () => {
      return prisma.user.findMany({
        where: {
          notificationSettings: { newJobEmailNotifications: true },
        },
        select: {
          id: true,
          email: true,
          jobPreferences: true,
          skills: true,
        },
      });
    });

    for (const user of users) {
      if (!user.jobPreferences?.length) continue;

      const prompt = `
        User Information:
        Email: ${user.email}
        Skills: ${user.skills.join(", ")}
        Job Preferences: ${user.jobPreferences.join(", ")}

Find and rank relevant jobs for this user.
      `;

      const result = await step.run(`match-jobs-${user.id}`, async () => {
        const res = await jobMatchAgent.run(prompt);
        return getLastOutputMessage(res);
      });

      console.log(`Processed ${user.email}`);
      console.log(result);
    }

    return { success: true, processed: users.length };
  }
);