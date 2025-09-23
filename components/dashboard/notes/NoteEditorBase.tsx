"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export interface NoteEditorBaseProps {
  jobId: string;
  initialNote: string | null;
  onFinish?: (updatedNote: string) => void;
  compact?: boolean; // if true, simplifies UI for modals
}

export default function NoteEditorBase({
  jobId,
  initialNote,
  onFinish,
  compact = false,
}: NoteEditorBaseProps) {
  const [note, setNote] = useState(initialNote ?? "");
  const [editMode, setEditMode] = useState(!initialNote);
  const [isPending, startTransition] = useTransition();
  const [lastSavedNote, setLastSavedNote] = useState(initialNote ?? "");

  const handleSave = () => {
    if (note.length > 1000) {
      toast.error("Note is too long", {
        description: "Notes must be under 1000 characters.",
      });
      return;
    }

    if (note === lastSavedNote) {
      setEditMode(false);
      onFinish?.(note);
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}/note`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 400 && data?.issues?.note?._errors.length > 0) {
            toast.error("Validation Error", {
              description: data.issues.note._errors[0],
            });
          } else {
            toast.error("Failed to update note.", {
              description: data?.error || "Please try again later",
            });
          }
          return;
        }

        toast.success("Note updated!");
        setLastSavedNote(note);
        setEditMode(false);
        onFinish?.(note);
      } catch (err) {
        toast.error("Failed to update note.");
      }
    });
  };

  if (editMode) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleSave}
          placeholder='e.g. "Follow up next week", "Tailor resume for a frontend role"...'
          rows={4}
          disabled={isPending}
        />
        <div
          className={cn(
            "text-xs text-right mt-1",
            note.length > 1000 ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {note.length} / 1000
        </div>
        <div className="flex gap-3 items-center justify-center">
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Note"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEditMode(false);
              onFinish?.(note);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {note ? (
        <>
          <p className="whitespace-pre-wrap border rounded-md p-3 text-sm bg-muted text-muted-foreground">
            {note}
          </p>
          <Button
            className={`${compact ? "w-full" : "md:w-1/4 w-1/2 mx-auto"}`}
            onClick={() => setEditMode(true)}
          >
            <SquarePen className="mr-2" />
            Edit Note
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground">
            This space is looking a little empty… Jot down application tips,
            follow-ups, or why this role stands out!
          </p>
          <Button
            className={`${compact ? "w-full" : "md:w-1/4 w-1/2 mx-auto"}`}
            onClick={() => setEditMode(true)}
          >
            Add Note
          </Button>
        </>
      )}
    </div>
  );
}
