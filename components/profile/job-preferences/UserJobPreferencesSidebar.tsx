"use client";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoaderCircle, Plus, SquarePlus } from "lucide-react";
import { useState } from "react";
import { TagsInput } from "@/components/ui/TagsInput";
import { useProfileMutations } from "@/lib/hooks/profile/useProfileMutations";
import { profileToasts } from "@/lib/utils/toast";

const formSchema = z.object({
  jobPreferences: z
    .array(z.string())
    .min(1, {
      error: "Please enter at least one entry.",
    })
    .optional(),
});

export default function UserJobPreferencesSidebar() {
  const mutation = useProfileMutations();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPreferences: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutation.mutateAsync({
        type: "updateFields",
        field: "jobPreferences",
        value: values.jobPreferences,
      });

      profileToasts.addedFields({ fields: values.jobPreferences ?? [] });
      form.reset({ jobPreferences: [] });
    } catch (error) {
      console.error("Form submission error", error);
      profileToasts.error("Failed to update job preferences.");
    } finally {
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <SquarePlus className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]" />
      </SheetTrigger>
      <SheetContent className="rounded-tl-4xl w-[400px] md:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Job Preferences</SheetTitle>
          <SheetDescription>
            Update your job preferences and let Huntly Ai find jobs based on
            these preferences.
          </SheetDescription>
        </SheetHeader>
        <SheetDescription asChild>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-[95%] flex flex-col gap-3 mx-auto"
            >
              <FormField
                control={form.control}
                name="jobPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your Job Preferences.</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value ?? []}
                        onValueChange={field.onChange}
                        placeholder="Enter your job preferences"
                      />
                    </FormControl>
                    <FormDescription>
                      Add job preferences to improve your Huntly Ai experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <LoaderCircle className="animate-spin mr-1" />
                  ) : (
                    <Plus className="mr-1" />
                  )}
                  {mutation.isPending
                    ? "Adding Job Preferences..."
                    : "Add Job Preferences"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
