import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context; 
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { note } = await request.json();

    console.log("Updating job note:", {
      jobId: params.id,
      userEmail: session.user.email,
      note,
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: { note },
    });

    return NextResponse.json(updatedJob);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}