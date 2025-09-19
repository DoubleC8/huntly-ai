export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { jobNoteSchema } from "@/lib/validations/jobNotes";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();

    const parsed = jobNoteSchema.safeParse(json);

    if (!parsed.success) {
      if (process.env.NODE_ENV === "development") {
        console.error("Validation failed:", parsed.error);
      }
      return NextResponse.json(
        { error: "Invalid Input", issues: parsed.error },
        { status: 400 }
      );
    }

    const { note } = parsed.data;
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedJob = await prisma.job.update({
      where: {
        id,
        userId: user.id,
      },
      data: { note: note ?? "" },
    });

    return NextResponse.json(updatedJob.note);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}