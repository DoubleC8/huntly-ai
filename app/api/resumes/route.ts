import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// gets all user resumes
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { resumes: true },
  });

  return NextResponse.json(user?.resumes ?? []);
}

// uploads users new resumes
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resumeUrl, fileName } = await req.json();

  if (!resumeUrl || !fileName) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { resumes: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isFirstResume = user.resumes.length === 0;

    const newResume = await prisma.resume.create({
      data: {
        userId: user.id,
        publicUrl: resumeUrl,
        fileName,
        isDefault: isFirstResume,
      },
    });

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}