"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Send, SquarePen } from "lucide-react";
import { toast } from "sonner";

interface JobTitleProps {
  resumeId: string;
  initialJobTitle: string | null;
}

export default function TargetJobTitle({
  resumeId,
  initialJobTitle,
}: JobTitleProps) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle ?? "");
  const [localJobTitle, setLocalJobTitle] = useState(initialJobTitle ?? "");
  const [editMode, setEditMode] = useState(!initialJobTitle);
  const [isPending, startTransition] = useTransition();
  const [lastSavedJobTitle, setLastSavedJobTitle] = useState(jobTitle);

  const handleSave = async () => {
    if (jobTitle === lastSavedJobTitle) {
      setEditMode(false); // just exit if no change
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/resumes/${resumeId}/target-title`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobTitle }),
        });

        if (!res.ok) {
          toast.error("Failed to update job title.", {
            description: "Please try again later",
          });
          return;
        }

        toast.success("Successfully updated job title!");
        setLastSavedJobTitle(jobTitle);
        setLocalJobTitle(jobTitle);
        setEditMode(false);
      } catch (error) {
        console.error("Failed to update job title:", error);
        toast.error("Failed to update job title.", {
          description: "Please try again later",
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {editMode ? (
        <Input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
          placeholder="Target Job Title..."
        />
      ) : (
        <p className="text-sm text-muted-foreground w-full p-2">
          {lastSavedJobTitle || "No job title set."}
        </p>
      )}

      {editMode ? (
        <Button onClick={handleSave} disabled={isPending} size="sm">
          {isPending ? (
            <LoaderCircle className="animate-spin w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      ) : (
        <Button onClick={() => setEditMode(true)} size="sm">
          <SquarePen className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
