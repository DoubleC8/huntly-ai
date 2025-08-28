"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResumeUploadClient({ email }: { email: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !email) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${email}/resume.${fileExt}`;

    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    setResumeUrl(publicUrl);

    await fetch("/api/resume/update", {
      method: "POST",
      body: JSON.stringify({ resumeUrl: publicUrl }),
    });

    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Upload Your Resume</h2>

      <Input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button disabled={!file || uploading} onClick={handleUpload}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </Button>

      {resumeUrl && (
        <p className="text-sm">
          ✅ Uploaded:{" "}
          <a
            href={resumeUrl}
            target="_blank"
            className="underline text-blue-600"
          >
            View Resume
          </a>
        </p>
      )}
    </div>
  );
}
