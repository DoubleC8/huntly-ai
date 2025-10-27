"use client";

import { Star, LoaderCircle } from "lucide-react";
import { Resume } from "@/app/generated/prisma";
import { useResumeMutations } from "@/lib/hooks/resumes/useResumeMutations";
import { resumeToasts } from "@/lib/utils/toast";

export default function MakeResumeDefaultButton({
  resume,
}: {
  resume: Resume;
}) {
  const mutation = useResumeMutations();

  const handleDefault = async () => {
    if (!resume) {
      return;
    }
    try {
      await mutation.mutateAsync({
        type: "toggleDefaultResume",
        resumeId: resume.id,
      });

      resumeToasts.resumeMadeDefault({ resumeTitle: resume.fileName });
    } catch {
      resumeToasts.error(
        `Failed to make ${
          resume.fileName.split(".")[0]
        } as your default resume.`
      );
    }
  };

  return (
    <button
      title={resume.isDefault ? "Default Resume" : "Make Default"}
      onClick={() => handleDefault()}
      disabled={resume.isDefault || mutation.isPending}
    >
      {mutation.isPending ? (
        <LoaderCircle
          className="animate-spin text-[var(--app-yellow)]"
          size={18}
        />
      ) : resume.isDefault ? (
        <Star fill="yellow" className="text-[var(--app-yellow)]" />
      ) : (
        <Star className="ease-in-out duration-200 hover:text-[var(--app-yellow)] hover:cursor-pointer" />
      )}
    </button>
  );
}
