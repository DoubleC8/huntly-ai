"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import { SquarePen } from "lucide-react";

const formSchema = z.object({
  name_1246341246: z.string().min(1).optional(),
  name_8524351057: z.string().min(1).optional(),
  name_5606332286: z.string().min(1).optional(),
  name_7727238488: z.string().min(1).optional(),
  name_7815295068: z.string().min(1).optional(),
});

export default function UserInfoSideBar() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_1246341246: "",
      name_8524351057: "",
      name_5606332286: "",
      name_7727238488: "",
      name_7815295068: "",
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
    <Sheet>
      <SheetTrigger>
        <SquarePen className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]" />
      </SheetTrigger>
      <SheetContent className="rounded-tl-4xl">
        <SheetHeader>
          <SheetTitle>Personal Info</SheetTitle>
          <SheetDescription>
            Update your personal information and social media links.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <FormField
              control={form.control}
              name="name_1246341246"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_8524351057"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_5606332286"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_7727238488"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_7815295068"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
