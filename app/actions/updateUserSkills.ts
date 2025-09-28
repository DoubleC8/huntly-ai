"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function normalizeSkill(skill: string): string {
    return skill.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function updateUserSkills(skills: string[]) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { skills: true },
  });

  if (!user) throw new Error("User not found");

  const normalized = skills.map(normalizeSkill).filter(Boolean);
  const uniqueSkills = Array.from(new Set([...user.skills, ...normalized]));

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: { skills: uniqueSkills }
  })

  revalidatePath("/jobs/profile");

  return updatedUser.skills;
}