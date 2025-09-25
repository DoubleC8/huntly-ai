"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Education } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";


export async function DeleteUserEducation(id: string){
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email}, 
        include: { education: true }
    })

    const ownsEducationEntry = user?.education.some((e: Education) => e.id === id);
    if(!ownsEducationEntry) throw new Error("Unauthorized");

    await prisma.education.delete({
        where: { id },
    });

    revalidatePath("/jobs/profile");
}