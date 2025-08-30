"use client";

import { FileX2, LoaderCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Resume } from "@/app/generated/prisma";
import { toast } from "sonner";

export default function DeleteResumeButton({
  resume,
  refresh,
}: {
  resume: Resume;
  refresh?: () => void;
}) {
  const { id, publicUrl } = resume;
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!resume) {
      return;
    }

    setDeleting(true);

    const filePath = publicUrl.split("/resumes/")[1];

    const response = await fetch("/api/resume/delete", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        filePath,
      }),
    });

    if (response.ok) {
      setOpen(false);
      toast.success("Resume successfully deleted.");
      refresh?.();
    } else {
      toast.error("Unable to delete resume.", {
        description: "Please try again later.",
      });
      console.error("Failed to delete resume.");
    }

    setDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-red)] hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Upload Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <FileX2 size={55} />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Files should be in PDF or Word format and must not exceed 10MB in
          size.
        </p>
        <DialogFooter>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="md:w-1/2 md:mx-auto
            w-full"
            variant={"destructive"}
          >
            {deleting ? (
              <LoaderCircle className="animate-spin mr-2" size={18} />
            ) : (
              ""
            )}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
