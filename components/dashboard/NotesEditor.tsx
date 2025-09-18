"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NoteEditorBase from "./notes/NoteEditorBase";

interface NotesEditorProps {
  jobId: string;
  initialNote: string | null;
}

export default function NotesButton({ jobId, initialNote }: NotesEditorProps) {
  const [currentNote, setCurrentNote] = useState(initialNote ?? "");

  const hasNote = currentNote.trim() !== "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={hasNote ? "noted" : "secondary"} className="w-full">
          {hasNote ? "View Notes" : "Add Note"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{hasNote ? "Your Note" : "Add a Note"}</DialogTitle>
          <DialogDescription>
            {hasNote
              ? "You can update your note about this job anytime."
              : "Jot down ideas, next steps, or reminders about this job. Notes are private and saved instantly."}
          </DialogDescription>
        </DialogHeader>

        <NoteEditorBase
          jobId={jobId}
          initialNote={currentNote}
          onFinish={(updatedNote) => setCurrentNote(updatedNote)}
          compact
        />
      </DialogContent>
    </Dialog>
  );
}
