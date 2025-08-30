// app/api/resume/update/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { resumeUrl, fileName } = await req.json();


  if (!resumeUrl || !fileName) {
    return new Response("Missing data", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      include: { resumes: true },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const isFirstResume = user.resumes.length === 0;

    const newResume = await prisma.resume.create({
      data: {
        userId: user.id,
        publicUrl: resumeUrl,
        fileName,
        isDefault: isFirstResume,
      },
    });

    return new Response("Resume uploaded and saved", { status: 200 });
  } catch (e) {
    return new Response("Failed to create resume", { status: 500 });
  }
}