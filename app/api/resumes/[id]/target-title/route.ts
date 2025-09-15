import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
    request: Request, 
    context: { params: { id: string }}
) {
    const { params } = context;
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        const { jobTitle } = await request.json();

        console.log("Updating resume target job title:", {
            jobId: params.id,
            userEmail: session.user.email,
            jobTitle,
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
            data: { targetJobTitle: jobTitle }
        })

        return NextResponse.json(updatedResume);
    } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}