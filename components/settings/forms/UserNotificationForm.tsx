"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/lib/hooks/user-notifications/useNotificationSettings";

const formSchema = z.object({
  newJobEmailNotifications: z.boolean(),
});

export default function UserNotificationForm() {
  const { data: settings } = useNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newJobEmailNotifications: false,
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        newJobEmailNotifications: settings.newJobEmailNotifications,
      });
    }
  }, [settings, form]);

  const handleToggle = async (checked: boolean) => {
    form.setValue("newJobEmailNotifications", checked);
    updateMutation.mutate({
      newJobEmailNotifications: checked,
    });
  };

  // Only disable during mutation, not during initial load
  const isDisabled = updateMutation.isPending;

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="newJobEmailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Job Notifications Emails</FormLabel>
                <FormDescription>
                  Receive emails about new job postings daily.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={handleToggle}
                  disabled={isDisabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
