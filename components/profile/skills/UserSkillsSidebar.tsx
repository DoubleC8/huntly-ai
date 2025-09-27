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

const formSchema = z.object({
  skills: z
    .array(z.string())
    .min(1, {
      error: "Please select at least one item",
    })
    .optional(),
});

export default function UserSkillsSidebar() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <SquarePlus className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]" />
      </SheetTrigger>
      <SheetContent className="rounded-tl-4xl w-[400px] md:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Skills</SheetTitle>
          <SheetDescription>
            Update your personal skills to help tailor jobs according to your
            current skills.
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
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your skills.</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value ?? []}
                        onValueChange={field.onChange}
                        placeholder="Enter your tags"
                      />
                    </FormControl>
                    <FormDescription>
                      Add skills as tags to highlight your technical and
                      professional expertise.
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
                  {uploading ? "Adding skills..." : "Add Skills"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
