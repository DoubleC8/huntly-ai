"use server";

import { auth } from "@/auth";
import { updateUserArrayEntry } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type FieldType =     
  | "email"
  | "education"
  | "skills"
  | "jobPreferences"
  | "githubUrl"
  | "linkedInUrl"
  | "portfolioUrl"
  | "phoneNumber"
  | "city";


export async function DeleteUserField(field: FieldType, value?: string) {
    const session = await auth();
    if(!session?.user?.email) throw new Error("Unauthorized");

    if (field === "email") throw new Error("Cannot Delete Email Field.")

    const email = session.user.email;

    switch (field) {
        case "skills":
        case "jobPreferences":
        if (!value) throw new Error("Value required");
        await updateUserArrayEntry(email, field, value, "remove");
        break;

        case "education":
        if (!value) throw new Error("Education ID required");
        const user = await prisma.user.findUnique({
            where: { email },
            include: { education: true },
        });
        if (!user) throw new Error("User not found");
        await prisma.education.delete({
            where: {
            id_userId: { id: value, userId: user.id },
            },
        });
        break;

        case "githubUrl":
        case "linkedInUrl":
        case "portfolioUrl":
        case "phoneNumber":
        case "city":
        await prisma.user.update({
            where: { email },
            data: { [field]: null },
        });
        break;

        default:
        throw new Error(`Unsupported field type: ${field}`);
  }

  revalidatePath("/jobs/profile");
}
