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
import { SquarePen } from "lucide-react";

interface NotesEditorProps {
  jobId: string;
  initialNote: string | null;
}

export default function NotesEditor({ jobId, initialNote }: NotesEditorProps) {
  const [note, setNote] = useState(initialNote ?? "");
  const [localInitialNote, setLocalInitialNote] = useState(initialNote ?? "");
  //if no note default to edit mode else, default to view mode
  const [editMode, setEditMode] = useState(!initialNote);
  const [isPending, startTransition] = useTransition();
  const [lastSavedNote, setLastSavedNote] = useState(note);
  const [open, setOpen] = useState(false);

  //handles the adding/updating of the note
  const handleSave = async () => {
    //dont save is nothing was changed
    if (note === lastSavedNote) {
      return;
    }
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
        setEditMode(false);
        setLastSavedNote(note);
        setLocalInitialNote(note);
        setOpen(false);
      } catch (error) {
        console.error("Failed to update note:", error);
        toast.error("Failed to update note.", {
          description: "Please try again later",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        <Button
          variant={
            localInitialNote && localInitialNote.trim() !== ""
              ? "noted"
              : "secondary"
          }
        >
          {localInitialNote && localInitialNote.trim() !== ""
            ? "View Notes"
            : "Add Note"}
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
            onBlur={handleSave}
            placeholder='E.g. "Reach out to recruiter next week", "Tailor resume for a front end role"...'
            rows={4}
            disabled={isPending}
          />
        ) : (
          <div className="min-h-[100px] whitespace-pre-wrap border rounded-md p-3 text-sm bg-muted text-muted-foreground">
            {note?.trim() || "No note added yet."}
          </div>
        )}

        <DialogFooter className="mx-auto w-full">
          {editMode ? (
            <div className="flex flex-col gap-3 w-full">
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save Note"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <Button onClick={() => setEditMode(true)}>
                <SquarePen />
                Edit Note
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
