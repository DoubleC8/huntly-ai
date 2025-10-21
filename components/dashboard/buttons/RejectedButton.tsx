"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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

import { STAGE_ORDER } from "@/app/constants/jobStage";
import { updateJob } from "@/app/actions/jobs/updateJob";

export default function RejectedButton({
  jobTitle,
  jobCompany,
  jobId,
  jobStage,
  onJobDeletion,
}: {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: JobStage | null;
  onJobDeletion?: (jobId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleReject = () => {
    startTransition(async () => {
      try {
        await updateJob({
          type: "setStage",
          jobId,
          stage: JobStage.REJECTED,
        });

        // Update the frontend immediately
        if (onJobDeletion) {
          onJobDeletion(jobId);
        }

        toast.success(`Moved job to ${JobStage.REJECTED.toLowerCase()}.`, {
          description: `${jobTitle} @ ${jobCompany}`,
        });
      } catch {
        toast.error("Failed to add job to rejected list.", {
          description: "Please try again later.",
        });
      } finally {
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      }
    });
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
            onClick={handleReject}
            disabled={isPending}
            className="md:w-1/2 md:mx-auto
            w-full"
            variant={"destructive"}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin mr-2" size={18} />
            ) : (
              ""
            )}
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
}
