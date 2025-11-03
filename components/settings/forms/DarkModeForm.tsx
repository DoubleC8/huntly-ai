"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const formSchema = z.object({
  darkMode: z.boolean(),
});

export default function DarkModeForm() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = resolvedTheme === "dark";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      darkMode: false,
    },
  });

  // Update form when theme changes
  useEffect(() => {
    if (mounted && resolvedTheme) {
      form.reset({
        darkMode: isDarkMode,
      });
    }
  }, [isDarkMode, form, mounted, resolvedTheme]);

  const handleToggle = async (checked: boolean) => {
    try {
      form.setValue("darkMode", checked);
      setTheme(checked ? "dark" : "light");
      toast.success("Theme updated successfully!", {
        description: `Switched to ${checked ? "dark" : "light"} mode.`,
      });
    } catch (error) {
      console.error("Failed to update theme:", error);
      toast.error("Failed to update theme", {
        description: "Please try again later.",
      });
      // Revert the form value on error
      form.setValue("darkMode", !checked);
    }
  };

  // Show default state until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="darkMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Dark Mode</FormLabel>
                  <FormDescription>
                    Toggle between light and dark theme.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={false} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="darkMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Dark Mode</FormLabel>
                <FormDescription>
                  Toggle between light and dark theme.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={handleToggle}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

