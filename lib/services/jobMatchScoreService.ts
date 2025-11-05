import { env } from "@/data/env/server";
import { GoogleGenAI } from "@google/genai";

export interface UserProfile {
  skills: string[];
  jobPreferences: string[];
  city?: string | null;
  education?: Array<{
    degree: string;
    major?: string | null;
    school: string;
  }>;
}

export interface JobDetails {
  title: string;
  company: string;
  location: string;
  description: string;
  source?: string;
  salary?: string;
}

export interface MatchScoreResult {
  score: number; // 0-100
  reasoning: string;
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Calculate match score using Gemini AI
 */
export async function calculateJobMatchScore(
  userProfile: UserProfile,
  jobDetails: JobDetails
): Promise<MatchScoreResult> {
  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const prompt = `You are an expert job matching analyst. Analyze how well this job matches the user's profile and calculate a match score from 0-100.

USER PROFILE:
- Skills: ${userProfile.skills.length > 0 ? userProfile.skills.join(", ") : "None specified"}
- Job Preferences: ${userProfile.jobPreferences.length > 0 ? userProfile.jobPreferences.join(", ") : "None specified"}
- Location: ${userProfile.city || "Not specified"}
${userProfile.education && userProfile.education.length > 0 ? `- Education: ${userProfile.education.map(e => `${e.degree}${e.major ? ` in ${e.major}` : ""} from ${e.school}`).join(", ")}` : ""}

JOB DETAILS:
- Title: ${jobDetails.title}
- Company: ${jobDetails.company}
- Location: ${jobDetails.location}
- Source: ${jobDetails.source || "Unknown"}
${jobDetails.salary ? `- Salary: ${jobDetails.salary}` : ""}
- Description: ${jobDetails.description.substring(0, 2000)}

SCORING GUIDELINES:
- 90-100: Excellent match. User has all or nearly all required skills, perfect alignment with preferences.
- 70-89: Strong match. User has most required skills, good alignment with preferences.
- 50-69: Moderate match. User has some required skills, partial alignment.
- 30-49: Weak match. User has few relevant skills, significant gaps.
- 0-29: Poor match. User lacks most required skills or qualifications.

CRITERIA TO CONSIDER (weighted):
1. Skills Overlap (40%): How many required skills from the job description match the user's skills?
2. Job Preference Alignment (25%): Does the job title/description match the user's job preferences?
3. Experience Level Fit (15%): Based on the job description, can the user handle this role?
4. Location Compatibility (10%): Does the location work for the user? Consider remote/hybrid options.
5. Overall Relevance (10%): General fit based on description, company, and role type.

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation of why this score was given, 2-3 sentences>",
  "matchedSkills": [<array of skills from user's profile that match the job>],
  "missingSkills": [<array of important skills mentioned in job that user doesn't have>]
}

Do not include any markdown formatting, code blocks, or additional text. Only return the JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.text?.trim() || "";

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = text;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    } else {
      // Try to find JSON object in the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
    }

    const parsed = JSON.parse(jsonText);

    // Validate and sanitize the response
    const score = Math.max(0, Math.min(100, Math.round(parsed.score || 50)));
    const reasoning = parsed.reasoning || "Match score calculated based on skills and preferences.";
    const matchedSkills = Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [];
    const missingSkills = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];

    return {
      score,
      reasoning,
      matchedSkills,
      missingSkills,
    };
  } catch (error) {
    console.error("Error calculating match score with Gemini:", error);
    
    // Fallback: calculate a simple score based on keyword matching
    return calculateFallbackMatchScore(userProfile, jobDetails);
  }
}

/**
 * Fallback match score calculation if AI fails
 */
function calculateFallbackMatchScore(
  userProfile: UserProfile,
  jobDetails: JobDetails
): MatchScoreResult {
  let score = 50; // Start with base score
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const jobText = `${jobDetails.title} ${jobDetails.description}`.toLowerCase();

  // Check skill matches
  for (const skill of userProfile.skills) {
    if (jobText.includes(skill.toLowerCase())) {
      score += 5;
      matchedSkills.push(skill);
    }
  }

  // Check preference matches
  for (const preference of userProfile.jobPreferences) {
    if (jobText.includes(preference.toLowerCase())) {
      score += 10;
    }
  }

  // Check location match
  if (userProfile.city && jobDetails.location.toLowerCase().includes(userProfile.city.toLowerCase())) {
    score += 10;
  }

  // Cap at 100
  score = Math.min(100, score);

  return {
    score,
    reasoning: `Fallback calculation: Found ${matchedSkills.length} skill matches.`,
    matchedSkills,
    missingSkills,
  };
}

