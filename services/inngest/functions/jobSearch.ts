import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { env } from "@/data/env/server";
import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Tool to save job to database
const saveJobTool = createTool({
  name: "save-job",
  description: "Saves a job listing to the database with match score",
  parameters: z.object({
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
  }),
  handler: async (params) => {
    const {
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
    } = params;

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
      return { success: false, message: "Job already exists", jobId: existingJob.id };
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
        // Store match score in note field for now (or we could add a matchScore field to schema)
        note: `Match Score: ${params.matchScore}/100`,
      },
    });

    return { success: true, jobId: job.id, message: "Job saved successfully" };
  },
});


// Main job search function
export const searchJobsForUser = inngest.createFunction(
  {
    id: "search-jobs-for-user",
    name: "Search Jobs for User",
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
    const allJobUrls: Array<{ url: string; jobTitle: string }> = [];
    
    // Step 1: Search for job URLs (no nested steps here)
    for (const jobTitle of user.jobPreferences) {
      const searchResult = await step.run(`search-jobs-${jobTitle}`, async () => {
        try {
          // Use Serper API to search for jobs on US-based sites
          // Search for individual job postings, not job board pages
          const searchQuery = `"${jobTitle}" job site:linkedin.com/jobs/view OR site:indeed.com/viewjob OR site:glassdoor.com/Job OR site:monster.com/jobs`;
          
          console.log(`Searching for jobs with query: ${searchQuery}`);
          
          const searchResponse = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
              "X-API-KEY": env.SERPER_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              q: searchQuery,
              num: 10, // Get more results to filter from
              gl: "us", // US-based results
            }),
          });

          if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            throw new Error(`Serper API error: ${searchResponse.statusText} - ${errorText}`);
          }

          const searchData = await searchResponse.json();
          const organicResults = searchData.organic || [];
          
          console.log(`Found ${organicResults.length} search results for "${jobTitle}"`);
          console.log(`Sample result:`, JSON.stringify(organicResults[0], null, 2));

          // Filter to get actual job posting URLs (not job board pages)
          // Look for specific patterns that indicate individual job postings
          // Also extract available data from snippets
          const jobUrls = organicResults
            .map((result: any) => ({
              ...result,
              url: result.link,
              snippet: result.snippet || "",
              title: result.title || "",
            }))
            .filter((result: any) => {
              const url = result.link?.toLowerCase() || "";
              
              // Must be US-based sites (exclude .ca, .uk, etc. TLDs and country subdomains)
              // Exclude country-specific subdomains like ca.indeed.com, uk.linkedin.com, etc.
              if (
                url.includes(".ca/") || 
                url.includes(".uk/") || 
                url.includes(".au/") ||
                url.includes("ca.indeed.com") ||
                url.includes("uk.indeed.com") ||
                url.includes("au.indeed.com") ||
                url.includes("ca.linkedin.com") ||
                url.includes("uk.linkedin.com") ||
                url.includes("au.linkedin.com") ||
                (!url.includes(".com") && !url.includes("linkedin.com") && !url.includes("indeed.com") && !url.includes("glassdoor.com") && !url.includes("monster.com"))
              ) {
                return false;
              }
              
              // LinkedIn: Must have /jobs/view/ pattern (individual job posting)
              if (url.includes("linkedin.com")) {
                return url.includes("/jobs/view/") && !url.includes("/search") && !url.includes("/browse");
              }
              
              // Indeed: Must have /viewjob pattern (individual job posting)
              if (url.includes("indeed.com")) {
                return url.includes("/viewjob") && !url.includes("/q-") && !url.includes("/jobs.html");
              }
              
              // Glassdoor: Must have /Job/ pattern (individual job posting)
              if (url.includes("glassdoor.com")) {
                return url.includes("/Job/") && !url.includes("/BrowseJobs") && !url.includes("/Jobs/");
              }
              
              // Monster: Must have /jobs/ pattern (individual job posting)
              if (url.includes("monster.com")) {
                return url.includes("/jobs/") && !url.includes("/search") && !url.includes("/browse");
              }
              
              // Exclude common job board patterns
              const excludedPatterns = [
                "/q-",
                "/jobs.html",
                "/search",
                "/browse",
                "/jobs/jobs",
                "?q=",
                "&q=",
                "/jobs?",
              ];
              
              if (excludedPatterns.some(pattern => url.includes(pattern))) {
                return false;
              }
              
              return false; // Default: exclude if doesn't match known patterns
            })
            .slice(0, 3); // Process up to 3 jobs per preference

          console.log(`Filtered to ${jobUrls.length} job posting URLs for "${jobTitle}"`);

          if (jobUrls.length === 0) {
            console.log(`No valid job URLs found for "${jobTitle}". Original results:`, organicResults.map((r: any) => r.link));
            return { jobTitle, jobUrls: [], message: "No valid job URLs found" };
          }

          return { jobTitle, jobUrls };
        } catch (error) {
          console.error(`Error searching for jobs with title "${jobTitle}":`, error);
          return { jobTitle, jobUrls: [], error: String(error) };
        }
      });
      
      // Collect all job URLs to process with their snippet data
      if (searchResult?.jobUrls) {
        searchResult.jobUrls.forEach((jobData: any) => {
          allJobUrls.push({ 
            url: typeof jobData === 'string' ? jobData : jobData.url || jobData.link,
            jobTitle: searchResult.jobTitle,
            snippet: typeof jobData === 'string' ? null : (jobData.snippet || ""),
            title: typeof jobData === 'string' ? null : (jobData.title || ""),
          });
        });
      }
      
      results.push({
        jobTitle: searchResult.jobTitle,
        jobUrlsFound: searchResult.jobUrls?.length || 0,
        message: searchResult.message || searchResult.error,
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
  "description": "Full job description",
  "companyDescription": "Brief description of the company and what they do",
  "roleSummary": "A 2-3 sentence summary of the role and what the candidate will do, similar to: '[Company] is seeking a [Title] to join their [Team/Department], where you will [key responsibilities]. In this position, you will [specific tasks] to [business goal].'",
  "skills": ["skill1", "skill2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "qualifications": ["qualification1", "qualification2"],
  "postedAt": "2024-01-01" or null
}

Job posting content:
${jobContent.textContent.substring(0, 8000)}`;

                    const response = await ai.models.generateContent({
                      model: "gemini-2.0-flash-lite",
                      contents: [
                        {
                          role: "user",
                          parts: [{ text: prompt }],
                        },
                      ],
                    });

                    const text = response.text;
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
          await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 second delay between requests
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
                    
                    const scoreResponse = await ai.models.generateContent({
                      model: "gemini-2.0-flash-lite",
                      contents: [
                        {
                          role: "user",
                          parts: [{ text: scorePrompt }],
                        },
                      ],
                    });
                    
                    let matchScore = 50;
                    let reasoning = "";
                    try {
                      const scoreText = scoreResponse.text || "";
                      const scoreMatch = scoreText.match(/\{[\s\S]*\}/);
                      if (scoreMatch) {
                        const scoreData = JSON.parse(scoreMatch[0]);
                        matchScore = scoreData.matchScore || 50;
                        reasoning = scoreData.reasoning || "";
                      }
                    } catch (error) {
                      console.error("Failed to parse match score:", error);
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
                    
                    // Add match score info to description or note, not summary
                    const descriptionWithScore = jobData.description 
                      ? `${jobData.description}\n\nMatch Score: ${matchScore}/100${reasoning ? `. ${reasoning}` : ""}`
                      : `Match Score: ${matchScore}/100${reasoning ? `. ${reasoning}` : ""}`;
                    
                    // Save the job
                    const saveResult = await saveJobTool.handler({
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
                      description: descriptionWithScore,
                      aiSummary: aiSummary,
                      skills: jobData.skills || [],
                      responsibilities: jobData.responsibilities || [],
                      qualifications: jobData.qualifications || [],
                      postedAt: jobData.postedAt || null,
                      matchScore,
                    });

                    console.log(`✅ Saved job: ${jobData.title} at ${jobData.company} (Score: ${matchScore})`);
                    return { success: true, jobTitle: jobData.title, company: jobData.company, matchScore };
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

