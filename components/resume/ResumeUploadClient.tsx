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
import { resumeFileSchema } from "@/lib/validations/resume";

export default function ResumeUploadClient({
  email,
  resumeCount,
  onUploadSuccess,
}: {
  email: string;
  resumeCount: number;
  onUploadSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleUpload = async () => {
    if (!file || !email) return;

    const result = resumeFileSchema.safeParse(file);
    if (!result.success) {
      toast.error("Invalid File", {
        description: result.error.issues[0]?.message || "File is not valid.",
      });
      return;
    }

    if (resumeCount >= 5) {
      toast.error("Upload limit reached", {
        description: "You can only upload up to 5 resumes.",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${email}/resume-${Date.now()}.${fileExt}`;
      const supabase = createClient();

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

      const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;

      if (!publicUrl) {
        console.error("No public URL found.");
        toast.error("URL generation failed");
        return;
      }

      setResumeUrl(publicUrl);

      const res = await fetch("/api/resumes", {
        method: "POST",
        body: JSON.stringify({ resumeUrl: publicUrl, fileName: file.name }),
      });

      if (!res.ok) {
        console.error("Failed to save resume metadata:", await res.text());
        toast.error("Upload succeeded but saving failed.");
        return;
      }

      toast.success("Resume uploaded.", {
        description: "Sit back and watch the magic happen.",
      });

      setOpen(false);
      setFile(null);
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
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (resumeCount >= 5 && val) {
          toast.error("Upload limit reached", {
            description: "You can only upload up to 5 resumes.",
          });
          return;
        }
        setOpen(val);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-2"
          disabled={resumeCount >= 5}
        >
          <span
            className="md:block
          hidden"
          >
            Add Resume
          </span>{" "}
          <Plus size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="md:min-w-1/2 sm:max-w-md rounded-xl shadow-lg flex flex-col justify-between">
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
          Files should be in PDF format and must not exceed 10MB in size.
        </p>
        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="md:w-1/2 md:mx-auto w-full"
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
