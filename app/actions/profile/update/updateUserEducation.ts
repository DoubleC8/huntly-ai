"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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