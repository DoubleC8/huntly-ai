"use server";

import { auth } from "@/auth";
import { updateUserArrayEntry } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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
