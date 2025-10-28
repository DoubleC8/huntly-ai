"use client";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobStage } from "@/app/generated/prisma";

import { useUpdateJobStage } from "@/lib/hooks/jobs/useUpdateJobStage";
import { useOptimisticUpdate } from "@/lib/hooks/useOptimisticUpdate";
import { STAGE_COLORS, STAGE_ICONS, STAGE_LABELS } from "@/lib/config/jobStage";
import { jobToasts } from "@/lib/utils/toast";

export default function UpdateJobStageDropdown({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage | null;
}) {
  const mutation = useUpdateJobStage();

  const {
    state: selectedStage,
    setState: setSelectedStage,
    mutate: optimisticUpdate,
  } = useOptimisticUpdate(
    jobStage ?? JobStage.DEFAULT,
    async (newStage: JobStage) => {
      return mutation.mutateAsync({
        type: "setStage",
        stage: newStage,
        jobId,
      });
    }
  );

  // Sync selectedStage with jobStage prop changes
  useEffect(() => {
    setSelectedStage(jobStage ?? JobStage.DEFAULT);
  }, [jobStage, setSelectedStage]);

  const handleStageChange = async (newStage: JobStage) => {
    try {
      await optimisticUpdate(newStage);
      jobToasts.stageChanged(
        { title: jobTitle, company: jobCompany },
        newStage
      );
    } catch {
      jobToasts.error(
        `Failed to add job to ${STAGE_LABELS[newStage]} list.`,
        "Please try again later."
      );
    }
  };

  const allowedStages: JobStage[] = [
    JobStage.APPLIED,
    JobStage.INTERVIEW,
    JobStage.OFFER,
  ];

  const Icon = STAGE_ICONS[selectedStage];

  return (
    <Select
      value={selectedStage}
      onValueChange={(value) => handleStageChange(value as JobStage)}
      disabled={mutation.isPending || jobStage === JobStage.REJECTED}
    >
      <SelectTrigger
        className="w-[180px] bg-[var(--background)]"
        style={{
          color: `var(${STAGE_COLORS[selectedStage]})`,
          fontWeight: 600,
        }}
      >
        <SelectValue placeholder="Select Stage">
          {selectedStage !== JobStage.DEFAULT ? (
            <>
              <Icon className={`text-[var(${STAGE_COLORS[selectedStage]})]`} />
              <p>{STAGE_LABELS[selectedStage]}</p>
            </>
          ) : (
            <p>Select Job Stage</p>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {allowedStages.map((stage) => {
          const Icon = STAGE_ICONS[stage];
          return (
            <SelectItem key={stage} value={stage}>
              <Icon className={`text-[var(${STAGE_COLORS[stage]})]`} />
              {STAGE_LABELS[stage]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
