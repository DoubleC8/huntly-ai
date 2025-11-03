import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { env } from "@/data/env/server";
import type { Prisma } from "@/app/generated/prisma/client";

// Calculate match score between user skills and job requirements
function calculateMatchScore(
  userSkills: string[],
  jobSkills: string[],
  jobQualifications: string[],
  jobResponsibilities: string[]
): number {
  // Normalize all skills to lowercase for comparison
  const normalize = (skill: string) => skill.trim().toLowerCase();
  const normalizedUserSkills = new Set(userSkills.map(normalize));

  // Combine all job requirements
  const allJobRequirements = [
    ...jobSkills,
    ...jobQualifications,
    ...jobResponsibilities,
  ];

  // Extract skills from text (simple approach - split by common delimiters)
  const extractSkillsFromText = (text: string): string[] => {
    // Split by common delimiters and extract potential skills
    const words = text
      .toLowerCase()
      .split(/[,\s]+|and|or/gi)
      .map((w) => w.trim())
      .filter((w) => w.length > 2);
    return words;
  };

  // Collect all required skills from job
  const requiredSkillsSet = new Set<string>();
  allJobRequirements.forEach((req) => {
    const extracted = extractSkillsFromText(req);
    extracted.forEach((skill) => requiredSkillsSet.add(normalize(skill)));
    
    // Also add the full requirement text (normalized) for exact matches
    requiredSkillsSet.add(normalize(req));
  });

  // Also add individual skills from jobSkills array
  jobSkills.forEach((skill) => {
    requiredSkillsSet.add(normalize(skill));
  });

  // Calculate matches
  let matches = 0;
  const totalRequired = requiredSkillsSet.size;

  if (totalRequired === 0) {
    return 50; // Default score if no requirements listed
  }

  // Check if user skills match required skills
  requiredSkillsSet.forEach((requiredSkill) => {
    // Check for exact match
    if (normalizedUserSkills.has(requiredSkill)) {
      matches++;
      return;
    }

    // Check for partial match (required skill contains user skill or vice versa)
    for (const userSkill of normalizedUserSkills) {
      if (
        requiredSkill.includes(userSkill) ||
        userSkill.includes(requiredSkill)
      ) {
        matches += 0.5; // Partial match gets half credit
        break;
      }
    }
  });

  // Calculate percentage (0-100)
  const score = Math.min(100, Math.round((matches / totalRequired) * 100));
  return score;
}

// Search for jobs using Gemini with Google Search grounding
async function searchJobsWithGemini(
  query: string,
  location?: string
): Promise<Array<{
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
}>> {
  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const searchQuery = location 
    ? `${query} jobs in ${location}`
    : `${query} jobs`;

  const prompt = `Search the web for recent job listings matching: "${searchQuery}"

Return a JSON array of job listings with this exact format:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "location": "City, State or Remote",
    "description": "Brief job description",
    "url": "https://job-posting-url.com",
    "salary": "Optional salary range if mentioned"
  },
  ...
]

Return at least 15-20 recent job postings. Include the actual URLs from job boards like LinkedIn, Indeed, Glassdoor, etc.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No text content in Gemini response");
    }

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error("No JSON array found in Gemini response");
    }

    const jobs = JSON.parse(jsonMatch[0]) as Array<{
      title: string;
      company: string;
      location: string;
      description: string;
      url: string;
      salary?: string;
    }>;

    return jobs;
  } catch (error) {
    console.error("Error searching jobs with Gemini:", error);
    // Fallback to Serper if Gemini fails
    return searchJobsWithSerper(query, location);
  }
}

// Fetch full job content from URL
async function fetchJobContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return "";
    }

    const html = await response.text();
    
    // Simple text extraction (remove HTML tags)
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "") // Remove scripts
      .replace(/<style[\s\S]*?<\/style>/gi, "") // Remove styles
      .replace(/<[^>]+>/g, " ") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .substring(0, 10000); // Limit length
    
    return text;
  } catch (error) {
    console.warn(`Failed to fetch job content from ${url}:`, error);
    return "";
  }
}

// Search for jobs using Serper API (fallback)
async function searchJobsWithSerper(
  query: string,
  location?: string
): Promise<Array<{
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
}>> {
  const apiKey = env.SERPER_API_KEY;
  
  if (!apiKey) {
    console.warn("SERPER_API_KEY not configured, returning empty results");
    return [];
  }

  // Add date filter for recent jobs (last 30 days)
  // Target job boards directly for better results and direct URLs
  const dateFilter = "past month";
  const searchQuery = location 
    ? `${query} jobs site:linkedin.com OR site:indeed.com OR site:glassdoor.com OR site:ziprecruiter.com in ${location} ${dateFilter}`
    : `${query} jobs site:linkedin.com OR site:indeed.com OR site:glassdoor.com OR site:ziprecruiter.com ${dateFilter}`;

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: searchQuery,
        num: 20,
        tbs: "qdr:m", // Past month filter
        gl: "us", // Country code (you can make this dynamic based on user location)
        hl: "en", // Language
        // Try to get better structured results by including job-related terms
        // This helps Google return more job-focused results
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse search results into job format
    const jobs = (data.organic || []).map((result: any) => {
      const title = result.title || "";
      const snippet = result.snippet || "";
      const url = result.link || "";
      
      // Extract company name from multiple sources
      let company = "Unknown Company";
      let extractionMethod = "none";
      
      // 1. Try extracting from URL (most reliable for job boards)
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        
        // LinkedIn: linkedin.com/jobs/view/... or linkedin.com/company/company-name
        if (hostname.includes("linkedin.com")) {
          const companyMatch = url.match(/\/company\/([^/?]+)/i) || 
                               url.match(/\/jobs\/view\/[^/]+\/([^/?]+)/i);
          if (companyMatch && companyMatch[1]) {
            company = companyMatch[1]
              .replace(/-/g, " ")
              .split(" ")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
            extractionMethod = "linkedin-url";
          }
        }
        
        // Indeed: indeed.com/viewjob?jk=... or indeed.com/cmp/company-name
        if (hostname.includes("indeed.com")) {
          const companyMatch = url.match(/\/cmp\/([^/?]+)/i);
          if (companyMatch && companyMatch[1]) {
            company = decodeURIComponent(companyMatch[1])
              .replace(/-/g, " ")
              .split(" ")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
            extractionMethod = "indeed-url";
          }
        }
        
        // Glassdoor: glassdoor.com/Job/company-name-job-title-JV.htm
        if (hostname.includes("glassdoor.com")) {
          const companyMatch = url.match(/\/Job\/[^/-]+-([^/-]+)-/i);
          if (companyMatch && companyMatch[1]) {
            company = companyMatch[1]
              .replace(/-/g, " ")
              .split(" ")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
            extractionMethod = "glassdoor-url";
          }
        }
        
        // ZipRecruiter: ziprecruiter.com/jobs/company-name/job-title
        if (hostname.includes("ziprecruiter.com")) {
          const pathParts = urlObj.pathname.split("/").filter(Boolean);
          if (pathParts.length >= 2 && pathParts[0] === "jobs") {
            company = pathParts[1]
              .replace(/-/g, " ")
              .split(" ")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
            extractionMethod = "ziprecruiter-url";
          }
        }
      } catch {
        // URL parsing failed, continue with other methods
      }
      
      // 2. Extract from snippet if URL extraction didn't work
      if (company === "Unknown Company" && snippet) {
        // Patterns: "at Company Name", "Company Name is hiring", "Company Name |", etc.
        const snippetPatterns = [
          /\b(at|@)\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s|,|\.|$)/i,
          /([A-Z][a-zA-Z0-9\s&]+?)\s+(is hiring|hiring|is looking for)/i,
          /([A-Z][a-zA-Z0-9\s&]+?)\s*[-|]\s*[A-Z]/i,
        ];
        
        for (const pattern of snippetPatterns) {
          const match = snippet.match(pattern);
          if (match && match[2]) {
            const extracted = match[2].trim();
            if (extracted.length > 2 && extracted.length < 50 && !extracted.includes("job")) {
              company = extracted;
              extractionMethod = "snippet-pattern";
              break;
            }
          } else if (match && match[1] && !match[1].match(/^(at|@|is|hiring|looking)$/i)) {
            const extracted = match[1].trim();
            if (extracted.length > 2 && extracted.length < 50 && !extracted.includes("job")) {
              company = extracted;
              extractionMethod = "snippet-pattern";
              break;
            }
          }
        }
      }
      
      // 3. Extract from title if still unknown
      if (company === "Unknown Company" && title) {
        // Common patterns: "Job Title at Company", "Company - Job Title", "Job Title | Company"
        const titlePatterns = [
          /(.+?)\s+at\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s*[-|]|\s*$)/i,
          /([A-Z][a-zA-Z0-9\s&]+?)\s*[-|]\s*(.+)/i,
          /^([A-Z][a-zA-Z0-9\s&]+?)\s*[-–—]\s/i,
        ];
        
        for (const pattern of titlePatterns) {
          const match = title.match(pattern);
          if (match) {
            // Try match[2] first (usually the company part)
            const extracted = (match[2] || match[1])?.trim();
            if (extracted && extracted.length > 2 && extracted.length < 50 && 
                !extracted.toLowerCase().includes("job") && 
                !extracted.toLowerCase().includes("hiring")) {
              company = extracted;
              extractionMethod = "title-pattern";
              break;
            }
          }
        }
        
        // Fallback: split title and take the shorter part (usually company name)
        if (company === "Unknown Company") {
          const titleParts = title.split(/(?:\s*[-|]\s*| – | at )/i);
          if (titleParts.length > 1) {
            // Usually company is the shorter part
            const parts = titleParts.map((p: string) => p.trim()).filter((p: string) => p.length > 2);
            if (parts.length >= 2) {
              // Take the part that doesn't look like a job title
              const jobTitleWords = ["engineer", "developer", "manager", "analyst", "specialist", "coordinator"];
              const nonTitlePart = parts.find((p: string) => !jobTitleWords.some(word => p.toLowerCase().includes(word)));
              if (nonTitlePart && nonTitlePart.length < 40) {
                company = nonTitlePart;
                extractionMethod = "title-fallback";
              }
            }
          }
        }
      }
      
      // Extract location
      const locationMatch = 
        title.match(/(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i) ||
        snippet.match(/(?:in|at|located in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
      const jobLocation = locationMatch?.[1] || location || "Remote";

      // Extract salary from snippet (common patterns: $50k-$70k, $50,000-$70,000, etc.)
      let salary: string | undefined = undefined;
      const salaryPatterns = [
        /\$[\d,]+(?:k|K)?\s*[-–—]\s*\$?[\d,]+(?:k|K)?/g, // $50k-$70k or $50,000-$70,000
        /\$\d+[kK]\s*[-–—]\s*\$?\d+[kK]/g, // $50k-70k
        /salary[:\s]+(\$[\d,]+(?:k|K)?\s*[-–—]\s*\$?[\d,]+(?:k|K)?)/gi,
        /compensation[:\s]+(\$[\d,]+(?:k|K)?\s*[-–—]\s*\$?[\d,]+(?:k|K)?)/gi,
        /pay[:\s]+(\$[\d,]+(?:k|K)?\s*[-–—]\s*\$?[\d,]+(?:k|K)?)/gi,
      ];
      
      for (const pattern of salaryPatterns) {
        const match = snippet.match(pattern) || title.match(pattern);
        if (match && match[0]) {
          salary = match[0].trim();
          break;
        }
      }

      // Ensure URL is direct (remove tracking parameters and clean)
      let cleanUrl = result.link;
      try {
        const url = new URL(cleanUrl);
        // Keep only essential query params, remove tracking
        const essentialParams = ['id', 'jobId', 'jid', 'position'];
        const params = new URLSearchParams();
        for (const [key, value] of url.searchParams.entries()) {
          if (essentialParams.some(essential => key.toLowerCase().includes(essential.toLowerCase()))) {
            params.set(key, value);
          }
        }
        url.search = params.toString();
        cleanUrl = url.toString();
      } catch {
        // If URL parsing fails, use as-is
      }

      // Log extraction result for debugging
      if (company === "Unknown Company") {
        console.warn(`Could not extract company name for: ${title}`);
        console.warn(`  URL: ${url}`);
        console.warn(`  Snippet: ${snippet.substring(0, 200)}`);
      } else {
        console.log(`Extracted company "${company}" via ${extractionMethod} for: ${title}`);
      }

      return {
        title: title.split(" - ")[0].split(" | ")[0].split(" – ")[0].trim(),
        company: company,
        location: jobLocation,
        description: snippet,
        url: cleanUrl,
        salary: salary,
      };
    });

    return jobs;
  } catch (error) {
    console.error("Error searching jobs with Serper:", error);
    throw error;
  }
}

// Main search function - uses Serper (better for real-time job search) with Gemini fallback
async function searchJobsWeb(
  query: string,
  location?: string
): Promise<Array<{
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
}>> {
  // Use Serper first (better for real-time, recent job listings)
  // Fallback to Gemini if Serper is not configured
  if (env.SERPER_API_KEY) {
    try {
      return await searchJobsWithSerper(query, location);
    } catch (error) {
      console.warn("Serper search failed, falling back to Gemini:", error);
      return await searchJobsWithGemini(query, location);
    }
  } else {
    // Fallback to Gemini if Serper not configured
    try {
      return await searchJobsWithGemini(query, location);
    } catch (error) {
      console.error("Both search methods failed:", error);
      return [];
    }
  }
}

// Use AI to extract structured job data from web search results
async function enrichJobWithAI(job: {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
}): Promise<{
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
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  postedAt: Date | null;
}> {
  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  // Fetch full job content for better extraction
  console.log(`Fetching full content for: ${job.title} at ${job.company}`);
  const fullContent = await fetchJobContent(job.url);
  const jobContent = fullContent || job.description;

  // If company is still unknown, ask AI to extract it
  const companyExtractionPrompt = job.company === "Unknown Company" 
    ? "\n\nCRITICAL: The company name is currently 'Unknown Company'. Please extract the actual company name from the job listing content above and use it in the response."
    : "";

  const prompt = `Extract structured job information from this job listing. Pay special attention to finding responsibilities and qualifications:

Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description: ${job.description}
${fullContent ? `\nFull Job Content:\n${jobContent.substring(0, 8000)}` : ""}${companyExtractionPrompt}

Extract and return ONLY valid JSON in this format:
{
  "company": "extracted company name if it was 'Unknown Company', otherwise use the provided company name",
  "employment": "full-time" | "part-time" | "contract" | "internship",
  "remoteType": "remote" | "hybrid" | "onsite",
  "salaryMin": number or 0,
  "salaryMax": number or 0,
  "currency": "USD" | "EUR" | etc,
  "aiSummary": "brief summary of the job (2-3 sentences)",
  "skills": ["skill1", "skill2", ...],
  "responsibilities": ["specific responsibility 1", "specific responsibility 2", ...],
  "qualifications": ["specific qualification 1", "specific qualification 2", ...],
  "postedAt": "YYYY-MM-DD" or null
}

CRITICAL FOR SALARY:
- Look for salary ranges in formats like: "$50,000-$70,000", "$50k-$70k", "$50K-70K", "50k-70k", etc.
- Extract the minimum and maximum as numbers (remove $, commas, k/K = multiply by 1000)
- Examples: "$50k-$70k" → salaryMin: 50000, salaryMax: 70000
- Examples: "$50,000 - $70,000" → salaryMin: 50000, salaryMax: 70000
- If you see "$80k+" or "$80,000+", use that as salaryMin, salaryMax: 0
- If only one number is found, use it as both min and max

IMPORTANT:
- Extract responsibilities from sections like "Responsibilities", "What You'll Do", "Key Responsibilities", "Duties", etc.
- Extract qualifications from sections like "Requirements", "Qualifications", "Must Have", "Requirements", "Required", etc.
- Return arrays with at least 3-5 items for responsibilities and qualifications if available
- If no responsibilities/qualifications found, return empty arrays []
- Only include skills that are explicitly mentioned in the job posting
- For postedAt, try to find the posting date, otherwise use null

If information is not available, use defaults: employment="full-time", remoteType="onsite", salaryMin=0, salaryMax=0, currency="USD"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No text content in AI response");
    }
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Ensure arrays are properly formatted and filter out empty values
    const ensureArray = (value: any): string[] => {
      if (!value) return [];
      if (!Array.isArray(value)) return [];
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    };

    // Extract salary from job.salary if provided (from Serper snippet)
    let salaryMin = parsed.salaryMin || 0;
    let salaryMax = parsed.salaryMax || 0;
    
    if ((!salaryMin || !salaryMax) && job.salary) {
      // Parse salary from string format like "$50k-$70k" or "$50,000-$70,000"
      const salaryRegex = /\$?([\d,]+)([kK]?)\s*[-–—]\s*\$?([\d,]+)([kK]?)/;
      const match = job.salary.match(salaryRegex);
      if (match) {
        const minValue = parseInt(match[1].replace(/,/g, ""), 10);
        const maxValue = parseInt(match[3].replace(/,/g, ""), 10);
        const minMultiplier = match[2].toLowerCase() === "k" ? 1000 : 1;
        const maxMultiplier = match[4].toLowerCase() === "k" ? 1000 : 1;
        
        salaryMin = minValue * minMultiplier;
        salaryMax = maxValue * maxMultiplier;
      } else {
        // Try single value with + (e.g., "$80k+")
        const singleMatch = job.salary.match(/\$?([\d,]+)([kK]?)\s*\+/);
        if (singleMatch) {
          const value = parseInt(singleMatch[1].replace(/,/g, ""), 10);
          const multiplier = singleMatch[2].toLowerCase() === "k" ? 1000 : 1;
          salaryMin = value * multiplier;
          salaryMax = 0; // Unknown max
        }
      }
    }

    // Use AI-extracted company name if provided and original was "Unknown Company"
    const finalCompany = (parsed.company && job.company === "Unknown Company") 
      ? parsed.company 
      : job.company;

    return {
      title: job.title,
      company: finalCompany,
      location: job.location,
      employment: parsed.employment || "full-time",
      remoteType: parsed.remoteType || "onsite",
      salaryMin: salaryMin || parsed.salaryMin || 0,
      salaryMax: salaryMax || parsed.salaryMax || 0,
      currency: parsed.currency || "USD",
      description: job.description,
      aiSummary: parsed.aiSummary || job.description.substring(0, 500),
      skills: ensureArray(parsed.skills),
      responsibilities: ensureArray(parsed.responsibilities),
      qualifications: ensureArray(parsed.qualifications),
      postedAt: parsed.postedAt ? new Date(parsed.postedAt) : null,
    };
  } catch (error) {
    console.error("Error enriching job with AI:", error);
    // Return defaults if AI fails - always ensure arrays are arrays
    return {
      title: job.title,
      company: job.company,
      location: job.location,
      employment: "full-time",
      remoteType: "onsite",
      salaryMin: 0,
      salaryMax: 0,
      currency: "USD",
      description: job.description,
      aiSummary: job.description.substring(0, 500),
      skills: [] as string[],
      responsibilities: [] as string[],
      qualifications: [] as string[],
      postedAt: null,
    };
  }
}

export const searchJobsForUser = inngest.createFunction(
  {
    id: "search-jobs-for-user",
    name: "Search Jobs for User",
  },
  {
    event: "app/jobPreferences.updated",
  },
  async ({ step, event }) => {
    const userId = event.data?.user?.id;
    
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
          city: true,
        },
      });

      if (!userData) {
        throw new Error("User not found");
      }

      if (!userData.jobPreferences || userData.jobPreferences.length === 0) {
        console.log("No job preferences set, skipping job search");
        return null;
      }

      return userData;
    });

    if (!user) {
      return;
    }

    // Search for jobs based on preferences
    const searchResults = await step.run("search-jobs", async () => {
      const allJobs: Array<{
        title: string;
        company: string;
        location: string;
        description: string;
        url: string;
      }> = [];

      // Search for each job preference
      for (const preference of user.jobPreferences) {
        try {
          const jobs = await searchJobsWeb(preference, user.city || undefined);
          allJobs.push(...jobs);
        } catch (error) {
          console.error(`Error searching for "${preference}":`, error);
        }
      }

      // Deduplicate by URL
      const uniqueJobs = Array.from(
        new Map(allJobs.map((job) => [job.url, job])).values()
      );

      console.log(`Found ${uniqueJobs.length} unique jobs`);
      return uniqueJobs;
    });

    // Enrich jobs with AI and calculate match scores
    const enrichedJobs = await step.run("enrich-and-score-jobs", async () => {
      const jobs: Array<{
        jobData: Prisma.JobUncheckedCreateInput;
        matchScore: number;
      }> = [];

      // Process jobs in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < searchResults.length; i += batchSize) {
        const batch = searchResults.slice(i, i + batchSize);
        
        const enriched = await Promise.all(
          batch.map(async (job) => {
            try {
              const enriched = await enrichJobWithAI(job);
              
              // Calculate match score
              const matchScore = calculateMatchScore(
                user.skills,
                enriched.skills,
                enriched.qualifications,
                enriched.responsibilities
              );

              return {
                jobData: {
                  userId: user.id,
                  sourceUrl: job.url,
                  title: enriched.title,
                  company: enriched.company,
                  location: enriched.location,
                  employment: enriched.employment,
                  remoteType: enriched.remoteType,
                  salaryMin: enriched.salaryMin,
                  salaryMax: enriched.salaryMax,
                  currency: enriched.currency,
                  description: enriched.description,
                  aiSummary: enriched.aiSummary,
                  skills: enriched.skills,
                  responsibilities: enriched.responsibilities,
                  qualifications: enriched.qualifications,
                  postedAt: enriched.postedAt,
                  // Store match score in tags for now (you might want to add a matchScore field to Job model)
                  tags: [`match-${matchScore}`],
                },
                matchScore,
              };
            } catch (error) {
              console.error(`Error processing job "${job.title}":`, error);
              return null;
            }
          })
        );

        jobs.push(...enriched.filter((j): j is NonNullable<typeof j> => j !== null));
      }

      // Sort by match score (highest first)
      jobs.sort((a, b) => b.matchScore - a.matchScore);

      return jobs;
    });

    // Save jobs to database (skip duplicates)
    await step.run("save-jobs", async () => {
      let savedCount = 0;
      let skippedCount = 0;

      for (const { jobData } of enrichedJobs) {
        try {
          await prisma.job.create({
            data: jobData,
          });
          savedCount++;
        } catch (error: any) {
          // Skip if job already exists (unique constraint on userId, title, company, sourceUrl)
          if (error?.code === "P2002") {
            skippedCount++;
          } else {
            console.error("Error saving job:", error);
          }
        }
      }

      console.log(`Saved ${savedCount} new jobs, skipped ${skippedCount} duplicates`);
    });
  }
);

