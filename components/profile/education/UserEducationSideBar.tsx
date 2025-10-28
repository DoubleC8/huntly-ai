"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  LoaderCircle,
  PenSquare,
  Plus,
  SquarePlus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Education } from "@/app/generated/prisma";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "@/components/ui/sheet";
import { useProfileMutations } from "@/lib/hooks/profile/useProfileMutations";
import { profileToasts } from "@/lib/utils/toast";

const formSchema = z
  .object({
    school: z.string().min(1, "School name is required").max(150),
    major: z.string().max(150).optional(),
    degree: z.string().min(1, "Degree is required").max(150),
    gpa: z.string().max(10).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    onGoing: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.onGoing) return true;
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "End Date must be after Start Date.",
      path: ["endDate"],
    }
  );

export default function UserEducationSidebar({
  education,
}: {
  education?: Education;
}) {
  const mutation = useProfileMutations();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: education
      ? {
          school: education.school,
          major: education.major ?? "",
          degree: education.degree,
          gpa: education.gpa ?? "",
          startDate: education.startDate
            ? new Date(education.startDate)
            : undefined,
          endDate: education.endDate ? new Date(education.endDate) : undefined,
          onGoing: education.onGoing ?? false,
        }
      : {
          school: "",
          major: "",
          degree: "",
          gpa: "",
          startDate: undefined,
          endDate: undefined,
          onGoing: false,
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (education) {
        await mutation.mutateAsync({
          type: "updateEducation",
          ...values,
        });

        profileToasts.updateEducation();
      } else {
        await mutation.mutateAsync({
          type: "updateEducation",
          ...values,
        });
        profileToasts.addedEducation();
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error", error);
      profileToasts.error("Failed to update education.");
    } finally {
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        {education ? (
          <PenSquare className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]" />
        ) : (
          <SquarePlus className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]" />
        )}
      </SheetTrigger>
      <SheetContent className="rounded-tl-4xl w-[400px] md:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Education</SheetTitle>
          <SheetDescription>
            Update your education sections by adding your education history.
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
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your School Name"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** major, degree type, gpa */}
              <div
                className="md:gap-4
              grid gap-2"
              >
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Major..."
                            type=""
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Degree Type (B.S., A.S,)..."
                            type=""
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter GPA..."
                            type=""
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/**start date and end date */}
              <div
                className="md:grid-cols-12 md:gap-4
              grid gap-2"
              >
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/**do you currently study here? */}
              <FormField
                control={form.control}
                name="onGoing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Do you Currently Study Here?</FormLabel>

                      <FormMessage />
                    </div>
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
                  {mutation.isPending ? "Adding Education..." : "Add Education"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
