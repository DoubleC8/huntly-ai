import { env } from "@/data/env/server";
import { createAgent, gemini } from "@inngest/agent-kit";
import { z } from "zod";

// Create agent for calculating match scores
export function createMatchScoreAgent(
  userProfile: {
    skills: string[];
    jobPreferences: string[];
    city?: string | null;
  },
  job: {
    title: string;
    company: string;
    location: string;
    employment: string;
    remoteType: string;
    salaryMin: number;
    salaryMax: number;
    description: string;
    aiSummary?: string;
    skills: string[];
    responsibilities: string[];
    qualifications: string[];
  }
) {
  return createAgent({
    name: "Match Score Agent",
    description: "Agent for calculating how well a job matches a user's profile",
    system: `You are an expert at evaluating job matches. Calculate a match score (0-100) for how well this job matches the user's profile.

User Profile:
- Skills: ${userProfile.skills.join(", ") || "Not specified"}
- Job Preferences: ${userProfile.jobPreferences.join(", ") || "Not specified"}
- Location: ${userProfile.city || "Not specified"}

Job Details:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Type: ${job.employment} (${job.remoteType})
- Salary: $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}
- Summary: ${job.aiSummary || job.description.substring(0, 500)}
- Required Skills: ${job.skills.join(", ")}
- Qualifications: ${job.qualifications.slice(0, 10).join("; ")}
- Responsibilities: ${job.responsibilities.slice(0, 10).join("; ")}

Score Guidelines:
- 90-100: Perfect or near-perfect match. User's skills align excellently with requirements.
- 70-89: Strong match. User has most required skills and good alignment.
- 50-69: Moderate match. User has some required skills, may need to learn others.
- 30-49: Weak match. User has few relevant skills or significant gaps.
- 0-29: Poor match. User lacks most required skills or qualifications.

Consider:
1. Skills overlap (most important - 40% weight)
2. Job preference alignment (20% weight)
3. Experience level fit (15% weight)
4. Location compatibility (10% weight)
5. Overall job description match (15% weight)

Return ONLY a JSON object with this exact format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation of the score>"
}`,
    model: gemini({
      model: "gemini-2.0-flash",
      apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
    }),
  });
}

// Calculate match score using AI agent
export async function calculateMatchScoreWithAgent(
  userProfile: {
    skills: string[];
    jobPreferences: string[];
    city?: string | null;
  },
  job: {
    title: string;
    company: string;
    location: string;
    employment: string;
    remoteType: string;
    salaryMin: number;
    salaryMax: number;
    description: string;
    aiSummary?: string;
    skills: string[];
    responsibilities: string[];
    qualifications: string[];
  }
): Promise<{ score: number; reasoning?: string }> {
  const agent = createMatchScoreAgent(userProfile, job);
  const result = await agent.run("Calculate the match score for this job.") as Awaited<ReturnType<typeof agent.run>>;

  // Extract JSON from response
  const lastMessage = result.output.at(-1);
  
  if (!lastMessage || lastMessage.type !== "text") {
    // Fallback to default score
    return { score: 50 };
  }

  const content = typeof lastMessage.content === "string"
    ? lastMessage.content.trim()
    : lastMessage.content.join("\n").trim();

  // Try to extract JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: Math.max(0, Math.min(100, parsed.score || 50)),
        reasoning: parsed.reasoning,
      };
    } catch {
      // If JSON parsing fails, try to extract just the number
      const scoreMatch = content.match(/"score":\s*(\d+)/);
      if (scoreMatch) {
        return { score: parseInt(scoreMatch[1], 10) };
      }
    }
  }

  // Fallback: try to extract any number that might be a score
  const numberMatch = content.match(/\b(\d{1,3})\b/);
  if (numberMatch) {
    const score = parseInt(numberMatch[1], 10);
    if (score >= 0 && score <= 100) {
      return { score };
    }
  }

  // Final fallback
  return { score: 50 };
}

