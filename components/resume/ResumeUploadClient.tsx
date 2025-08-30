"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import {
  FileText,
  LoaderCircle,
  Plus,
  Upload,
  WandSparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function ResumeUploadClient({
  email,
  onUploadSuccess,
}: {
  email: string;
  onUploadSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleUpload = async () => {
    if (!file || !email) return;
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${email}/resume-${Date.now()}.${fileExt}`;
      const supabase = createClient();

      //this uploads our resume to supabase
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        toast.error("Upload failed", {
          description: "Please try again.",
        });
        return;
      }

      //getting the public url to apply it to our prisma
      const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;

      if (!publicUrl) {
        console.error("No public URL found.");
        alert("Could not generate file URL. Please try again.");
        return;
      }

      setResumeUrl(publicUrl);

      // Save in database
      const res = await fetch("/api/resume/update", {
        method: "POST",
        body: JSON.stringify({ resumeUrl: publicUrl, fileName: file.name }),
      });

      if (!res.ok) {
        console.error("Failed to save resume metadata:", await res.text());
        alert("Upload succeeded but failed to save in database.");
        return;
      }

      // Success
      setOpen(false);
      setFile(null);
      toast.success("Resume successfully uploaded.", {
        description: "Sit back and watch the magic happen.",
      });
      onUploadSuccess?.();
    } catch (error) {
      console.error("Unexpected error in handleUpload:", error);
      toast.error("Upload failed", {
        description: "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          Add Resume <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="md:min-w-1/2
      sm:max-w-md rounded-xl shadow-lg flex flex-col justify-between"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Upload Your Resume
          </DialogTitle>
          <DialogDescription className="text-center font-semibold flex items-center justify-center gap-1 text-muted-foreground">
            Watch the magic happen <WandSparkles size={14} />
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <FileText size={55} />

          <div className="w-full space-y-2">
            <Label htmlFor="resume-upload">Select PDF</Label>
            <Input
              id="resume-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Files should be in PDF or Word format and must not exceed 10MB in
          size.
        </p>
        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="md:w-1/2 md:mx-auto
            w-full"
          >
            {uploading ? (
              <LoaderCircle className="animate-spin mr-2" size={18} />
            ) : (
              <Upload size={16} className="mr-1" />
            )}
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
