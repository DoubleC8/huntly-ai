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
import { LoaderCircle, Plus, SquarePen } from "lucide-react";

const formSchema = z.object({
  jobNote: z
    .string()
    .min(5, "Note must be atleast 5 characters long.")
    .max(1000)
    .optional(),
});

export default function NoteEditorBase({
  jobId,
  initialNote,
  compact,
  onNoteChange,
}: {
  jobId: string;
  initialNote: string | null;
  compact: boolean;
  onNoteChange?: (note: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(!initialNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobNote: initialNote ?? "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      await updateUserJobNote({
        jobNote: values.jobNote ?? "",
        jobId,
      });

      onNoteChange?.(values.jobNote ?? "");
      toast.success("Job Note saved!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to save job note.", {
        description: "Please try again later.",
      });
    } finally {
      setUploading(false);
      setEditMode(false);
    }
  }

  return !editMode ? (
    <div className="flex flex-col gap-3">
      <p>{initialNote}</p>
      <Button
        onClick={() => setEditMode(true)}
        className={compact ? "w-1/2 mx-auto" : "w-1/6 mx-auto"}
      >
        <div className="flex items-center gap-2">
          <SquarePen />
          <p>Edit Note</p>
        </div>
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
              <FormDescription className="text-center">
                Use this space to track key information about the role.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center gap-3">
          <Button type="submit" className={compact ? "w-1/3" : "w-1/6"}>
            {uploading ? (
              <LoaderCircle className="animate-spin mr-1" />
            ) : (
              <Plus className="mr-1" />
            )}
            {uploading ? "Adding Note..." : "Add Note"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditMode(false)}
            className={compact ? "w-1/3" : "w-1/6"}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
