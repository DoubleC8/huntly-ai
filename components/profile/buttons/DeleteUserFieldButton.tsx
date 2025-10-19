"use client";

import {
  DeleteUserField,
  FieldType,
} from "@/app/actions/profile/delete/deleteUserProfileEntry";
import { Button } from "@/components/ui/button";
import { formatEntry } from "@/lib/utils";
import { X, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteUserFieldButton({
  field,
  value,
  isBlack = false,
}: {
  field: FieldType;
  value: string;
  isBlack?: boolean;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await DeleteUserField(field, value);
      toast.success(`"${formatEntry(value)}" deleted!`);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update user profile entries.", {
        description: "Please try again later.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Button
      onClick={() => handleDelete()}
      disabled={deleting}
      className={
        isBlack
          ? "w-fit h-fit text-muted-foreground !p-0 bg-transparent shadow-none hover:bg-transparent hover:text-[var(--app-red)]"
          : "w-fit h-fit  !p-0 bg-transparent shadow-none hover:bg-transparent hover:text-[var(--app-red)]"
      }
    >
      {deleting ? <LoaderCircle className="animate-spin" /> : <X />}
    </Button>
  );
}
