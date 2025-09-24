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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoaderCircle, Plus, SquarePen } from "lucide-react";
import { User } from "@/app/generated/prisma";
import { updateUserPersonalInfo } from "@/app/actions/updateUserInfo";
import { useState } from "react";

const formSchema = z.object({
  githubUrl: z
    .url("Must Be valid URL")
    .max(150, "GitHub URL must be under 150 characters")
    .optional(),
  linkedInUrl: z
    .url("Must Be valid URL")
    .max(150, "LinkedIn URL must be under 150 characters")
    .optional(),
  portfolioUrl: z
    .url("Must Be valid URL")
    .max(150, "Portfolio URL must be under 150 characters")
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Invalid phone number format")
    .max(20, "Phone number too long")
    .optional(),
  city: z.string().max(50, "City name must be under 50 characters").optional(),
});

export default function UserInfoSideBar({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubUrl: user.githubUrl ?? "",
      linkedInUrl: user.linkedInUrl ?? "",
      portfolioUrl: user.portfolioUrl ?? "",
      phoneNumber: user.phoneNumber ?? "",
      city: user.city ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      await updateUserPersonalInfo(values);
      console.log(values);
      toast.success("Information updated successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update information.", {
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
        <SquarePen className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]" />
      </SheetTrigger>
      <SheetContent className="rounded-tl-4xl !min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Personal Info</SheetTitle>
          <SheetDescription>
            Update your personal information and social media links.
          </SheetDescription>
        </SheetHeader>
        <SheetDescription asChild>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-[95%] mx-auto flex flex-col gap-3"
            >
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Github Url..."
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add your GitHub URL for quick access when applications
                      request it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedInUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your LinkedIn Url..."
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide your LinkedIn profile link to share it with
                      recruiters and to network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Portfolio Url..."
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your personal site or portfolio to have quick access
                      to it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Phone Number..."
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is will remain private and not public.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the City you Live in..."
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The city you live in, used for tailoring job opportunities
                      near you.
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
                  {uploading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
