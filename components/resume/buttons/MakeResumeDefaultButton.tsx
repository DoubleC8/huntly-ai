"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Resume } from "@/app/generated/prisma";
import { toast } from "sonner";
import { makeResumeDefault } from "@/app/actions/resume/update/updateUserResume";

export default function MakeResumeDefaultButton({
  resume,
}: {
  resume: Resume;
}) {
  const handleDefault = async () => {
    if (!resume) {
      return;
    }

    try {
      await makeResumeDefault(resume.id);
      toast.success(`${resume.fileName.split(".")[0]} set as Default Resume.`, {
        description: "This resume will be used to get your match score.",
      });
    } catch (err) {
      toast.error(
        `Failed to make ${
          resume.fileName.split(".")[0]
        } as your default resume.`,
        {
          description: "Please try again later.",
        }
      );
    }
  };

  return (
    <button
      title={resume.isDefault ? "Remove as Default" : "Make Default"}
      onClick={() => handleDefault()}
      disabled={resume.isDefault}
    >
      {resume.isDefault ? (
        <Star fill="yellow" className="text-[var(--app-yellow)]" />
      ) : (
        <Star className="ease-in-out duration-200 hover:text-[var(--app-yellow)] hover:cursor-pointer" />
      )}
    </button>
  );
}
