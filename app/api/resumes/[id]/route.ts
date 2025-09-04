import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filePath } = await req.json();

  if (!filePath) {
    return new Response("Missing filePath", { status: 400 });
  }

  try {
    // Remove from Supabase Storage
    const supabase = createClient();
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .remove([filePath]);

    if (storageError) {
      console.error("Supabase delete error:", storageError);
      return new Response("Failed to delete file from storage", { status: 500 });
    }

    // Look for resume in DB
    const resume = await prisma.resume.findUnique({
      where: { id: params.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { resumes: true },
    });

    const ownsResume = user?.resumes.some((r) => r.id === params.id);
    if (!ownsResume) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await prisma.resume.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("Server error in DELETE /api/resumes/[id]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}