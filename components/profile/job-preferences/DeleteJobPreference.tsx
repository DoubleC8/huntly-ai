"use client";

import { DeleteUserJobPreference } from "@/app/actions/profile/delete/deleteUserJobPreference";
import { Button } from "@/components/ui/button";
import { formatEntry } from "@/lib/utils";
import { X, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteJobPrefence({
  preference,
}: {
  preference: string;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await DeleteUserJobPreference(preference);
      toast.success(`"${formatEntry(preference)}" deleted!`);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update skills.", {
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
      className="w-fit h-fit !p-0 bg-transparent shadow-none hover:bg-transparent hover:text-[var(--app-red)]"
    >
      {deleting ? <LoaderCircle className="animate-spin" /> : <X />}
    </Button>
  );
}
