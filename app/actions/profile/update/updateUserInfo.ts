"use server";

import { auth } from "@/auth";
import { normalizePhoneNumber } from "@/lib/phone-utils";
import { prisma } from "@/lib/prisma";
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