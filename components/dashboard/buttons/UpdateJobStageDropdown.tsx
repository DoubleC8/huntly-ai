"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobStage } from "@/app/generated/prisma";

import { useUpdateJobStage } from "@/lib/hooks/jobs/useUpdateJobStage";
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
  const [selectedStage, setSelectedStage] = useState<JobStage>(
    jobStage ?? JobStage.DEFAULT
  );

  const mutation = useUpdateJobStage();

  // Sync selectedStage with jobStage prop changes
  useEffect(() => {
    setSelectedStage(jobStage ?? JobStage.DEFAULT);
  }, [jobStage]);

  const handleStageChange = async (newStage: JobStage) => {
    setSelectedStage(newStage);

    try {
      await mutation.mutateAsync({
        type: "setStage",
        stage: newStage,
        jobId,
      });

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
