"use server";

import { getCurrentUserEmail } from "@/lib/auth-helpers";

import { prisma } from "@/lib/prisma";
import { normalizePhoneNumber, updateUserArrayEntry } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { FieldType } from "../delete/deleteUserProfileEntry";
import { inngest } from "@/services/inngest/client";


export async function UpdateUserField(
  field: FieldType,
  value?: string | string[]
) {
  const email = await getCurrentUserEmail();
  if (!email) throw new Error("Unauthorized");

  let updatedUser;

  switch (field) {
    case "skills":
    case "jobPreferences":
        //making sure what is passed in is an array
      if (!Array.isArray(value))
        throw new Error(`Expected array for ${field}`);
      updatedUser = await updateUserArrayEntry(email, field, value, "update");
      
      // Trigger job search when job preferences are updated
      if (field === "jobPreferences" && updatedUser) {
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });
        
        if (user) {
          console.log("📤 Sending jobPreferences.updated event for user:", user.id);
          try {
            await inngest.send({
              name: "app/jobPreferences.updated",
              data: {
                user: {
                  id: user.id,
                },
              },
            });
            console.log("✅ Event sent successfully");
          } catch (error) {
            console.error("❌ Failed to send event:", error);
          }
        }
      }
      break;

    default:
      throw new Error(`Unsupported field: ${field}`);
  }

  revalidatePath("/jobs/profile");
  return updatedUser;
}

export async function UpdateUserPersonalInfo(values: {
    githubUrl?: string;
    linkedInUrl?: string;
    portfolioUrl?: string;
    phoneNumber?: string;
    city?: string;
}) {
    const email = await getCurrentUserEmail();
    if(!email) throw new Error("Unauthorized");

    // Only include fields that are actually provided and not empty
    const updateData: {
        githubUrl?: string | null;
        linkedInUrl?: string | null;
        portfolioUrl?: string | null;
        phoneNumber?: string | null;
        city?: string | null;
    } = {};
    
    if (values.githubUrl !== undefined) {
        updateData.githubUrl = values.githubUrl || null;
    }
    if (values.linkedInUrl !== undefined) {
        updateData.linkedInUrl = values.linkedInUrl || null;
    }
    if (values.portfolioUrl !== undefined) {
        updateData.portfolioUrl = values.portfolioUrl || null;
    }
    if (values.phoneNumber !== undefined) {
        updateData.phoneNumber = values.phoneNumber ? normalizePhoneNumber(values.phoneNumber) : null;
    }
    if (values.city !== undefined) {
        updateData.city = values.city || null;
    }

    const updatedUser = await prisma.user.update({
        where: {email}, 
        data: updateData
    })

    revalidatePath("/jobs/profile")
    return updatedUser;
}


export async function UpdateUserEducation(values: {
  id?: string;
  school: string;
  major?: string;
  degree: string;
  gpa?: string;
  startDate?: Date;
  endDate?: Date;
  onGoing?: boolean;
}) {
  const email = await getCurrentUserEmail();
  if (!email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  if (
    values.startDate && 
    values.endDate &&
    values.startDate > values.endDate)  {
    throw new Error("Start date must be before end date");
  }


  const data = {
    school: values.school,
    major: values.major ?? null,
    degree: values.degree,
    gpa: values.gpa ?? null,
    startDate: values.startDate ?? null,
    endDate: values.onGoing ? null : values.endDate ?? null,
  };

  let education;
  if (values.id) {
    // update existing
    education = await prisma.education.update({
      where: { id: values.id },
      data,
    });
  } else {
    // create new
    education = await prisma.education.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
  }

  revalidatePath("/jobs/profile");

  return education;
}