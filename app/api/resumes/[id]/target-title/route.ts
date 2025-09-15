import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { targetJobTitleSchema } from "@/lib/validations/resume";

export async function PUT(
    request: Request, 
    context: { params: { id: string }}
) {
    const { params } = await context;
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        const json = await request.json();

        const parsed = targetJobTitleSchema.safeParse(json);

        if(!parsed.success){
            return NextResponse.json(
                { error: "Invalid input", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const { targetJobTitle } = parsed.data;

       console.log("Updating resume target job title:", {
            jobId: params.id,
            userEmail: session.user.email,
            jobTitle: targetJobTitle,
        });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedResume = await prisma.resume.update({
            where: {
                id: params.id, 
                userId: user.id, 
            }, 
            data: { targetJobTitle: targetJobTitle }
        })

        return NextResponse.json(updatedResume);
    } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}