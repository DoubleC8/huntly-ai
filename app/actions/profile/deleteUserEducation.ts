"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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