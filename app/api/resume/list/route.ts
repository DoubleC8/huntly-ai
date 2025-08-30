// app/api/resume/list/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: { resumes: true },
  });

  if (!user) return new Response("User not found", { status: 404 });

  return Response.json(user.resumes);
}