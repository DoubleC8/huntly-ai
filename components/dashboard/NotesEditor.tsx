"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NotesEditorProps {
  jobId: string;
  initialNote: string | null;
}

export default function NotesEditor({ jobId, initialNote }: NotesEditorProps) {
  const [note, setNote] = useState(initialNote ?? "");
  const [isPending, startTransition] = useTransition();
  //if no note default to edit mode else, default to view mode
  const [editMode, setEditMode] = useState(!initialNote);

  //handles the adding/updating of the note
  const handleSave = async () => {
    startTransition(async () => {
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

        toast.success("Note updated successfully!");
      } catch (error) {
        console.error("Failed to update note:", error);
        toast.error("Failed to update note.", {
          description: "Please try again later",
        });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          {initialNote && initialNote.trim() !== "" ? "View Notes" : "Add Note"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialNote && initialNote.trim() !== ""
              ? "Your Note"
              : "Add a Note"}
          </DialogTitle>
          <DialogDescription>
            {initialNote && initialNote.trim() !== ""
              ? "You can update your note about this job anytime."
              : "Jot down ideas, next steps, or reminders about this job. Notes are private and saved instantly."}
          </DialogDescription>
        </DialogHeader>

        {editMode ? (
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='E.g. "Reach out to recruiter next week", "Tailor resume for a front end role"...'
            rows={4}
            disabled={isPending}
          />
        ) : (
          <div className="min-h-[100px] whitespace-pre-wrap border rounded-md p-3 text-sm bg-muted text-muted-foreground">
            {note?.trim() || "No note added yet."}
          </div>
        )}

        <DialogFooter className="mx-auto mt-4">
          {editMode ? (
            <>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save Note"}
              </Button>
              <DialogClose asChild>
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
            </>
          ) : (
            <>
              <Button onClick={() => setEditMode(!editMode)}>Edit Note</Button>
              <DialogClose asChild>
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
