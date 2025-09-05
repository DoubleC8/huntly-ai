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
  setResumes,
}: {
  resume: Resume;
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>;
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

    const res = await fetch(`/api/resumes/${resume.id}`, {
      method: "DELETE",
      body: JSON.stringify({ filePath }),
    });

    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r.id !== resume.id));
      setOpen(false);
      toast.success("Resume successfully deleted.");
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
            Are you sure you want to delete this resume?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <FileX2 size={55} />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          This action cannot be undone.
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
