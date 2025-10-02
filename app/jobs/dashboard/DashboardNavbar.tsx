"use client";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  employment: z.string().optional(),
  remoteType: z.string().optional(),
  salaryMin: z.string().optional(),
  location: z.string().max(100).optional(),
  search: z.string().max(100).optional(),
});

export default function DashboardNavbar() {
  const router = useRouter();
  const employmentTypes = [
    {
      label: "Full Time",
      value: "Full-Time",
    },
    {
      label: "Part Time",
      value: "Part-Time",
    },
    {
      label: "Contract",
      value: "Contract",
    },
    {
      label: "Internship",
      value: "Internship",
    },
  ] as const;

  const remoteTypes = [
    {
      label: "In-Person",
      value: "In-Person",
    },
    {
      label: "Online",
      value: "Online",
    },
    {
      label: "Hybrid",
      value: "Hybrid",
    },
  ] as const;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      salaryMin: "",
      location: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams();

    if (values.search) params.set("search", values.search);
    if (values.location) params.set("location", values.location);
    if (values.employment) params.set("employment", values.employment);
    if (values.remoteType) params.set("remoteType", values.remoteType);
    if (values.salaryMin) params.set("salaryMin", values.salaryMin);

    router.push(`/jobs/dashboard?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:flex-row
        flex flex-col gap-3 pb-3 border-b-[0.5px] border-b-gray-300"
      >
        <div className="w-full flex flex-col gap-3">
          {/**search input */}
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="bg-[var(--background)] h-9 w-full"
                    placeholder="Search"
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/**filters */}
          <div
            className="md:flex-row
          flex flex-col gap-3"
          >
            {/**employment type: full-time, part-time */}
            <FormField
              control={form.control}
              name="employment"
              render={({ field }) => (
                <FormItem
                  className="md:w-1/4
                flex flex-col"
                >
                  <FormLabel className="text-muted-foreground">
                    Job Type
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? employmentTypes.find(
                                (type) => type.value === field.value
                              )?.label
                            : "Select Job Type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command className="w-full">
                        <CommandInput placeholder="Search Job Type..." />
                        <CommandList>
                          <CommandEmpty>No Job Type Found</CommandEmpty>
                          <CommandGroup className="w-full">
                            {employmentTypes.map((type) => (
                              <CommandItem
                                key={type.value}
                                onSelect={() =>
                                  form.setValue("employment", type.value)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    type.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {type.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/**work model: on site, remote */}
            <FormField
              control={form.control}
              name="remoteType"
              render={({ field }) => (
                <FormItem
                  className="md:w-1/4
                flex flex-col"
                >
                  <FormLabel className="text-muted-foreground">
                    Work Model
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? remoteTypes.find(
                                (remoteType) => remoteType.value === field.value
                              )?.label
                            : "Select Remote Type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No Remote Type found.</CommandEmpty>
                          <CommandGroup>
                            {remoteTypes.map((remoteType) => (
                              <CommandItem
                                value={remoteType.label}
                                key={remoteType.value}
                                onSelect={() => {
                                  form.setValue("remoteType", remoteType.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    remoteType.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {remoteType.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/**base salary */}
            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem className="md:w-1/4">
                  <FormLabel className="text-muted-foreground">
                    Salary Minimum
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your Base Salary"
                      className="bg-[var(--background)] h-9 w-full"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/**city */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="md:w-1/4">
                  <FormLabel className="text-muted-foreground">City</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[var(--background)] h-9"
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/**search button */}
        <Button type="submit" className="h-9">
          <Search
            className="md:block
          hidden"
          />
          <p className="md:hidden">Search</p>
        </Button>
      </form>
    </Form>
  );
}
