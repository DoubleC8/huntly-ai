import { env } from "@/data/env/server";
import { GoogleGenAI } from "@google/genai";

const US_STATE_ABBREVIATIONS = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]);

const US_STATE_NAMES = [
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new hampshire",
  "new jersey",
  "new mexico",
  "new york",
  "north carolina",
  "north dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "rhode island",
  "south carolina",
  "south dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "west virginia",
  "wisconsin",
  "wyoming",
  "district of columbia",
];

const NON_US_KEYWORDS = [
  "canada",
  "canadian",
  "ontario",
  "british columbia",
  "manitoba",
  "saskatchewan",
  "alberta",
  "quebec",
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "calgary",
  "edmonton",
  "winnipeg",
  "hamilton",
  "mississauga",
  "brampton",
  "surrey",
  "kelowna",
  "victoria bc",
  "uk",
  "united kingdom",
  "england",
  "london",
  "australia",
  "sydney",
  "melbourne",
  "india",
  "europe",
];

export function isUSLocation(location?: string | null): boolean {
  if (!location) {
    // When the source does not provide a location we assume it's safe to include
    // so that remote postings without explicit countries still surface.
    return true;
  }

  const normalized = location.toLowerCase().trim();
  if (!normalized) {
    return true;
  }

  if (NON_US_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return false;
  }

  if (
    normalized.includes("united states") ||
    normalized.includes("u.s.") ||
    normalized.includes("u.s.a") ||
    normalized.includes("usa") ||
    normalized.includes("us ") ||
    normalized.endsWith(" us")
  ) {
    return true;
  }

  if (normalized.includes("remote")) {
    // Allow remote jobs unless they explicitly mention a non-US country
    return !NON_US_KEYWORDS.some((keyword) =>
      normalized.includes(keyword)
    );
  }

  const tokens = normalized
    .split(/[,/|-]/)
    .map((token) => token.trim())
    .filter(Boolean);

  for (const token of tokens) {
    if (US_STATE_NAMES.includes(token)) {
      return true;
    }

    const upperToken = token.toUpperCase();
    if (US_STATE_ABBREVIATIONS.has(upperToken)) {
      return true;
    }
  }

  return false;
}

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

export type JobSearchResult = {
  title: string;
  company: string;
  location: string;
  employment: string;
  remoteType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  aiSummary: string;
  sourceUrl: string;
  matchScore: number;
  skills: string[];
  responsibilities?: string[];
  qualifications?: string[];
  postedAt?: string | null;
};

export type UserProfile = {
  id: string;
  jobPreferences: string[];
  skills: string[];
  resumeSummary?: string | null;
};

/**
 * Search for jobs using Serper API
 */
export async function searchJobUrls(
  jobTitle: string,
  numResults: number = 10
): Promise<Array<{ url: string; snippet: string; title: string }>> {
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
      num: numResults,
      gl: "us",
    }),
  });

  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    throw new Error(`Serper API error: ${searchResponse.statusText} - ${errorText}`);
  }

  const searchData = await searchResponse.json();
  const organicResults = searchData.organic || [];

  console.log(`Found ${organicResults.length} search results for "${jobTitle}"`);

  const jobUrlCandidates = organicResults.map((result: any) => ({
    url: result.link,
    snippet: result.snippet || "",
    title: result.title || "",
  }));

  const knownDomains = [
    "linkedin.com",
    "indeed.com",
    "glassdoor.com",
    "monster.com",
    "ziprecruiter.com",
    "dice.com",
    "simplyhired.com",
    "careerbuilder.com",
    "lever.co",
    "lever.com",
    "greenhouse.io",
    "boards.greenhouse.io",
    "myworkdayjobs.com",
    "workdayjobs.com",
    "smartrecruiters.com",
    "ashbyhq.com",
    "ashbyhq.net",
    "jobvite.com",
    "icims.com",
  ];

  const jobPathKeywords = [
    "/job/",
    "/jobs/",
    "/careers",
    "/positions",
    "/opportunities",
    "/openings",
    "/vacancies",
    "/apply/",
    "jobid=",
    "gh_jid",
    "lever.co",
  ];

  // Filter to get actual job posting URLs
  let jobUrls: Array<{ url: string; snippet: string; title: string }> =
    jobUrlCandidates.filter(
      (result: { url: string; snippet: string; title: string }) => {
    const url = (result.url || "").toLowerCase();
    if (!url) return false;

    // Exclude common international TLDs
    if (
      url.includes(".ca/") ||
      url.includes(".uk/") ||
      url.includes(".au/") ||
      url.includes("ca.indeed.com") ||
      url.includes("uk.indeed.com") ||
      url.includes("ca.linkedin.com") ||
      url.includes("uk.linkedin.com")
    ) {
      return false;
    }

    const domainMatch = knownDomains.some((domain) => url.includes(domain));
    const pathMatch = jobPathKeywords.some((keyword) => url.includes(keyword));

    // For LinkedIn et al keep stricter checks to avoid search pages
    const isLinkedIn = url.includes("linkedin.com") && url.includes("/jobs/view/") && !url.includes("/search");
    const isIndeed = url.includes("indeed.com") && url.includes("/viewjob") && !url.includes("/q-");
    const isGlassdoor = url.includes("glassdoor.com") && url.includes("/job/") && !url.includes("/browsejobs");
    const isMonster = url.includes("monster.com") && url.includes("/jobs/") && !url.includes("/search");

    return isLinkedIn || isIndeed || isGlassdoor || isMonster || domainMatch || pathMatch;
  });

  // Remove duplicate URLs
  const seen = new Set<string>();
  jobUrls = jobUrls.filter((result) => {
    if (!result.url) return false;
    if (seen.has(result.url)) return false;
    seen.add(result.url);
    return true;
  });

  if (jobUrls.length === 0) {
    console.log(`No recognized job URLs for "${jobTitle}". Falling back to first search results.`);
    jobUrls = jobUrlCandidates
      .filter((result: any) => {
        const url = (result.url || "").toLowerCase();
        if (!url) return false;
        return (
          url.includes("/jobs") ||
          url.includes("/job") ||
          url.includes("/careers") ||
          url.includes("/position") ||
          url.includes("job=") ||
          result.title.toLowerCase().includes("job") ||
          result.title.toLowerCase().includes("engineer") ||
          result.snippet.toLowerCase().includes("apply")
        );
      })
      .slice(0, 5);
  }

  console.log(`Filtered to ${jobUrls.length} valid job URLs for "${jobTitle}"`);
  return jobUrls;
}

/**
 * Fetch job page content or use snippet
 */
export async function getJobContent(
  jobUrl: string,
  snippet: string,
  resultTitle: string
): Promise<{ textContent: string; url: string; blocked: boolean }> {
  const hasGoodSnippet = snippet && snippet.length > 100;

  if (hasGoodSnippet) {
    return {
      textContent: `${resultTitle}\n\n${snippet}`,
      url: jobUrl,
      blocked: false,
    };
  }

  // Fetch job page content
  try {
    const response = await fetch(jobUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
      },
      redirect: "follow",
      }
    );

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        return {
          textContent: `Job posting at ${jobUrl}. Unable to fetch full content due to access restrictions.`,
          url: jobUrl,
          blocked: true,
        };
      }
      throw new Error(`Failed to fetch job page: ${response.statusText}`);
    }

    const html = await response.text();
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 10000);

    return { textContent, url: jobUrl, blocked: false };
  } catch (error) {
    console.error(`Error fetching job content from ${jobUrl}:`, error);
    return {
      textContent: `${resultTitle}\n\nJob posting at ${jobUrl}. ${snippet || "Full content could not be accessed."}`,
      url: jobUrl,
      blocked: true,
    };
  }
}

/**
 * Extract job data using Gemini AI
 */
export async function extractJobData(
  jobContent: { textContent: string; url: string; blocked: boolean },
  jobTitle?: string
): Promise<any> {
  // If content was blocked, return minimal structure
  if (jobContent.blocked) {
    console.log(`Content blocked for ${jobContent.url}, attempting minimal extraction`);
    const urlParts = new URL(jobContent.url);
    const titleGuess = jobTitle || "Unknown";

    return {
      title: titleGuess,
      company: "Company Name",
      location: "Location not available",
      employment: "Full-time",
      remoteType: "Unknown",
      salaryMin: 0,
      salaryMax: 0,
      currency: "USD",
      description: `Job posting found at ${jobContent.url}. Full content could not be accessed due to website restrictions. Please visit the URL for complete details.`,
      roleSummary: `A company is seeking a ${titleGuess}. Full job details are available at the source URL.`,
      skills: [],
      responsibilities: [],
      qualifications: [],
      postedAt: null,
    };
  }

  // Add delay before extraction to respect rate limits
  await new Promise((resolve) => setTimeout(resolve, 2500));

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

  let response;
  let retries = 3;
  let delay = 5000;

  while (retries > 0) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });
      break;
    } catch (error: any) {
      retries--;
      if (error.status === 429 && retries > 0) {
        console.warn(`Rate limited (429), waiting ${delay}ms before retry (${retries} retries left)`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }

  const text = response!.text;
  if (!text) {
    throw new Error("No text content in Gemini response");
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in extraction response");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Calculate match score for a job
 */
export async function calculateMatchScore(
  jobData: any,
  userProfile: UserProfile
): Promise<number> {
  const userSkills = userProfile.skills || [];
  const resumeSummary = userProfile.resumeSummary || "";

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
  let scoreResponse:
    | Awaited<ReturnType<typeof ai.models.generateContent>>
    | null = null;
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
  }

  try {
    const scoreText = scoreResponse?.text || "";
    const scoreMatch = scoreText.match(/\{[\s\S]*\}/);
    if (scoreMatch) {
      const scoreData = JSON.parse(scoreMatch[0]);
      matchScore = scoreData.matchScore || 50;
    }
  } catch (error) {
    console.error("Failed to parse match score:", error);
  }

  return matchScore;
}

/**
 * Process a single job URL and return job data
 */
export async function processJobUrl(
  jobUrl: string,
  snippet: string,
  resultTitle: string,
  userProfile: UserProfile,
  jobTitle?: string
): Promise<JobSearchResult | null> {
  try {
    // Get job content
    const jobContent = await getJobContent(jobUrl, snippet, resultTitle);

    // Extract job data
    const jobData = await extractJobData(jobContent, jobTitle || resultTitle);

    if (!isUSLocation(jobData.location)) {
      console.log(
        `Skipping non-US job ${jobData.title || "Unknown"} at ${jobData.company || "Unknown"} (${jobData.location})`
      );
      return null;
    }

    // Calculate match score
    const matchScore = await calculateMatchScore(jobData, userProfile);

    // Filter out jobs posted more than 30 days ago
    if (jobData.postedAt) {
      try {
        const postedDate = new Date(jobData.postedAt);
        if (!isNaN(postedDate.getTime())) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (postedDate < thirtyDaysAgo) {
            console.log(`Skipping job ${jobData.title} - posted ${postedDate.toISOString()} (older than 30 days)`);
            return null;
          }
        }
      } catch (error) {
        console.log(`Could not parse postedAt date for ${jobData.title}, including job anyway`);
      }
    }

    // Create AI summary
    const aiSummary =
      jobData.roleSummary ||
      `${jobData.company || "Company"} is seeking a ${jobData.title || "professional"}${jobData.location ? ` in ${jobData.location}` : ""}.`;

    return {
      title: jobData.title || "Unknown",
      company: jobData.company || "Unknown",
      location: jobData.location || "Unknown",
      employment: jobData.employment || "Full-time",
      remoteType: jobData.remoteType || "On-site",
      salaryMin: jobData.salaryMin || 0,
      salaryMax: jobData.salaryMax || 0,
      currency: jobData.currency || "USD",
      description: jobData.description || aiSummary,
      aiSummary,
      sourceUrl: jobUrl,
      matchScore,
      skills: jobData.skills || [],
      responsibilities: jobData.responsibilities || [],
      qualifications: jobData.qualifications || [],
      postedAt: jobData.postedAt || null,
    };
  } catch (error) {
    console.error(`Error processing job ${jobUrl}:`, error);
    return null;
  }
}

/**
 * Search and get jobs for a user (without saving to database)
 */
export async function searchJobsForEmail(
  userProfile: UserProfile,
  maxJobs: number = 5
): Promise<JobSearchResult[]> {
  if (!userProfile.jobPreferences || userProfile.jobPreferences.length === 0) {
    console.log("No job preferences found for user");
    return [];
  }

  console.log(`Searching jobs for user with preferences: ${userProfile.jobPreferences.join(", ")}`);

  const allJobs: JobSearchResult[] = [];

  // Search for jobs for each preference (limit to 2 to avoid too many API calls)
  for (const jobTitle of userProfile.jobPreferences.slice(0, 2)) {
    try {
      console.log(`Searching for jobs with title: ${jobTitle}`);
      const jobUrls = await searchJobUrls(jobTitle, 10);

      // Process up to 5 jobs per preference
      for (const { url, snippet, title: resultTitle } of jobUrls.slice(0, 5)) {
        // Add delay between jobs to respect rate limits
        if (allJobs.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
        }

        const job = await processJobUrl(url, snippet, resultTitle, userProfile, jobTitle);

        if (job) {
          allJobs.push(job);
          console.log(`Successfully processed job: ${job.title} at ${job.company} (Score: ${job.matchScore})`);
        } else {
          console.log(`Job processing returned null for URL ${url}`);
        }

        // Stop if we have enough jobs
        if (allJobs.length >= maxJobs * 2) break;
      }

      if (allJobs.length >= maxJobs * 2) {
        console.log(`Found enough jobs (${allJobs.length}), stopping search`);
        break;
      }
    } catch (error) {
      console.error(`Error searching for jobs with title "${jobTitle}":`, error);
      continue;
    }
  }

  console.log(`Total jobs found: ${allJobs.length}`);

  // Sort by match score and return top jobs
  const sortedJobs = allJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxJobs);

  console.log(`Returning ${sortedJobs.length} top jobs after sorting and filtering`);
  return sortedJobs;
}

