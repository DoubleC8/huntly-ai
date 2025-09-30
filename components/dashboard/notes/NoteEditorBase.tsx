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
  onNoteChange,
}: {
  jobId: string;
  initialNote: string;
  compact: boolean;
  onNoteChange?: (note: string) => void;
}) {
  const [editMode, setEditMode] = useState(!initialNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobNote: initialNote },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUserJobNote({
        jobNote: values.jobNote ?? "",
        jobId,
      });

      onNoteChange?.(values.jobNote ?? ""); // 🔑 update parent immediately
      toast.success("Job Note saved!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to save job note.", {
        description: "Please try again later.",
      });
    } finally {
      setEditMode(false);
    }
  }

  return !editMode ? (
    <div className="flex flex-col gap-2">
      <p className="whitespace-pre-line">
        {initialNote || "No note yet. Click edit to add one."}
      </p>
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={() => setEditMode(true)}
      >
        {initialNote ? "Edit Note" : "Add Note"}
      </Button>
    </div>
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
                  placeholder="E.G. 'Interview next week'..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Capture your thoughts on the job.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
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
  );
}
