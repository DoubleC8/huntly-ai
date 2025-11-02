import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { updateUserResume } from "@/features/users/db/userResumes";
import { updateUser } from "@/features/users/db/users";
import { env } from "@/data/env/server";
import { GoogleGenAI } from "@google/genai";
import { normalizePhoneNumber } from "@/lib/phone-utils";

export const createAiSummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const userId = event.data?.user?.id;
    
    if (!userId) {
      console.error("No user ID in event:", event);
      return;
    }

    const userResume = await step.run("get-user-resume", async () => {
      const resume = await prisma.resume.findFirst({
        where: { userId },
        select: { publicUrl: true, id: true },
        orderBy: { isDefault: "desc" },
      });
      
      console.log("Found resume:", { resumeId: resume?.id, publicUrl: resume?.publicUrl });
      return resume;
    });

    if (userResume == null) {
      console.log("No resume found for user:", userId);
      return;
    }

    // Fetch and process resume using Google GenAI SDK
    const aiResult = await step.run("create-ai-summary", async () => {
      try {
        console.log("Fetching resume from:", userResume.publicUrl);
        
        // Download the PDF file
        const pdfResponse = await fetch(userResume.publicUrl);
        if (!pdfResponse.ok) {
          throw new Error(`Failed to fetch resume: ${pdfResponse.statusText}`);
        }
        
        const arrayBuffer = await pdfResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        console.log("PDF downloaded, size:", buffer.length, "bytes");
        
        // Initialize Google GenAI client
        const ai = new GoogleGenAI({
          apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
        });

        const prompt = "Analyze this resume and extract the following information in JSON format:\n1. A detailed markdown summary (field: 'summary') that includes all key skills, experience, and qualifications that a hiring manager would need to know\n2. An array of all skills mentioned (field: 'skills')\n3. An array of education entries with the following structure for each: { school: string, degree: string, major?: string, startDate?: string, endDate?: string, onGoing?: boolean, gpa?: string } (field: 'education')\n4. Phone number if available (field: 'phoneNumber', format: include country code if present, e.g., '+14155551234' or just '4155551234')\n5. City/location if available (field: 'city', just the city name, e.g., 'San Francisco')\n\nReturn ONLY valid JSON in this format:\n{\n  \"summary\": \"markdown summary here\",\n  \"skills\": [\"skill1\", \"skill2\"],\n  \"education\": [{ \"school\": \"...\", \"degree\": \"...\", ... }],\n  \"phoneNumber\": \"+14155551234\" or null,\n  \"city\": \"San Francisco\" or null\n}\n\nIf the file does not look like a resume, return: {\"summary\": \"N/A\", \"skills\": [], \"education\": [], \"phoneNumber\": null, \"city\": null}";

        // Generate content with PDF using inlineData (fileUri requires Google Cloud Storage)
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-lite",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: base64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
        });

        console.log("Gemini API response received");
        
        const text = response.text;
        if (!text) {
          throw new Error("No text content in Gemini response");
        }

        return { text };
      } catch (error) {
        console.error("AI inference error:", error);
        throw error;
      }
    });

    // Format result to match expected structure
    const result = {
      content: [
        {
          type: "text" as const,
          text: aiResult.text,
        },
      ],
    };

    await step.run("save-ai-summary-and-extract-data", async () => {
      // Ensure userId is available (Inngest might serialize steps, losing closure variables)
      const stepUserId = userId || event.data?.user?.id;
      
      if (!stepUserId) {
        console.error("No user ID available in step");
        return;
      }
      
      if (!result.content || result.content.length === 0) {
        console.error("No content in AI response");
        return;
      }

      const message = result.content[0];
      console.log("Processing AI response:", { type: message.type, hasText: message.type === "text", userId: stepUserId });

      if (message.type !== "text") {
        console.error("Unexpected message type:", message.type);
        return;
      }

      let parsedData: {
        summary: string;
        skills: string[];
        education: Array<{
          school: string;
          degree: string;
          major?: string;
          startDate?: string;
          endDate?: string;
          onGoing?: boolean;
          gpa?: string;
        }>;
        phoneNumber?: string | null;
        city?: string | null;
      };

      try {
        // Extract JSON from the response (might have markdown code blocks)
        const jsonMatch = message.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }
        parsedData = JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error("Failed to parse AI response:", error);
        // Fallback: save the raw text as summary
        await updateUserResume(stepUserId, { aiSummary: message.text });
        return;
      }

      // Save the AI summary to the resume
      await updateUserResume(stepUserId, { aiSummary: parsedData.summary });

      // Prepare user update data
      const userUpdateData: {
        skills?: string[];
        phoneNumber?: string | null;
        city?: string | null;
      } = {};

      // Update user with extracted skills
      if (parsedData.skills && parsedData.skills.length > 0) {
        userUpdateData.skills = parsedData.skills;
      }

      // Update user with phone number (normalize if provided)
      if (parsedData.phoneNumber) {
        try {
          const normalizedPhone = normalizePhoneNumber(parsedData.phoneNumber);
          if (normalizedPhone) {
            userUpdateData.phoneNumber = normalizedPhone;
            console.log("Extracted phone number:", normalizedPhone);
          }
        } catch (error) {
          console.error("Error normalizing phone number:", error);
        }
      }

      // Update user with city (if provided)
      if (parsedData.city) {
        userUpdateData.city = parsedData.city.trim();
        console.log("Extracted city:", parsedData.city);
      }

      // Update user with all extracted data
      if (Object.keys(userUpdateData).length > 0) {
        console.log("Updating user data:", { userId: stepUserId, fields: Object.keys(userUpdateData) });
        await updateUser(stepUserId, userUpdateData);
      }

      // Create/update education entries
      if (parsedData.education && parsedData.education.length > 0) {
        // First, delete existing education entries for this user
        await prisma.education.deleteMany({
          where: { userId: stepUserId },
        });

        // Then create new ones
        await prisma.education.createMany({
          data: parsedData.education.map((edu) => {
            let startDate: Date | null = null;
            let endDate: Date | null = null;

            if (edu.startDate) {
              try {
                startDate = new Date(edu.startDate);
                if (isNaN(startDate.getTime())) startDate = null;
              } catch {
                startDate = null;
              }
            }

            if (edu.endDate) {
              try {
                endDate = new Date(edu.endDate);
                if (isNaN(endDate.getTime())) endDate = null;
              } catch {
                endDate = null;
              }
            }

            return {
              userId: stepUserId,
              school: edu.school,
              degree: edu.degree,
              major: edu.major || null,
              gpa: edu.gpa || null,
              startDate,
              endDate,
              onGoing: edu.onGoing || false,
            };
          }),
        });
      }
    });
  }
);

