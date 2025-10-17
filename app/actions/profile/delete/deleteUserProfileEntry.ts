"use server";

import { auth } from "@/auth";
import { updateUserArrayEntry } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";


export async function DeleteProfileEntry(entry: string) {
    const session = await auth();
    if(!session?.user?.email) throw new Error("Unauthorized");

    
}

export async function DeleteUserSkill(skill: string){
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const updatedUser = await updateUserArrayEntry(
        session.user.email,
        "skills",
        skill, 
        "remove"
    );

    revalidatePath("/jobs/profile");
    return updatedUser;
}

export async function DeleteUserJobPreference(preference: string){
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const updatedUser = await updateUserArrayEntry(
        session.user.email, 
        "jobPreferences", 
        preference, 
        "remove"
    );

    revalidatePath("/jobs/profile");
    return updatedUser;
}

export async function DeleteUserEducation(id: string){
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email}, 
        include: { education: true }
    })

    if(!user) throw new Error("User not found")

    const updatedUser = await prisma.education.delete({
        where: { 
            id_userId: {
                id, 
                userId: user.id
            }
        },
    });

    revalidatePath("/jobs/profile");

    return updatedUser;
}