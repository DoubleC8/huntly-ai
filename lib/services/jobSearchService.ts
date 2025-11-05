import { env } from "@/data/env/server";

export interface JobSearchResult {
  title: string;
  company: string;
  location: string;
  description: string;
  link: string;
  source: string; // Which job site it came from
  postedDate?: string;
  salary?: string;
}

/**
 * Search for jobs using Serper AI across popular job posting sites
 * Searches: Google Jobs, Indeed, LinkedIn, Glassdoor, Wellfound
 */
export async function searchJobsWithSerper(
  query: string,
  location?: string,
  limit: number = 20
): Promise<JobSearchResult[]> {
  if (!env.SERPER_API_KEY) {
    throw new Error("SERPER_API_KEY is not configured");
  }

  // Define job sites to search
  const jobSites = [
    { domain: "linkedin.com/jobs", name: "LinkedIn" },
    { domain: "indeed.com", name: "Indeed" },
    { domain: "glassdoor.com/job", name: "Glassdoor" },
    { domain: "wellfound.com", name: "Wellfound" },
    { domain: "jobs.google.com", name: "Google Jobs" },
  ];

  const allJobs: JobSearchResult[] = [];
  const seenLinks = new Set<string>();

  // Search each job site separately for better coverage
  for (const site of jobSites) {
    try {
      const baseQuery = `${query} job`;
      const searchQuery = location
        ? `${baseQuery} site:${site.domain} location:"${location}"`
        : `${baseQuery} site:${site.domain}`;

      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: searchQuery,
          num: Math.ceil(limit / jobSites.length), // Distribute limit across sites
          gl: "us",
          type: "search",
        }),
      });

      if (!response.ok) {
        console.warn(`Serper API error for ${site.name}: ${response.status}`);
        continue; // Continue with other sites if one fails
      }

      const data = await response.json();

      if (data.organic) {
        for (const item of data.organic) {
          const link = item.link || "";
          
          // Skip duplicates
          if (seenLinks.has(link)) continue;
          seenLinks.add(link);

          // Extract job details
          const title = item.title || "Untitled Position";
          const company = item.source || item.sitelinks?.[0]?.title || "Unknown Company";
          const jobLocation = item.address || item.metadesc?.match(/location[:\s]+([^,]+)/i)?.[1] || "Not specified";
          const description = item.snippet || item.description || "";
          
          // Try to extract salary from snippet or title
          let salary: string | undefined;
          const salaryMatch = (item.snippet || item.title || "").match(/\$[\d,]+[\s-]+\$[\d,]+|\$[\d,]+/i);
          if (salaryMatch) {
            salary = salaryMatch[0];
          }

          allJobs.push({
            title,
            company,
            location: jobLocation,
            description,
            link,
            source: site.name,
            salary,
          });
        }
      }

      // Small delay between site searches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error searching ${site.name}:`, error);
      // Continue with other sites even if one fails
    }
  }

  // Also do a general search without site restriction for Google Jobs
  try {
    const generalQuery = location
      ? `${query} job location:"${location}"`
      : `${query} job`;
    
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: generalQuery,
        num: 5,
        gl: "us",
        type: "search",
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.organic) {
        for (const item of data.organic) {
          const link = item.link || "";
          
          // Only add if it's from a job site and not already seen
          if (seenLinks.has(link)) continue;
          
          const isJobSite = jobSites.some(site => link.includes(site.domain.split('/')[0]));
          if (!isJobSite) continue;
          
          seenLinks.add(link);

          // Determine source from URL
          let source = "Google Jobs";
          if (link.includes("linkedin.com")) source = "LinkedIn";
          else if (link.includes("indeed.com")) source = "Indeed";
          else if (link.includes("glassdoor.com")) source = "Glassdoor";
          else if (link.includes("wellfound.com")) source = "Wellfound";

          const title = item.title || "Untitled Position";
          const company = item.source || "Unknown Company";
          const jobLocation = item.address || "Not specified";
          const description = item.snippet || item.description || "";
          
          let salary: string | undefined;
          const salaryMatch = (item.snippet || item.title || "").match(/\$[\d,]+[\s-]+\$[\d,]+|\$[\d,]+/i);
          if (salaryMatch) {
            salary = salaryMatch[0];
          }

          allJobs.push({
            title,
            company,
            location: jobLocation,
            description,
            link,
            source,
            salary,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error in general job search:", error);
  }

  return allJobs.slice(0, limit); // Return up to the requested limit
}

/**
 * Search for jobs across multiple job preferences
 */
export async function searchJobsForUser(
  jobPreferences: string[],
  userLocation?: string | null,
  jobsPerPreference: number = 10
): Promise<JobSearchResult[]> {
  const allJobs: JobSearchResult[] = [];
  const seenLinks = new Set<string>();

  // Search for each job preference
  for (const preference of jobPreferences) {
    try {
      const jobs = await searchJobsWithSerper(preference, userLocation || undefined, jobsPerPreference);
      
      // Deduplicate by link
      for (const job of jobs) {
        if (!seenLinks.has(job.link)) {
          seenLinks.add(job.link);
          allJobs.push(job);
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error searching for "${preference}":`, error);
      // Continue with other preferences even if one fails
    }
  }

  return allJobs;
}

