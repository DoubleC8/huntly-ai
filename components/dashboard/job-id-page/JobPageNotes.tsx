import { NotebookPen } from "lucide-react";
import NoteEditorBase from "../notes/NoteEditorBase";

export default function JobPageNotes({
  jobId,
  initialNote,
}: {
  jobId: string;
  initialNote: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <NotebookPen className="text-[var(--app-blue)]" />
        <h1 className="font-bold text-2xl">Your Notes</h1>
      </div>

      <NoteEditorBase jobId={jobId} note={initialNote ?? ""} />
    </div>
  );
}
