import { env } from "@/data/env/server";
import { createAgent, gemini } from "@inngest/agent-kit";
import { z } from "zod";

// Schema for job data that will be matched
const jobSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  employment: z.string(), // full-time, part-time, etc.
  remoteType: z.string(), // remote, hybrid, onsite
  salaryMin: z.number(),
  salaryMax: z.number(),
  description: z.string(),
  aiSummary: z.string().optional(),
  skills: z.array(z.string()),
  responsibilities: z.array(z.string()),
  qualifications: z.array(z.string()),
  url: z.string(),
});

export type JobForMatching = z.infer<typeof jobSchema>;

// Create agent for intelligent job matching
export function createJobMatchingAgent(
  userProfile: {
    skills: string[];
    jobPreferences: string[];
    city?: string | null;
  },
  jobs: JobForMatching[],
  { maxNumberOfJobs }: { maxNumberOfJobs?: number } = {}
) {
  const NO_JOBS = "NO_JOBS";

  return createAgent({
    name: "Job Matching Agent",
    description: "Agent for intelligently matching users with job listings based on skills, preferences, location, and requirements",
    system: `You are an expert at matching people with jobs. You will analyze the user's profile and job requirements to find the best matches.

User Profile:
- Skills: ${userProfile.skills.join(", ") || "Not specified"}
- Job Preferences: ${userProfile.jobPreferences.join(", ") || "Not specified"}
- Location: ${userProfile.city || "Not specified"}

${maxNumberOfJobs ? `Return up to ${maxNumberOfJobs} jobs that best match the user.` : "Return all jobs that match the user's profile."}

Consider the following when matching:
1. **Skills Match**: How well do the user's skills match the job requirements?
2. **Job Preferences**: Does the job title/description align with user's preferences?
3. **Location**: Does the location work for the user? (Consider remote/hybrid options)
4. **Experience Level**: Can the user handle this role based on qualifications?
5. **Overall Fit**: Consider salary expectations, company, and job description

Return the jobs as a comma-separated list of job URLs (use the url field). If no jobs match well, return "${NO_JOBS}".

Available jobs:
${JSON.stringify(
  jobs.map((job) => ({
    url: job.url,
    title: job.title,
    company: job.company,
    location: job.location,
    employment: job.employment,
    remoteType: job.remoteType,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    aiSummary: job.aiSummary,
    skills: job.skills,
    qualifications: job.qualifications.slice(0, 5), // Limit to first 5 for context
    responsibilities: job.responsibilities.slice(0, 5), // Limit to first 5 for context
  })),
  null,
  2
)}`,
    model: gemini({
      model: "gemini-2.0-flash",
      apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
    }),
  });
}

// Get the last output message from agent result
export function getLastOutputMessage(
  result: Awaited<ReturnType<ReturnType<typeof createAgent>["run"]>>
): string | null {
  const lastMessage = result.output.at(-1);
  
  if (lastMessage == null || lastMessage.type !== "text") {
    return null;
  }
  
  return typeof lastMessage.content === "string"
    ? lastMessage.content.trim()
    : lastMessage.content.join("\n").trim();
}

// Match jobs using AI agent
export async function matchJobsWithAgent(
  userProfile: {
    skills: string[];
    jobPreferences: string[];
    city?: string | null;
  },
  jobs: JobForMatching[],
  options?: { maxNumberOfJobs?: number }
): Promise<JobForMatching[]> {
  if (jobs.length === 0) {
    return [];
  }

  const agent = createJobMatchingAgent(userProfile, jobs, options);
  const result = await agent.run(
    `Find jobs that match my profile. I am looking for opportunities that align with my skills and preferences.`
  );

  const lastMessage = getLastOutputMessage(result);
  
  if (!lastMessage || lastMessage === "NO_JOBS") {
    return [];
  }

  // Extract URLs from agent response
  const matchedUrls = lastMessage
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.startsWith("http"));

  // Map URLs back to job objects
  const matchedJobs = matchedUrls
    .map((url) => jobs.find((job) => job.url === url))
    .filter((job): job is JobForMatching => job !== undefined);

  return matchedJobs;
}

