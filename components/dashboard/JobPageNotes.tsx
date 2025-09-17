"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";

interface NotesEditorProps {
  jobId: string;
  initialNote: string | null;
}

export default function JobPageNotes({ jobId, initialNote }: NotesEditorProps) {
  const [note, setNote] = useState(initialNote ?? "");
  const [localInitialNote, setLocalInitialNote] = useState(initialNote ?? "");
  const [editMode, setEditMode] = useState(!initialNote);
  const [isPending, startTransition] = useTransition();
  const [lastSavedNote, setLastSavedNote] = useState(note);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      if (!res.ok) {
        toast.error("Failed to update note.", {
          description: "Please try again later",
        });
        console.error("Failed to update note");
      }

      toast.success("Succesfully added note!");
      setEditMode(false);
      setLastSavedNote(note);
      setLocalInitialNote(note);
    } catch (error) {
      console.error("Failed to update note:", error);
      toast.error("Failed to update note.", {
        description: "Please try again later",
      });
    }
  };
  return editMode ? (
    <div className="flex flex-col gap-3 w-full">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleSave}
        placeholder='E.g. "Reach out to recruiter next week", "Tailor resume for a front end role"...'
        rows={4}
        disabled={isPending}
      />
      <div className="flex gap-3 items-center justify-center">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Note"}
        </Button>
        <Button variant="outline" onClick={() => setEditMode(!editMode)}>
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {note ? (
        <>
          <p className="whitespace-pre-wrap">{note}</p>
          <Button
            className="md:w-1/4 w-1/2 mx-auto"
            onClick={() => setEditMode(true)}
          >
            <SquarePen />
            Edit Note
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground">
            This space is looking a little empty... Keep track of interview
            tips, application dates, or reasons you’re excited about this job
          </p>
          <Button
            className="md:w-1/4 
        w-1/2 mx-auto"
            onClick={() => setEditMode(!editMode)}
          >
            Add Note
          </Button>
        </>
      )}
    </div>
  );
}
