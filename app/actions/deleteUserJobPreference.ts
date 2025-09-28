"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function normalizePreference(preference: string): string {
  return preference.trim().toLowerCase().replace(/\s+/g, " ");
}


export async function DeleteUserJobPreference(preference: string){
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { jobPreferences: true }
    })

    const filtered = user?.jobPreferences.filter(
        (j) => normalizePreference(j) !== normalizePreference(preference));

    const updatedUser = await prisma.user.update({
        where: {
            email: session.user.email
        },
        data: {
            jobPreferences: filtered
        }
    })

    revalidatePath("/jobs/profile");
    return updatedUser.jobPreferences;
}