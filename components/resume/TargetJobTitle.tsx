"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import { useResumeMutations } from "@/lib/hooks/resumes/useResumeMutations";
import { jobToasts, resumeToasts } from "@/lib/utils/toast";

const formSchema = z.object({
  targetJobTitle: z.string().trim().max(50).optional(),
});

export default function TargetJobTitle({
  resumeJobTitle,
  resumeId,
}: {
  resumeJobTitle: string;
  resumeId: string;
}) {
  const mutation = useResumeMutations();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetJobTitle: resumeJobTitle ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutation.mutateAsync({
        type: "setResumeJobTitle",
        targetJobTitle: values.targetJobTitle ?? "",
        resumeId: resumeId,
      });
      resumeToasts.resumeUpdatedJobTitle({
        resumeTitle: values.targetJobTitle ?? "",
      });
      setIsEditing(false); // Close form only after success
    } catch (error) {
      console.error("Form submission error", error);
      jobToasts.error(
        error instanceof Error ? error.message : "Please try again."
      );
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-center justify-between gap-2"
          >
            <FormField
              control={form.control}
              name="targetJobTitle"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Enter Job Title"
                      type="text"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Plus />
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="flex items-center justify-between min-w-full">
          <p>{resumeJobTitle || "No Job Title Set"}</p>
          <SquarePen
            className="cursor-pointer ease-in-out duration-200 hover:text-[var(--app-blue)]"
            onClick={() => setIsEditing(true)}
          />
        </div>
      )}
    </div>
  );
}
