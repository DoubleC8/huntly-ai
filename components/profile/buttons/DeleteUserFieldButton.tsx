"use client";

import { FieldType } from "@/app/actions/profile/delete/deleteUserProfileEntry";
import { Button } from "@/components/ui/button";
import { useProfileMutations } from "@/lib/hooks/profile/useProfileMutations";

import { profileToasts } from "@/lib/utils/toast";
import { X, LoaderCircle } from "lucide-react";

export default function DeleteUserFieldButton({
  field,
  value,
  isBlack = false,
}: {
  field: FieldType;
  value: string;
  isBlack?: boolean;
}) {
  const mutation = useProfileMutations();
  async function handleDelete() {
    try {
      await mutation.mutateAsync({
        type: "deleteField",
        field: field,
        value: value,
      });

      profileToasts.deletedField({ field: value, fieldType: field as Exclude<FieldType, "email"> });
    } catch (error) {
      console.error("Form submission error", error);
      profileToasts.error("Failed to update user profile entries.");
    }
  }

  return (
    <Button
      onClick={() => handleDelete()}
      disabled={mutation.isPending}
      className={
        isBlack
          ? "w-fit h-fit text-muted-foreground !p-0 bg-transparent shadow-none hover:bg-transparent hover:text-[var(--app-red)]"
          : "w-fit h-fit  !p-0 bg-transparent shadow-none hover:bg-transparent hover:text-[var(--app-red)]"
      }
    >
      {mutation.isPending ? <LoaderCircle className="animate-spin" /> : <X />}
    </Button>
  );
}
