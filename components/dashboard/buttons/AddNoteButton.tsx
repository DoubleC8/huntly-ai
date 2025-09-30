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
import NoteEditorBase from "../notes/NoteEditorBase";

interface NotesEditorProps {
  jobId: string;
  initialNote: string | null;
}

export default function AddNoteButton({
  jobId,
  initialNote,
}: NotesEditorProps) {
  const [currentNote, setCurrentNote] = useState(initialNote ?? "");

  const hasNote = currentNote.trim() !== "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={hasNote ? "noted" : "secondary"}>
          {hasNote ? "View Job Note" : "Add a Job Note"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{hasNote ? "Your Note" : "Add a Note"}</DialogTitle>
          <DialogDescription>
            {hasNote
              ? "You can update your note about this job anytime."
              : "Notes are private and saved instantly."}
          </DialogDescription>
        </DialogHeader>

        <NoteEditorBase
          jobId={jobId}
          note={currentNote}
          compact={true}
          onNoteChange={setCurrentNote}
        />
      </DialogContent>
    </Dialog>
  );
}
