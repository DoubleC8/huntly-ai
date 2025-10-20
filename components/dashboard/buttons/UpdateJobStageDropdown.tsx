"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobStage } from "@/app/generated/prisma";
import { updateJob } from "@/app/actions/jobs/updateJob";
import {
  STAGE_COLORS,
  STAGE_ICONS,
  STAGE_LABELS,
} from "@/app/constants/jobStage";

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
  const [isPending, startTransition] = useTransition();
  const [selectedStage, setSelectedStage] = useState<JobStage>(
    jobStage ?? JobStage.APPLIED
  );

  const handleStageChange = (newStage: JobStage) => {
    setSelectedStage(newStage);

    startTransition(async () => {
      try {
        await updateJob({
          type: "setStage",
          jobId,
          stage: newStage,
        });

        toast.success(
          `${jobTitle} at ${jobCompany} has been marked as ${STAGE_LABELS[newStage]}`
        );
      } catch {
        toast.error(`Failed to mark as ${STAGE_LABELS[newStage]}.`, {
          description: "Please try again later.",
        });
      }
    });
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
      disabled={isPending || jobStage === JobStage.REJECTED}
    >
      <SelectTrigger
        className="w-[180px] bg-[var(--background)]"
        style={{
          color: `var(${STAGE_COLORS[selectedStage]})`,
          fontWeight: 600,
        }}
      >
        <SelectValue placeholder="Select Stage">
          {jobStage !== JobStage.DEFAULT ? (
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
