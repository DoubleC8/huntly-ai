"use client";
import { useState } from "react";
import { HeartCrack, LoaderCircle, Trash2 } from "lucide-react";
import { JobStage } from "@/app/generated/prisma";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useUpdateJobStage } from "@/lib/hooks/jobs/useUpdateJobStage";
import { STAGE_ORDER } from "@/lib/config/jobStage";
import { jobToasts } from "@/lib/utils/toast";

export default function RejectedButton({
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
  const [open, setOpen] = useState(false);

  const mutation = useUpdateJobStage();

  const handleRejectClick = async () => {
    try {
      await mutation.mutateAsync({
        type: "setStage",
        stage: JobStage.REJECTED,
        jobId,
      });

      jobToasts.rejected({ title: jobTitle, company: jobCompany });
    } catch {
      // revert if error
      jobToasts.error(
        "Failed to add job to rejected list.",
        "Please try again later."
      );
    } finally {
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  };

  const showButton =
    jobStage === null ||
    STAGE_ORDER.indexOf("APPLIED") <= STAGE_ORDER.indexOf(jobStage);

  if (!showButton) return null;

  return jobStage === null ||
    STAGE_ORDER.indexOf("APPLIED") <= STAGE_ORDER.indexOf(jobStage) ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        title="Mark Job as rejected"
        disabled={jobStage === JobStage.REJECTED ? true : false}
      >
        <Trash2
          className={
            jobStage === JobStage.REJECTED
              ? "text-[var(--app-red)] hover:cursor-pointer"
              : "text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-red)] hover:cursor-pointer"
          }
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-center">
            Are you sure you want to mark this job as Rejected?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <HeartCrack className="text-[var(--app-red)]" size={55} />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          This action cannot be undone.
        </p>
        <DialogFooter>
          <Button
            onClick={handleRejectClick}
            disabled={mutation.isPending}
            className="md:w-1/2 md:mx-auto
            w-full"
            variant={"destructive"}
          >
            {mutation.isPending ? (
              <LoaderCircle className="animate-spin mr-2" size={18} />
            ) : (
              ""
            )}
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
}
