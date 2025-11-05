import { calculateJobMatchScore } from "@/lib/services/jobMatchScoreService";
import { searchJobsForUser } from "@/lib/services/jobSearchService";
import { inngest } from "../client";
import { prisma } from "@/lib/prisma";

/**
 * Function: Run full job search when job preferences are updated
 * - Searches for new jobs using Serper AI across popular job sites
 * - Calculates match scores using Gemini AI
 * - Saves new jobs to DB with match scores
 */
export const searchJobsOnPreferencesUpdate = inngest.createFunction(
  { id: "search-jobs-on-preferences-update", name: "Search Jobs on Preferences Update" },
  { event: "app/jobPreferences.updated" },
  async ({ event, step }) => {
    console.log("🔔 Received jobPreferences.updated event:", JSON.stringify(event, null, 2));
    
    // Try multiple possible event structures
    const userId = (event as any).data?.user?.id || (event as any).user?.id;
    
    if (!userId) {
      console.error("❌ No user ID in event:", JSON.stringify(event, null, 2));
      return { success: false, reason: "No user ID found" };
    }
    
    console.log("✅ Extracted user ID:", userId);

    // Get user data including education for better matching
    const user = await step.run("get-user-data", async () => {
      const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          jobPreferences: true,
          skills: true,
          city: true,
          education: {
            select: {
              degree: true,
              major: true,
              school: true,
            },
          },
        },
      });
      return userData;
    });

    if (!user || !user.jobPreferences?.length) {
      return { success: false, reason: "No job preferences found" };
    }

    console.log(`🔍 Searching for jobs with preferences: ${user.jobPreferences.join(", ")}`);

    // Search for jobs using Serper AI
    const searchResults = await step.run("search-jobs", async () => {
      try {
        const jobs = await searchJobsForUser(
          user.jobPreferences,
          user.city,
          10 // 10 jobs per preference
        );
        console.log(`📋 Found ${jobs.length} jobs from search`);
        return jobs;
      } catch (error) {
        console.error("❌ Error searching jobs:", error);
        return [];
      }
    });

    if (searchResults.length === 0) {
      return { 
        success: true, 
        userId: user.id, 
        message: "No jobs found",
        processed: 0,
        saved: 0
      };
    }

    // Process each job: calculate match score and save if above threshold
    let processedCount = 0;
    let savedCount = 0;
    let skippedCount = 0;

    // Process jobs in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < searchResults.length; i += batchSize) {
      const batch = searchResults.slice(i, i + batchSize);
      
      await step.run(`process-batch-${i}`, async () => {
        const batchPromises = batch.map(async (job) => {
          processedCount++;
          
          try {
            // Calculate match score using Gemini AI
            const matchResult = await calculateJobMatchScore(
              {
                skills: user.skills || [],
                jobPreferences: user.jobPreferences,
                city: user.city,
                education: user.education || [],
              },
              {
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                source: job.source,
                salary: job.salary,
              }
            );

            // Only save jobs with match score >= 60
            if (matchResult.score >= 60) {
              // Check if job already exists
              const existing = await prisma.job.findUnique({
                where: {
                  userId_title_company_sourceUrl: {
                    userId: user.id,
                    title: job.title,
                    company: job.company,
                    sourceUrl: job.link,
                  },
                },
              });

              if (!existing) {
                // Extract salary information if available
                let salaryMin = 0;
                let salaryMax = 0;
                if (job.salary) {
                  const salaryMatch = job.salary.match(/\$[\d,]+/g);
                  if (salaryMatch && salaryMatch.length >= 2) {
                    salaryMin = parseInt(salaryMatch[0].replace(/[$,]/g, ""), 10);
                    salaryMax = parseInt(salaryMatch[1].replace(/[$,]/g, ""), 10);
                  } else if (salaryMatch && salaryMatch.length === 1) {
                    const salary = parseInt(salaryMatch[0].replace(/[$,]/g, ""), 10);
                    salaryMin = salary;
                    salaryMax = salary;
                  }
                }

                // Determine employment type and remote type from description
                const desc = job.description.toLowerCase();
                let employment = "Full-time";
                let remoteType = "On-site";
                
                if (desc.includes("part-time") || desc.includes("part time")) {
                  employment = "Part-time";
                } else if (desc.includes("contract")) {
                  employment = "Contract";
                } else if (desc.includes("intern") || desc.includes("internship")) {
                  employment = "Internship";
                }
                
                if (desc.includes("remote") && !desc.includes("not remote") && !desc.includes("no remote")) {
                  remoteType = "Remote";
                } else if (desc.includes("hybrid")) {
                  remoteType = "Hybrid";
                }

                // Build AI summary with match score and reasoning
                const aiSummary = `${matchResult.score}% match. ${matchResult.reasoning}${
                  matchResult.matchedSkills.length > 0 
                    ? ` Matched skills: ${matchResult.matchedSkills.slice(0, 5).join(", ")}.`
                    : ""
                }`;

                await prisma.job.create({
                  data: {
                    userId: user.id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    sourceUrl: job.link,
                    description: job.description,
                    salaryMin,
                    salaryMax,
                    currency: "USD",
                    employment,
                    remoteType,
                    stage: "DEFAULT",
                    aiSummary,
                  },
                });

                savedCount++;
                console.log(`✅ Saved job: ${job.title} at ${job.company} (score: ${matchResult.score}%)`);
                return { saved: true, job: job.title, score: matchResult.score };
              } else {
                skippedCount++;
                console.log(`⏭️  Skipped duplicate job: ${job.title}`);
                return { saved: false, reason: "duplicate" };
              }
            } else {
              skippedCount++;
              console.log(`⏭️  Skipped job (score ${matchResult.score} < 60): ${job.title}`);
              return { saved: false, reason: "low_score", score: matchResult.score };
            }
          } catch (error) {
            console.error(`❌ Error processing job ${job.title}:`, error);
            skippedCount++;
            return { saved: false, reason: "error", error: String(error) };
          }
        });

        await Promise.all(batchPromises);
        
        // Small delay between batches to avoid rate limiting
        if (i + batchSize < searchResults.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      });
    }

    console.log(`📊 Summary: Processed ${processedCount} jobs, Saved ${savedCount} jobs, Skipped ${skippedCount} jobs`);

    return { 
      success: true, 
      userId: user.id, 
      processed: processedCount,
      saved: savedCount,
      skipped: skippedCount
    };
  }
);

/**
 * Function: Update match scores only when resume changes
 * - Does NOT search for new jobs
 * - Only recalculates match scores for existing jobs using Gemini AI
 * - Updates the aiSummary field with new scores
 */
export const updateMatchScoresOnResumeChange = inngest.createFunction(
  { id: "update-match-scores-on-resume-change", name: "Update Match Scores on Resume Change" },
  { event: "app/resume.defaultChanged" },
  async ({ event, step }) => {
    console.log("🔔 Received resume.defaultChanged event:", JSON.stringify(event, null, 2));
    
    // Try multiple possible event structures
    const userId = (event as any).data?.user?.id || (event as any).user?.id;
    
    if (!userId) {
      console.error("❌ No user ID in event:", JSON.stringify(event, null, 2));
      return { success: false, reason: "No user ID found" };
    }
    
    console.log("✅ Extracted user ID:", userId);

    const user = await step.run("get-user-data", async () => {
      return prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          jobPreferences: true,
          skills: true,
          city: true,
          education: {
            select: {
              degree: true,
              major: true,
              school: true,
            },
          },
        },
      });
    });

    if (!user) {
      return { success: false, reason: "User not found" };
    }

    // Get all existing jobs for this user
    const jobs = await step.run("get-user-jobs", async () => {
      return prisma.job.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          employment: true,
          remoteType: true,
          salaryMin: true,
          salaryMax: true,
          description: true,
          aiSummary: true,
          skills: true,
          responsibilities: true,
          qualifications: true,
        },
      });
    });

    if (jobs.length === 0) {
      return { success: true, message: "No jobs to update", updated: 0 };
    }

    // Update match scores for each job using Gemini AI
    let updatedCount = 0;
    const batchSize = 5;
    
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);
      
      await step.run(`update-scores-batch-${i}`, async () => {
        const batchPromises = batch.map(async (job) => {
          try {
            const matchResult = await calculateJobMatchScore(
              {
                skills: user.skills || [],
                jobPreferences: user.jobPreferences || [],
                city: user.city,
                education: user.education || [],
              },
              {
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                salary: job.salaryMin > 0 
                  ? `$${job.salaryMin.toLocaleString()}${job.salaryMax > job.salaryMin ? ` - $${job.salaryMax.toLocaleString()}` : ""}`
                  : undefined,
              }
            );

            // Build AI summary with match score and reasoning
            const aiSummary = `${matchResult.score}% match. ${matchResult.reasoning}${
              matchResult.matchedSkills.length > 0 
                ? ` Matched skills: ${matchResult.matchedSkills.slice(0, 5).join(", ")}.`
                : ""
            }`;

            await prisma.job.update({
              where: { id: job.id },
              data: {
                aiSummary,
              },
            });

            updatedCount++;
            console.log(`✅ Updated match score for job: ${job.title} (new score: ${matchResult.score}%)`);
            return { jobId: job.id, score: matchResult.score };
          } catch (error) {
            console.error(`❌ Error updating score for job ${job.id}:`, error);
            return { jobId: job.id, error: String(error) };
          }
        });

        await Promise.all(batchPromises);
        
        // Small delay between batches to avoid rate limiting
        if (i + batchSize < jobs.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      });
    }

    console.log(`✅ Updated match scores for ${updatedCount} jobs for user ${user.email}`);

    return { success: true, userId: user.id, updated: updatedCount };
  }
);

