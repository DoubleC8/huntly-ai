// app/api/resume/update/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("🔥 /api/resume/update hit");

  const session = await auth();
  if (!session) {
    console.error("❌ Unauthorized access attempt.");
    return new Response("Unauthorized", { status: 401 });
  }

  const { resumeUrl, fileName } = await req.json();

  console.log("📦 Received in route:", { resumeUrl, fileName });

  if (!resumeUrl || !fileName) {
    console.error("⚠️ Missing resumeUrl or fileName in request.");
    return new Response("Missing data", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      include: { Resume: true },
    });

    if (!user) {
      console.error("❌ User not found.");
      return new Response("User not found", { status: 404 });
    }

    const isFirstResume = user.Resume.length === 0;

    console.log("📝 About to create resume record...");
    const newResume = await prisma.resume.create({
      data: {
        userId: user.id,
        publicUrl: resumeUrl,
        fileName,
        isDefault: isFirstResume,
      },
    });

    console.log("✅ Resume record created:", newResume);
    return new Response("Resume uploaded and saved", { status: 200 });
  } catch (e) {
    console.error("❌ Failed to create resume:", e);
    return new Response("Failed to create resume", { status: 500 });
  }
}