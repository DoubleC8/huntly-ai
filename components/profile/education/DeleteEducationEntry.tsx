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

import { Button } from "@/components/ui/button";

import { profileToasts } from "@/lib/utils/toast";
import { useProfileMutations } from "@/lib/hooks/profile/useProfileMutations";

export default function DeleteEducationEntry({
  education,
}: {
  education: Education;
}) {
  const mutation = useProfileMutations();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      mutation.mutateAsync({
        type: "deleteField",
        field: "education",
        value: education.id,
      });

      profileToasts.deletedEducation();
    } catch (error) {
      console.error("Form submission error", error);
      profileToasts.error("Failed to update education.");
    } finally {
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
            disabled={mutation.isPending}
            className="md:w-1/2 md:mx-auto
            w-full"
            variant={"destructive"}
          >
            {mutation.isPending ? (
              <LoaderCircle className="animate-spin mr-2" size={18} />
            ) : (
              ""
            )}
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
