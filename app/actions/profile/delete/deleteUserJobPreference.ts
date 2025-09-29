"use server";

import { auth } from "@/auth";
import { updateUserArrayEntry } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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