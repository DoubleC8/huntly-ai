// /app/api/jobs/[id]/star/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const job = await prisma.job.update({
      where: { id },
      data: {
        stage: "WISHLIST",
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

     const newStage = job.stage === "WISHLIST" ? "DEFAULT" : "WISHLIST";


    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        stage: newStage,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ error: "Failed to star job" }, { status: 500 });
  }
}