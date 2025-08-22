// /app/api/jobs/[id]/star/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const job = await prisma.job.update({
      where: { id },
      data: {
        stage: "WISHLIST",
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Failed to star job" }, { status: 500 });
  }
}