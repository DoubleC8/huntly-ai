"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserNotificationSettings } from "@/app/actions/user-notifications/get/getUserNotificationSettings";
import { updateUserNotificationSettings } from "@/app/actions/user-notifications/update/updateUserNotificationSettings";
import { toast } from "sonner";

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["userNotificationSettings"],
    queryFn: async () => {
      return await getUserNotificationSettings();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: { newJobEmailNotifications?: boolean }) => {
      return await updateUserNotificationSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotificationSettings"] });
      toast.success("Notification settings updated successfully!", {
        description: "Your preferences have been saved.",
      });
    },
    onError: (error) => {
      console.error("Failed to update notification settings:", error);
      toast.error("Failed to update notification settings", {
        description: "Please try again later.",
      });
    },
  });
}

