"use client";

import { useState } from "react";
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
import { Label } from "../../ui/label";
import {
  FileText,
  LoaderCircle,
  Plus,
  Upload,
  WandSparkles,
} from "lucide-react";
import { toast } from "sonner";
import { resumeFileSchema } from "@/lib/validations/resume";
import { useResumeMutations } from "@/lib/hooks/resumes/useResumeMutations";
import { resumeToasts } from "@/lib/utils/toast";
import { RESUME_LIMIT } from "../ResumeNavbar";
import { uploadResume } from "@/app/actions/resume/upload/uploadResume";

export default function AddResumeButton({
  resumeCount,
  email,
}: {
  resumeCount: number;
  email: string;
}) {
  const mutation = useResumeMutations();
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleUpload = async () => {
    // Validation
    if (!file || !email) return;

    const validation = resumeFileSchema.safeParse(file);
    if (!validation.success) {
      resumeToasts.error(
        validation.error.issues[0]?.message || "File is not valid."
      );
      return;
    }

    if (resumeCount >= RESUME_LIMIT) {
      resumeToasts.error(`You can only upload up to ${RESUME_LIMIT} resumes.`);
      return;
    }

    try {
      // Upload to Supabase via server action
      const fileExt = file.name.split(".").pop()!;
      const filePath = `${email}/resume-${Date.now()}.${fileExt}`;

      // Call server action to upload the file
      const { publicUrl } = await uploadResume(file, filePath);

      // Save to database using mutation
      await mutation.mutateAsync({
        type: "updateResume",
        resumeUrl: publicUrl,
        filename: file.name,
      });

      // Cleanup and close
      setFile(null);
      resumeToasts.resumeAdded({ resumeTitle: file.name });
    } catch (error) {
      console.error("Upload error:", error);
      resumeToasts.error(
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setTimeout(() => setOpen(false), 1000);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (resumeCount >= RESUME_LIMIT && val) {
          toast.error("Upload limit reached", {
            description: `You can only upload up to ${RESUME_LIMIT} resumes.`,
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
          disabled={resumeCount >= RESUME_LIMIT}
        >
          <span className="hidden md:block">Add Resume</span>
          <Plus size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="md:min-w-1/2 sm:max-w-md rounded-xl shadow-md flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle className="font-semibold text-center">
            Upload your Resume
          </DialogTitle>
          <DialogDescription className="text-center flex items-center justify-center gap-1 text-muted-foreground">
            Watch the magic happen <WandSparkles size={14} />
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <FileText size={55} className="text-[var(--app-blue)]" />
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
            disabled={!file || mutation.isPending}
            className="md:w-1/2 md:mx-auto w-full"
          >
            {mutation.isPending ? (
              <LoaderCircle className="animate-spin mr-1" />
            ) : (
              <Upload className="mr-1" />
            )}
            {mutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
