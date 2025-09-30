import NoteEditorBase from "./notes/NoteEditorBase";

export default function JobPageNotes({
  jobId,
  initialNote,
}: {
  jobId: string;
  initialNote: string | null;
}) {
  return (
    <NoteEditorBase jobId={jobId} note={initialNote ?? ""} compact={false} />
  );
}
