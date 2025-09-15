"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Send, SquarePen, Upload } from "lucide-react";
import { toast } from "sonner";

interface JobTitleProps {
  resumeId: string;
  initialJobTitle: string | null;
}

export default function TargetJobTitle({
  resumeId,
  initialJobTitle,
}: JobTitleProps) {
  const [targetJobTitle, setTargetJobTitle] = useState(initialJobTitle ?? "");
  const [localTargetJobTitle, setLocalTargetJobTitle] = useState(
    initialJobTitle ?? ""
  );
  const [editMode, setEditMode] = useState(!initialJobTitle);
  const [isPending, startTransition] = useTransition();
  const [lastSavedTargetJobTitle, setLastSavedTargetJobTitle] =
    useState(targetJobTitle);

  const handleSave = async () => {
    if (targetJobTitle === lastSavedTargetJobTitle) {
      setEditMode(false);
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/resumes/${resumeId}/target-title`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetJobTitle }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (
            res.status === 400 &&
            data?.issues?.targetJobTitle?._errors?.length > 0
          ) {
            toast.error("Validation Error", {
              description: data.issues.targetJobTitle._errors[0],
            });
          } else {
            toast.error("Failed to update job title.", {
              description: data?.error || "Please try again later",
            });
          }
          return;
        }

        toast.success("Successfully updated job title!");
        setLastSavedTargetJobTitle(targetJobTitle);
        setLocalTargetJobTitle(targetJobTitle);
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
    <div className="flex items-center gap-2 min-w-9/10 w-9/10 max-w-9/10">
      {editMode ? (
        <Input
          value={targetJobTitle}
          onChange={(e) => setTargetJobTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
          placeholder="Target Job Title..."
          className="w-full"
        />
      ) : (
        <p className="text-sm text-muted-foreground w-full p-2">
          {lastSavedTargetJobTitle || "No job title set."}
        </p>
      )}

      {editMode ? (
        <Button onClick={handleSave} disabled={isPending} size="sm">
          {isPending ? (
            <LoaderCircle className="animate-spin w-4 h-4" />
          ) : (
            <Upload className="w-4 h-4" />
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
