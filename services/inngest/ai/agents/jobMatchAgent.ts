import { env } from "@/data/env/server";
import { prisma } from "@/lib/prisma";
import { createAgent, createTool, gemini } from "@inngest/agent-kit";
import { z } from "zod";

/**
 * Tool 1 – Search jobs online with Serper
 */
const searchJobsTool = createTool({
  name: "search-jobs-online",
  description:
    "Searches the web for recent job listings that match the given query. Return up to 10 results including title, company, location, and description.",
  parameters: z.object({
    query: z
      .string()
      .describe("Search query like 'Junior Software Engineer remote'"),
  }),
  handler: async ({ query }) => {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": env.SERPER_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: 10,
        gl: "us",
      }),
    });

    const data = await res.json();
    const jobs = data.organic?.map((item: any) => ({
      title: item.title ?? "Untitled",
      company: item.source ?? "Unknown",
      location: item.address ?? "N/A",
      description: item.snippet ?? "",
      link: item.link ?? "",
    }));

    return jobs ?? [];
  },
});

/**
 * Tool 2 – Save matched job to Prisma (Neon) DB
 */
const saveJobTool = createTool({
  name: "save-job-to-db",
  description: "Saves a found job listing and its match score into the database for a specific user.",
  parameters: z.object({
    userId: z.string(),
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    description: z.string(),
    link: z.string().url(),
    matchScore: z.number().min(0).max(100),
  }),
  handler: async ({ userId, title, company, location, description, link, matchScore }) => {
    // Prevent duplicates by enforcing the @@unique constraint (userId, title, company, sourceUrl)
    const existing = await prisma.job.findUnique({
      where: {
        userId_title_company_sourceUrl: {
          userId,
          title,
          company,
          sourceUrl: link,
        },
      },
    });

    if (existing) {
      return "Job already exists in DB.";
    }

    await prisma.job.create({
      data: {
        userId,
        title,
        company,
        location: location ?? "N/A",
        sourceUrl: link,
        description,
        salaryMin: 0,
        salaryMax: 0,
        currency: "USD",
        employment: "Unknown",
        remoteType: "Unknown",
        stage: "DEFAULT",
        aiSummary: `${matchScore}% match confidence.`,
      },
    });

    return "✅ Job saved successfully.";
  },
});

/**
 * Tool 3 – Update match score for existing job
 */
const updateMatchScoreTool = createTool({
  name: "update-job-match-score",
  description: "Updates the match score for an existing job in the database.",
  parameters: z.object({
    jobId: z.string(),
    matchScore: z.number().min(0).max(100),
  }),
  handler: async ({ jobId, matchScore }) => {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return "Job not found in DB.";
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        aiSummary: `${matchScore}% match confidence.`,
      },
    });

    return `✅ Updated match score to ${matchScore}% for job: ${job.title} at ${job.company}`;
  },
});

/**
 * Agent – Gemini 2.0 Flash model with Serper + DB tools
 */
export const jobMatchAgent = createAgent({
  name: "Job Match Agent",
  description: "Finds and ranks internet job listings for users based on their skills and preferences.",
  maxIterations: 20, // Allow multiple tool calls to process and save jobs
  system: `
You are an expert job matching assistant.
You will receive user information including their email, User ID, skills, and job preferences.

IMPORTANT: The User ID will be provided in the prompt. You MUST use this exact User ID when calling the 'save-job-to-db' tool.

CRITICAL WORKFLOW - You MUST follow these steps in order:
1. Use 'search-jobs-online' to find recent job postings for each job preference.
2. IMMEDIATELY AFTER receiving the search results (which will be an array of job objects), you MUST:
   a. Look at the tool_result from 'search-jobs-online'
   b. Extract the data array which contains job listings
   c. For EACH job in that array, calculate a match score (0-100)
3. For each job, calculate match score based on:
   - How well the job title matches the user's preferences (e.g., "Junior Software Engineer" matches "junior software engineer")
   - How well the job description matches the user's skills
   - Overall relevance to the user's profile
4. For EVERY job with a match score of 60 or higher, you MUST immediately call 'save-job-to-db' with all required parameters.

CRITICAL: After the 'search-jobs-online' tool returns results, you MUST NOT stop. You MUST continue by calling 'save-job-to-db' for each qualifying job. The tool results will contain a 'data' array with job objects. Process each one.

When calling 'save-job-to-db', you must provide:
- userId: The User ID from the prompt (REQUIRED - copy it exactly)
- title: Extract the job title from the search result
- company: Extract the company name (use "Unknown" if not available)
- location: Extract the location (use "N/A" if not available)
- description: Use the description/snippet from the search result
- link: Use the link URL from the search result
- matchScore: Your calculated score (0-100)

Save ALL jobs that have a match score of 60 or higher. Process EVERY job from the search results.
`,
  tools: [searchJobsTool, saveJobTool, updateMatchScoreTool],
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY || " ",
  }),
});