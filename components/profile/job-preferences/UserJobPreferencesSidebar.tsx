"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { TagsInput } from "@/components/ui/TagsInput";
import { useProfileMutations } from "@/lib/hooks/profile/useProfileMutations";
import { profileToasts } from "@/lib/utils/toast";
import { normalizeEntry } from "@/lib/utils";
import { useJobSearch } from "@/lib/hooks/jobs/useJobSearch";
import { JOB_PREFERENCE_LIMIT } from "@/lib/constants/profile";

const RATE_LIMIT_DURATION_MS = 10_000;
const RATE_LIMIT_SECONDS = Math.ceil(RATE_LIMIT_DURATION_MS / 1000);
const JOB_SEARCH_POLL_INTERVAL_MS = 4_000;
const JOB_SEARCH_MAX_ATTEMPTS = 5;

const formSchema = z.object({
  jobPreferences: z
    .array(z.string())
    .min(1, {
      error: "Please enter at least one entry.",
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

type UserJobPreferencesSidebarProps = {
  existingJobPreferences: string[];
  hasResume: boolean;
  hasSkills: boolean;
  userId: string;
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export default function UserJobPreferencesSidebar({
  existingJobPreferences,
  hasResume,
  hasSkills,
  userId,
}: UserJobPreferencesSidebarProps) {
  const mutation = useProfileMutations();
  const [open, setOpen] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState(
    existingJobPreferences
  );
  const [isRateLimited, setIsRateLimited] = useState(false);

  const rateLimitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const jobSearchBaselineRef = useRef<number | null>(null);
  const jobSearchPollingRef = useRef(false);

  const { data: jobSearchResults, refetch: refetchJobSearch } = useJobSearch({
    userId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPreferences: [],
    },
  });

  useEffect(() => {
    setCurrentPreferences(existingJobPreferences);
  }, [existingJobPreferences]);

  useEffect(() => {
    if (jobSearchResults && jobSearchBaselineRef.current === null) {
      jobSearchBaselineRef.current = jobSearchResults.length;
    }
  }, [jobSearchResults]);

  useEffect(() => {
    return () => {
      if (rateLimitTimeoutRef.current) {
        clearTimeout(rateLimitTimeoutRef.current);
      }
    };
  }, []);

  const normalizedPreferences = useMemo(
    () => new Set(currentPreferences.map((pref) => normalizeEntry(pref))),
    [currentPreferences]
  );

  const remainingSlots = useMemo(
    () => Math.max(0, JOB_PREFERENCE_LIMIT - normalizedPreferences.size),
    [normalizedPreferences]
  );

  const startRateLimit = useCallback(() => {
    setIsRateLimited(true);
    if (rateLimitTimeoutRef.current) {
      clearTimeout(rateLimitTimeoutRef.current);
    }
    rateLimitTimeoutRef.current = setTimeout(() => {
      setIsRateLimited(false);
    }, RATE_LIMIT_DURATION_MS);
  }, []);

  const waitForJobSearchCompletion = useCallback(async () => {
    if (jobSearchPollingRef.current) return;
    jobSearchPollingRef.current = true;

    try {
      const initialCount =
        jobSearchBaselineRef.current ?? jobSearchResults?.length ?? 0;
      jobSearchBaselineRef.current = initialCount;

      for (let attempt = 0; attempt < JOB_SEARCH_MAX_ATTEMPTS; attempt++) {
        await delay(JOB_SEARCH_POLL_INTERVAL_MS);
        const result = await refetchJobSearch();
        const newCount = result.data?.length ?? 0;

        if (newCount > initialCount) {
          jobSearchBaselineRef.current = newCount;
          profileToasts.jobSearchCompleted({
            jobsFound: newCount - initialCount,
          });
          return;
        }
      }

      profileToasts.jobSearchCompleted({ jobsFound: 0 });
    } catch (error) {
      console.error("Job search polling failed", error);
      profileToasts.error(
        "Job search finished, but we couldn't confirm new jobs yet."
      );
    } finally {
      jobSearchPollingRef.current = false;
    }
  }, [jobSearchResults, refetchJobSearch]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (!hasResume || !hasSkills) {
        profileToasts.missingPrerequisites({
          missingResume: !hasResume,
          missingSkills: !hasSkills,
        });
        return;
      }

      if (isRateLimited) {
        profileToasts.jobPreferenceRateLimited(RATE_LIMIT_SECONDS);
        return;
      }

      const rawEntries =
        values.jobPreferences
          ?.map((pref) => pref.trim())
          .filter((pref) => pref.length > 0) ?? [];

      if (rawEntries.length === 0) {
        profileToasts.noInfoChanged();
        return;
      }

      const uniqueNormalizedEntries = Array.from(
        new Set(rawEntries.map((pref) => normalizeEntry(pref)))
      );
      const entriesToAddNormalized = uniqueNormalizedEntries.filter(
        (entry) => !normalizedPreferences.has(entry)
      );

      if (entriesToAddNormalized.length === 0) {
        profileToasts.noInfoChanged();
        return;
      }

      if (entriesToAddNormalized.length > remainingSlots) {
        profileToasts.jobPreferenceLimitReached();
        return;
      }

      const preferencesToPersist = entriesToAddNormalized.map((entry) => {
        const original = rawEntries.find(
          (pref) => normalizeEntry(pref) === entry
        );
        return original ?? entry;
      });

      try {
        await mutation.mutateAsync({
          type: "updateFields",
          field: "jobPreferences",
          value: preferencesToPersist,
        });

        profileToasts.addedFields({
          fields: preferencesToPersist,
          fieldType: "jobPreferences",
        });

        setCurrentPreferences((prev) => {
          const dedup = new Map<string, string>();
          prev.forEach((pref) => dedup.set(normalizeEntry(pref), pref));
          preferencesToPersist.forEach((pref) =>
            dedup.set(normalizeEntry(pref), pref)
          );
          return Array.from(dedup.values());
        });

        if (jobSearchBaselineRef.current === null) {
          jobSearchBaselineRef.current = jobSearchResults?.length ?? 0;
        }

        form.reset({ jobPreferences: [] });
        startRateLimit();
        setTimeout(() => setOpen(false), 1000);
        void waitForJobSearchCompletion();
      } catch (error) {
        console.error("Form submission error", error);
        profileToasts.error("Failed to update job preferences.");
      }
    },
    [
      form,
      hasResume,
      hasSkills,
      isRateLimited,
      jobSearchResults,
      mutation,
      normalizedPreferences,
      remainingSlots,
      startRateLimit,
      waitForJobSearchCompletion,
    ]
  );

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
                render={({ field }) => {
                  const handleTagChange = (vals: string[]) => {
                    const sanitized = vals
                      .map((val) => val.trim())
                      .filter((val) => val.length > 0);
                    field.onChange(sanitized);
                  };
                  return (
                    <FormItem>
                      <FormLabel>Enter your Job Preferences.</FormLabel>
                      <FormControl>
                        <TagsInput
                          value={field.value ?? []}
                          onValueChange={handleTagChange}
                          placeholder="Enter your job preferences"
                          maxItems={isRateLimited ? 0 : remainingSlots}
                        />
                      </FormControl>
                      <FormDescription>
                        Add job preferences to improve your Huntly Ai
                        experience. You can save up to {JOB_PREFERENCE_LIMIT}{" "}
                        preferences.
                        {remainingSlots === 0
                          ? " You've reached the limit."
                          : ` ${remainingSlots} ${
                              remainingSlots === 1 ? "spot" : "spots"
                            } remaining.`}
                      </FormDescription>
                      {isRateLimited && (
                        <p className="text-sm text-muted-foreground">
                          Please wait a few seconds before adding another job
                          preference.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <Button
                  type="submit"
                  disabled={mutation.isPending || isRateLimited}
                >
                  {mutation.isPending ? (
                    <>
                      <LoaderCircle className="animate-spin mr-1" />
                      Adding Job Preferences...
                    </>
                  ) : isRateLimited ? (
                    <>
                      <LoaderCircle className="animate-spin mr-1" />
                      Please Wait...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1" />
                      Add Job Preferences
                    </>
                  )}
                </Button>
                {remainingSlots === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Remove an existing job preference before adding a new one.
                  </p>
                )}
              </div>
            </form>
          </Form>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
