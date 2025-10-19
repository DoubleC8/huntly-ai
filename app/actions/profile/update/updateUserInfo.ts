"use server";

import { auth } from "@/auth";
import { normalizePhoneNumber } from "@/lib/phone-utils";
import { prisma } from "@/lib/prisma";
import { updateUserArrayEntry } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function updateUserPersonalInfo(values: {
    githubUrl?: string;
    linkedInUrl?: string;
    portfolioUrl?: string;
    phoneNumber?: string;
    city?: string;
}) {
    const session = await auth();

    if(!session?.user?.email) throw new Error("Unauthorized");

    const normalizedPhoneNumber = values.phoneNumber
    ? normalizePhoneNumber(values.phoneNumber)
    : null;

    const updatedUser = await prisma.user.update({
        where: {email: session.user.email}, 
        data: {
            githubUrl: values.githubUrl || null,
            linkedInUrl: values.linkedInUrl || null,
            portfolioUrl: values.portfolioUrl || null,
            phoneNumber: normalizedPhoneNumber,
            city: values.city || null,
        }
    })

    revalidatePath("/jobs/profile")
    return updatedUser;
}

export async function updateUserSkills(skills: string[]) {
   const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");
  
    const updatedUser = await updateUserArrayEntry(
            session.user.email,
            "skills",
            skills, 
            "update"
    );
    
    revalidatePath("/jobs/profile")
  
    return updatedUser;
}


export async function updateUserJobPreference(preferences: string[]) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const updatedUser = await updateUserArrayEntry(
          session.user.email,
          "jobPreferences",
          preferences, 
          "update"
  );
  
  revalidatePath("/jobs/profile")

  return updatedUser;
}

export async function updateUserEducation(values: {
  id?: string;
  school: string;
  major?: string;
  degree: string;
  gpa?: string;
  startDate?: Date;
  endDate?: Date;
  onGoing?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

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