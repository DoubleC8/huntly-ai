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
import { Education } from "@/app/generated/prisma";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteUserEducation } from "@/app/actions/profile/delete/deleteUserProfileEntry";

export default function DeleteEducationEntry({
  education,
}: {
  education: Education;
}) {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await DeleteUserEducation(education.id);
      toast.success("Education entry deleted successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update education.", {
        description: "Please try again later.",
      });
    } finally {
      setDeleting(false);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="ease-in-out duration-200 hover:text-[var(--app-red)] hover:cursor-pointer" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-center">
            Are you sure you want to delete this entry?
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
