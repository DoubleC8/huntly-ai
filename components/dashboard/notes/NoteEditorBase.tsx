"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { updateUserJobNote } from "@/app/actions/job-post/updateJob";

const formSchema = z.object({
  jobNote: z.string().max(1000).optional(),
});

export default function NoteEditorBase({
  jobId,
  initialNote,
  compact,
}: {
  jobId: string;
  initialNote: string;
  compact: boolean;
}) {
  const [note, setNote] = useState(initialNote ?? "");
  const [editMode, setEditMode] = useState(!initialNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobNote: note },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUserJobNote({
        jobNote: values.jobNote ?? "",
        jobId,
      });
      setNote(values.jobNote ?? "");
      toast.success("Job Note updated successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update job note.", {
        description: "Please try again later.",
      });
    } finally {
      setEditMode(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {!editMode ? (
        <>
          {note ? (
            <p className="whitespace-pre-line">{note}</p>
          ) : (
            <p className="text-muted-foreground italic">No note yet.</p>
          )}
          <Button
            variant="outline"
            size={compact ? "sm" : "default"}
            onClick={() => setEditMode(true)}
          >
            {note ? "Edit Note" : "Add Note"}
          </Button>
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="jobNote"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="E.G. 'Interview next week', 'Tailor Resume to better fit this position', etc.."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Capture your thoughts on the job: key responsibilities,
                    relevant skills, and specific aspects that interest you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit">Save Note</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
