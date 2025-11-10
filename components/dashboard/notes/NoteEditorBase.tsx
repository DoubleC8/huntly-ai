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
import { LoaderCircle, Plus, SquarePen } from "lucide-react";
import { useUpdateJobStage } from "@/lib/hooks/jobs/useUpdateJobStage";

const formSchema = z.object({
  jobNote: z
    .string()
    .min(5, "Error: Note must be atleast 5 characters long.")
    .max(1000, "Error: Note must be under 1000 characters long.")
    .optional(),
});

export default function NoteEditorBase({
  jobId,
  note,
  onNoteChange,
}: {
  jobId: string;
  note: string;
  onNoteChange?: (note: string) => void;
}) {
  const [editMode, setEditMode] = useState(!note);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobNote: note },
    values: { jobNote: note },
  });

  const mutation = useUpdateJobStage();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      await mutation.mutateAsync({
        type: "setNote",
        jobId,
        note: values.jobNote ?? "",
      });

      // Call the optional callback if provided
      onNoteChange?.(values.jobNote ?? "");

      toast.success("Job Note saved!");
      setEditMode(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to save job note.", {
        description: "Please try again later.",
      });
    } finally {
      setUploading(false);
    }
  }

  return !editMode ? (
    <div className="w-full flex flex-col gap-3">
      <p>{form.watch("jobNote") || "No note yet"}</p>

      <Button
        onClick={() => setEditMode(true)}
        className="md:w-1/4
      w-full mx-auto"
      >
        <SquarePen />
        <p>Edit Note</p>
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
              <div className="flex items-center justify-between">
                <FormDescription>
                  Use this space to track key information about the role.
                </FormDescription>
                <p
                  className={
                    (form.watch("jobNote")?.length ?? 0) > 1000
                      ? "text-[var(--app-red)] text-sm"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {form.watch("jobNote")?.length ?? 0}/1000
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div
          className="md:w-1/2 md:mx-auto
        w-full grid grid-cols-2 gap-3"
        >
          <Button type="submit" disabled={uploading || mutation.isPending}>
            {uploading || mutation.isPending ? (
              <LoaderCircle className="animate-spin mr-1" />
            ) : (
              <Plus className="mr-1" />
            )}
            {uploading || mutation.isPending
              ? "Saving..."
              : note
                ? "Update Note"
                : "Add Note"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
