export const runtime = "nodejs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { Resume } from "@/app/generated/prisma";

//handles deleting resumes
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { filePath } = await req.json();
  const { id } = await params;

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
      where: { id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { resumes: true },
    });

    const ownsResume = user?.resumes.some((r: Resume) => r.id === id);
    if (!ownsResume) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("Server error in DELETE /api/resumes/[id]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//handles making resumes default resume
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try{
    const resume = await prisma.resume.findUnique({
            where: { id}, 
    })

    if(!resume){
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email },
        include: { resumes: true }
    })

    //checking to see if the user is the owner of the resume to make sure they can  make it their default
    const ownsResume = user?.resumes.some((r: Resume) => r.id === id);
    if (!ownsResume) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    //unsetting all other user resumes, so that one resume is default
    await prisma.resume.updateMany({
      where: { userId: resume.userId },
      data: { isDefault: false },
    });

    const updated = await prisma.resume.update({
        where: { id },
        data: { isDefault: true }
    })

    return NextResponse.json(updated);
  } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json(
        { error: "Failed to set resume as default" },
        { status: 500 }
    );
  }
}