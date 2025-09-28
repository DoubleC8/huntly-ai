"use client";
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
import { updateUserSkills } from "@/app/actions/updateUserSkills";
import { updateUserJobPreference } from "@/app/actions/updateUserJobPreferences";

const formSchema = z.object({
  jobPreferences: z
    .array(z.string())
    .min(1, {
      error: "Please enter at least one entry.",
    })
    .optional(),
});

export default function UserJobPreferencesSidebar() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPreferences: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      await updateUserJobPreference(values.jobPreferences ?? []);
      toast.success("Job preferences added successfully!", {
        description: `${
          values.jobPreferences?.length ?? 0
        } job preferences added to your profile.`,
      });

      form.reset({ jobPreferences: [] });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update job preferences.", {
        description: "Please try again later.",
      });
    } finally {
      setUploading(false);
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
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <LoaderCircle className="animate-spin mr-1" />
                  ) : (
                    <Plus className="mr-1" />
                  )}
                  {uploading
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
