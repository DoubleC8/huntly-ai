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
import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import { updateUserResumeJobTitle } from "@/app/actions/resume/update/updateUserResume";

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
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetJobTitle: resumeJobTitle ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      await updateUserResumeJobTitle({
        targetJobTitle: values.targetJobTitle ?? "",
        resumeId,
      });

      toast.success(`Target job title set to: ${values.targetJobTitle}!`);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update job title", {
        description: "Please try again later.",
      });
    } finally {
      setUploading(false);
      setIsEditing(false);
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
            <Button type="submit" disabled={uploading}>
              <Plus />
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
