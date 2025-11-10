import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { env } from "@/data/env/server";
import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { searchJobUrls } from "../utils/jobSearchUtils";
import { JOB_PREFERENCE_LIMIT } from "@/lib/constants/profile";

async function generateWithRetry<T>(
  call: (model: string) => Promise<T>,
  {
    models = ["gemini-2.0-flash-lite"],
    retriesPerModel = 3,
    initialDelayMs = 5000,
  }: {
    models?: string[];
    retriesPerModel?: number;
    initialDelayMs?: number;
  } = {}
): Promise<T> {
  let lastError: unknown;

  for (const model of models) {
    let remaining = retriesPerModel;
    let delay = initialDelayMs;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await call(model);
      } catch (error: any) {
        lastError = error;
        const status =
          error?.status ||
          error?.code ||
          error?.response?.status ||
          error?.error?.code ||
          error?.error?.status;
        const is429 =
          status === 429 ||
          status === "429" ||
          status === "RESOURCE_EXHAUSTED";

        remaining -= 1;
        if (!is429 || remaining <= 0) {
          console.warn(
            `Gemini request failed for model ${model} with status ${status}. ${is429 ? "Switching models or rethrowing." : "Rethrowing error."}`
          );
          break;
        }

        console.warn(
          `Gemini rate limit hit (status: ${status}) on model ${model}. Retrying after ${delay}ms... (${remaining} retries left)`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, 30000);
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("Gemini request failed without specific error");
}

// Tool to save job to database
const saveJobToolSchema = z.object({
  userId: z.string(),
  sourceUrl: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  employment: z.string(),
  remoteType: z.string(),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  currency: z.string().optional(),
  description: z.string(),
  aiSummary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  qualifications: z.array(z.string()).optional(),
  postedAt: z.string().optional(),
  matchScore: z.number().int().min(0).max(100),
});

type SaveJobParams = z.infer<typeof saveJobToolSchema>;

const saveJob = async ({
  userId,
  sourceUrl,
  title,
  company,
  location,
  employment,
  remoteType,
  salaryMin,
  salaryMax,
  currency,
  description,
  aiSummary,
  skills,
  responsibilities,
      qualifications,
      postedAt,
  matchScore,
}: SaveJobParams) => {
  // Check if job already exists
  const existingJob = await prisma.job.findUnique({
    where: {
      userId_title_company_sourceUrl: {
        userId,
        title,
        company,
        sourceUrl,
      },
    },
  });

  if (existingJob) {
    return {
      success: false,
      message: "Job already exists",
      jobId: existingJob.id,
    };
  }

  // Create the job
  const job = await prisma.job.create({
    data: {
      userId,
      sourceUrl,
      title,
      company,
      location,
      employment: employment || "Full-time",
      remoteType: remoteType || "On-site",
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      currency: currency || "USD",
      description,
      aiSummary,
      skills: skills || [],
      responsibilities: responsibilities || [],
      qualifications: qualifications || [],
      postedAt: postedAt ? new Date(postedAt) : null,
      matchScore,
      // Note field is left empty for user to fill in
      note: null,
    },
  });

  return { success: true, jobId: job.id, message: "Job saved successfully" };
};

export const saveJobTool = createTool({
  name: "save-job",
  description: "Saves a job listing to the database with match score",
  parameters: saveJobToolSchema,
  handler: async (params) => saveJob(params),
});


// Main job search function
export const searchJobsForUser = inngest.createFunction(
  {
    id: "search-jobs-for-user",
    name: "Search Jobs for User",
    throttle: {
      limit: 2,
      period: "1m",
    },
    concurrency: 1,
  },
  {
    event: "app/jobPreferences.updated",
  },
  async ({ step, event }) => {
    // Event structure: { data: { user: { id: string } }, ... }
    const userId = (event as any).data?.user?.id;

    if (!userId) {
      console.error("No user ID in event:", event);
      return;
    }

    // Get user data
    const user = await step.run("get-user-data", async () => {
      const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          jobPreferences: true,
          skills: true,
          resumes: {
            where: { isDefault: true },
            select: {
              aiSummary: true,
              publicUrl: true,
            },
            take: 1,
          },
        },
      });

      if (!userData) {
        throw new Error(`User not found: ${userId}`);
      }

      if (!userData.jobPreferences || userData.jobPreferences.length === 0) {
        console.log("User has no job preferences");
        return null;
      }

      return userData;
    });

    if (!user) {
      return;
    }

    // Search for jobs for each preference
    const results = [];
    const allJobUrls: Array<{
      url: string;
      jobTitle: string;
      snippet?: string | null;
      title?: string | null;
    }> = [];
    
    // Step 1: Search for job URLs (no nested steps here)
    for (const jobTitle of user.jobPreferences.slice(0, JOB_PREFERENCE_LIMIT)) {
      const searchResult = await step.run(
        `search-jobs-${jobTitle}`,
        async () => {
          try {
            const jobUrls = await searchJobUrls(jobTitle, 10);

            if (jobUrls.length === 0) {
              console.log(
                `No valid job URLs found for "${jobTitle}" after searchJobUrls`
              );
              return {
                jobTitle,
                jobUrls: [],
                message: "No valid job URLs found",
              };
            }

            return {
              jobTitle,
              jobUrls: jobUrls.slice(0, 5),
            };
          } catch (error) {
            console.error(
              `Error searching for jobs with title "${jobTitle}":`,
              error
            );
            return { jobTitle, jobUrls: [], error: String(error) };
          }
        }
      );
      
      // Collect all job URLs to process with their snippet data
      if (searchResult?.jobUrls) {
        searchResult.jobUrls.forEach((jobData: any) => {
          allJobUrls.push({
            url: typeof jobData === "string" ? jobData : jobData.url,
            jobTitle: searchResult.jobTitle,
            snippet:
              typeof jobData === "string"
                ? null
                : (jobData.snippet || ""),
            title:
              typeof jobData === "string"
                ? null
                : (jobData.title || ""),
          });
        });
      }
      
      results.push({
        jobTitle: searchResult.jobTitle,
        jobUrlsFound: searchResult.jobUrls?.length || 0,
        message:
          typeof searchResult === "object" &&
          searchResult !== null &&
          "message" in searchResult
            ? searchResult.message
            : undefined,
        error:
          typeof searchResult === "object" &&
          searchResult !== null &&
          "error" in searchResult
            ? searchResult.error
            : undefined,
      });
    }

    // Step 2: Process each job URL in separate top-level steps (no nesting)
    let jobsProcessed = 0;
    let jobsSaved = 0;
    const errors: string[] = [];

    for (const { url: jobUrl, jobTitle, snippet, title: resultTitle } of allJobUrls) {
      jobsProcessed++;
      const jobUrlId = jobUrl.slice(-30).replace(/[^a-zA-Z0-9]/g, "");
      
      try {
        console.log(`Processing job ${jobsProcessed}/${allJobUrls.length}: ${jobUrl}`);
        
        // Step 1: Try to extract from snippet first, then fetch if needed
        // If we have good snippet data, use it; otherwise try to fetch the page
        const hasGoodSnippet = snippet && snippet.length > 100;
        
        let jobContent;
        if (hasGoodSnippet) {
          // Use snippet data - no need to fetch
          console.log(`Using snippet data for ${jobUrl}`);
          jobContent = {
            textContent: `${resultTitle || jobTitle}\n\n${snippet}`,
            url: jobUrl,
            blocked: false,
            fromSnippet: true,
          };
        } else {
          // Step 1: Fetch job page content (top-level step, not nested)
          jobContent = await step.run(
            `fetch-job-content-${jobUrlId}`,
            async () => {
              try {
                // Use more realistic browser headers to avoid blocking
                const response = await fetch(jobUrl, {
                headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                  "Accept-Language": "en-US,en;q=0.5",
                  "Accept-Encoding": "gzip, deflate, br",
                  "Connection": "keep-alive",
                  "Upgrade-Insecure-Requests": "1",
                  "Sec-Fetch-Dest": "document",
                  "Sec-Fetch-Mode": "navigate",
                  "Sec-Fetch-Site": "none",
                  "Cache-Control": "max-age=0",
                },
                redirect: "follow",
              });
              
              if (!response.ok) {
                // If we get blocked, try to extract from URL or return minimal data
                if (response.status === 403 || response.status === 401) {
                  console.warn(`Access forbidden for ${jobUrl}, will try to extract from URL structure`);
                  // Return minimal content - we'll try to extract what we can from the URL
                  return { 
                    textContent: `Job posting at ${jobUrl}. Unable to fetch full content due to access restrictions.`, 
                    url: jobUrl,
                    blocked: true 
                  };
                }
                throw new Error(`Failed to fetch job page: ${response.statusText}`);
              }
              
              const html = await response.text();
              // Extract text content (basic extraction - could be improved)
              const textContent = html
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .substring(0, 10000); // Limit to first 10k chars
              
                return { textContent, url: jobUrl, blocked: false, fromSnippet: false };
              } catch (error) {
                console.error(`Error fetching job content from ${jobUrl}:`, error);
                // Return minimal content instead of throwing
                return { 
                  textContent: `${resultTitle || jobTitle}\n\nJob posting at ${jobUrl}. ${snippet || "Full content could not be accessed."}`, 
                  url: jobUrl,
                  blocked: true,
                  error: String(error),
                  fromSnippet: false,
                };
              }
            }
          );
        }

        // Step 2: Extract job details using Gemini API (top-level step, not nested)
        const extractionResult = await step.run(
          `extract-job-${jobUrlId}`,
          async () => {
            try {
              // If content was blocked, try to extract from URL and provide guidance
              if (jobContent.blocked) {
                console.log(`Content blocked for ${jobUrl}, attempting minimal extraction`);
                // Try to extract basic info from URL structure
                const urlParts = new URL(jobUrl);
                const domain = urlParts.hostname;
                let companyGuess = "";
                let titleGuess = jobTitle || "Unknown";
                
                // Try to get title from URL if possible
                if (jobUrl.includes("indeed.com")) {
                  titleGuess = jobTitle || "Job Position";
                }
                
                // Return minimal structure
                return {
                  text: JSON.stringify({
                    title: titleGuess,
                    company: companyGuess || "Company Name",
                    location: "Location not available",
                    employment: "Full-time",
                    remoteType: "Unknown",
                    salaryMin: 0,
                    salaryMax: 0,
                    currency: "USD",
                    description: `Job posting found at ${jobUrl}. Full content could not be accessed due to website restrictions. Please visit the URL for complete details.`,
                    companyDescription: "",
                    roleSummary: `${companyGuess || "A company"} is seeking a ${titleGuess}. Full job details are available at the source URL.`,
                    skills: [],
                    responsibilities: [],
                    qualifications: [],
                    postedAt: null,
                  }),
                };
              }
              
              // Add delay before extraction to respect rate limits
              await new Promise((resolve) => setTimeout(resolve, 4000));

              const ai = new GoogleGenAI({
                apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
              });

              const prompt = `Extract job information from this job posting content. If the content is limited or blocked, do your best to extract what you can. Return ONLY valid JSON in this exact format:
{
  "title": "Job title",
  "company": "Company name",
  "location": "City, State, Country",
  "employment": "Full-time/Part-time/Contract/etc",
  "remoteType": "Remote/Hybrid/On-site",
  "salaryMin": 0,
  "salaryMax": 0,
  "currency": "USD",
  "description": "A concise, user-friendly 2-3 sentence description of the role's key responsibilities and what the candidate will be doing. Keep it brief and focused on the day-to-day work.",
  "companyDescription": "Brief description of the company and what they do",
  "roleSummary": "A 2-3 sentence summary of the role and what the candidate will do, similar to: '[Company] is seeking a [Title] to join their [Team/Department], where you will [key responsibilities]. In this position, you will [specific tasks] to [business goal].'",
  "skills": ["skill1", "skill2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "qualifications": ["qualification1", "qualification2"],
  "postedAt": "2024-01-01" or null
}

Job posting content:
${jobContent.textContent.substring(0, 8000)}`;

              const response = await generateWithRetry(
                (model) =>
                  ai.models.generateContent({
                    model,
                    contents: [
                      {
                        role: "user",
                        parts: [{ text: prompt }],
                      },
                    ],
                  }),
                {
                  models: [
                    "gemini-2.0-flash-lite",
                    "gemini-2.5-flash-lite",
                    "gemini-2.0-flash",
                  ],
                  retriesPerModel: 3,
                  initialDelayMs: 6000,
                }
              );

              const text = response?.text;
              if (!text) {
                throw new Error("No text content in Gemini response");
              }

              return { text };
            } catch (error) {
              console.error("AI extraction error:", error);
              throw error;
            }
          }
        );

        // Parse the extracted job data
        let jobData: any;
        try {
          const text = extractionResult.text || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error("No JSON found in extraction response");
          }
          jobData = JSON.parse(jsonMatch[0]);
        } catch (error) {
          console.error(`Failed to parse job data from ${jobUrl}:`, error);
          errors.push(`Failed to parse job data from ${jobUrl}`);
          continue; // Skip to next job
        }

        // Step 3: Calculate match score and save job (top-level step, not nested)
        // Add a small delay to respect rate limits (30 RPM for flash-lite = 1 request every 2 seconds)
        if (jobsProcessed > 1) {
          await new Promise(resolve => setTimeout(resolve, 4000)); // 4 second delay between requests
        }
        
        const jobResult = await step.run(
          `calculate-match-and-save-${jobUrlId}`,
          async () => {
            const userSkills = user.skills || [];
            const resumeSummary = user.resumes[0]?.aiSummary || "";
            
            // Calculate match score using Gemini
            const scorePrompt = `Evaluate how well this candidate matches the job:

Job Requirements:
- Title: ${jobData.title}
- Skills Required: ${JSON.stringify(jobData.skills || [])}
- Responsibilities: ${JSON.stringify(jobData.responsibilities || [])}
- Qualifications: ${JSON.stringify(jobData.qualifications || [])}
- Description: ${(jobData.description || "").substring(0, 1500)}

Candidate Profile:
- Skills: ${JSON.stringify(userSkills)}
- Resume Summary: ${resumeSummary || "Not available"}

Calculate a match score from 0-100 where:
- 90-100: Excellent match - candidate meets or exceeds most requirements
- 70-89: Good match - candidate meets most key requirements
- 50-69: Moderate match - candidate meets some requirements
- 30-49: Weak match - candidate has limited relevant experience
- 0-29: Poor match - candidate does not meet requirements

Return ONLY valid JSON: {"matchScore": 85, "reasoning": "Brief explanation"}`;
                    
                    const ai = new GoogleGenAI({
                      apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
                    });
                    
                    let matchScore = 50;
                    let reasoning = "";
            let scoreResponse: Awaited<
              ReturnType<typeof ai.models.generateContent>
            > | null = null;

            try {
              scoreResponse = await generateWithRetry(
                (model) =>
                  ai.models.generateContent({
                    model,
                    contents: [
                      {
                        role: "user",
                        parts: [{ text: scorePrompt }],
                      },
                    ],
                  }),
                {
                  models: [
                    "gemini-2.0-flash-lite",
                    "gemini-2.5-flash-lite",
                    "gemini-2.0-flash",
                  ],
                  retriesPerModel: 3,
                  initialDelayMs: 6000,
                }
              );
            } catch (error) {
              console.error("AI match score error:", error);
              reasoning =
                "Match score defaulted due to AI rate limiting or unavailable response.";
            }
                    try {
              const scoreText = scoreResponse?.text || "";
              const scoreMatch = scoreText.match(/\{[\s\S]*\}/);
              if (scoreMatch) {
                const scoreData = JSON.parse(scoreMatch[0]);
                matchScore = scoreData.matchScore || matchScore;
                reasoning = scoreData.reasoning || reasoning;
              }
            } catch (error) {
              console.error("Failed to parse match score:", error);
              reasoning = reasoning || "Failed to parse match score.";
            }
                    
                    // Create AI summary in the format requested
                    let aiSummary = "";
                    if (jobData.roleSummary) {
                      aiSummary = jobData.roleSummary;
                    } else if (jobData.companyDescription && jobData.title) {
                      // Fallback: construct summary from available data
                      aiSummary = `${jobData.company || "The company"}${jobData.companyDescription ? ` ${jobData.companyDescription}` : ""} is seeking a ${jobData.title}${jobData.location ? ` in ${jobData.location}` : ""}.`;
                    } else {
                      // Minimal fallback
                      aiSummary = `${jobData.company || "Company"} is seeking a ${jobData.title || "professional"}${jobData.location ? ` in ${jobData.location}` : ""}.`;
                    }
                    
                    // Keep description clean and user-friendly (no match score)
                    // Match score is calculated but not displayed in description
                    const cleanDescription = jobData.description || 
                      `Join ${jobData.company || "a company"} as a ${jobData.title || "professional"}. ${jobData.roleSummary ? jobData.roleSummary.split('.')[0] + '.' : ''}`;
                    
                    // Save the job
                    const saveResult = await saveJob({
                      userId: user.id,
                      sourceUrl: jobUrl,
                      title: jobData.title || "Unknown",
                      company: jobData.company || "Unknown",
                      location: jobData.location || "Unknown",
                      employment: jobData.employment || "Full-time",
                      remoteType: jobData.remoteType || "On-site",
                      salaryMin: jobData.salaryMin || 0,
                      salaryMax: jobData.salaryMax || 0,
                      currency: jobData.currency || "USD",
                      description: cleanDescription,
                      aiSummary: aiSummary,
                      skills: jobData.skills || [],
                      responsibilities: jobData.responsibilities || [],
                      qualifications: jobData.qualifications || [],
                      postedAt: jobData.postedAt ?? undefined,
                      matchScore,
                    });

                    console.log(`✅ Saved job: ${jobData.title} at ${jobData.company} (Score: ${matchScore})`);
                    return {
                      ...saveResult,
                      jobTitle: jobData.title,
                      company: jobData.company,
                      matchScore,
                      matchReasoning: reasoning,
                    };
                }
              );
              
        if (jobResult?.success) {
          jobsSaved++;
        } else {
          errors.push(`Failed to save job ${jobUrl}: ${jobResult?.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error(`Error processing job URL ${jobUrl}:`, error);
        errors.push(`Error processing ${jobUrl}: ${String(error)}`);
      }
    }
    
    // Update results with processing summary
    const finalResults = results.map((r) => ({
      ...r,
      jobsProcessed: jobsProcessed,
      jobsSaved: jobsSaved,
    }));
    
    return {
      success: true,
      message: `Job search completed. Processed ${jobsProcessed} jobs, saved ${jobsSaved} jobs.`,
      results: finalResults,
      summary: {
        totalJobsProcessed: jobsProcessed,
        totalJobsSaved: jobsSaved,
        preferencesSearched: user.jobPreferences.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    };
  }
);

