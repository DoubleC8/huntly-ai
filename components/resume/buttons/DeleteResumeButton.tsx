"use client";

import { HeartCrack, LoaderCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Resume } from "@/app/generated/prisma";
import { toast } from "sonner";
import { deleteUserResume } from "@/app/actions/resume/delete/deleteUserResume";
import { Button } from "@/components/ui/button";

export default function DeleteResumeButton({ resume }: { resume: Resume }) {
  const { id, publicUrl } = resume;
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!resume) {
      return;
    }
    setDeleting(true);

    try {
      const filePath = publicUrl.split("/resumes/")[1];
      await deleteUserResume(id, filePath);
      toast.success("Resume deleted!");
    } catch (err) {
      toast.error("Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-red)] hover:cursor-pointer" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-center">
            Are you sure you want to Delete this resume?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <HeartCrack size={55} className="text-[var(--app-red)]" />
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
