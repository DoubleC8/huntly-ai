"use server";

import { getCurrentUserEmail } from "@/lib/auth-helpers";
import { createAdminClient } from "@/lib/supabase/server";

export async function uploadResume(file: File, filePath: string) {
  const email = await getCurrentUserEmail();
  if (!email) {
    throw new Error("Unauthorized");
  }

  // Convert File to Buffer for Supabase
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Upload to Supabase using admin client
    // Note: We use admin client because users authenticate via NextAuth (not Supabase Auth),
    // so RLS policies that require auth.uid() won't work for us.
    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("URL generation failed");
    }

    return { success: true, publicUrl: data.publicUrl };
  } catch (error) {
    console.error("Upload action error:", error);
    throw error;
  }
}

