"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteUserSkill(skill: string){
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email }, 
        select: { skills: true }
    })

    const filtered = user?.skills.filter((s) => s !== skill);

    const updatedUser = await prisma.user.update({
        where: {
            email: session.user.email
        },
        data: {
            skills: filtered,
        }
    })

    revalidatePath("/jobs/profile");
    return updatedUser;
}