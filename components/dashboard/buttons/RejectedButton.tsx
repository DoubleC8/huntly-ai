"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Ghost } from "lucide-react";
import { JobStage } from "@/app/generated/prisma";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setJobAsRejected } from "@/app/actions/setJobAsRejected";
import { STAGE_ORDER } from "@/app/constants/jobStage";

export default function RejectedButton({
  jobId,
  jobStage,
}: {
  jobId: string;
  jobStage: JobStage | null;
}) {
  const [isPending, startTransition] = useTransition();

  const handleReject = () => {
    startTransition(async () => {
      try {
        const updatedJob = await setJobAsRejected(jobId);
        toast.success("Job has been masked as Rejected.", {
          description:
            "This job has been removed from your active applications.",
        });
      } catch (error) {
        toast.error("Failed to add job to rejected list.", {
          description: "Please try again later.",
        });
      }
    });
  };

  const showGhost =
    jobStage === null ||
    STAGE_ORDER.indexOf("APPLIED") <= STAGE_ORDER.indexOf(jobStage);

  if (!showGhost) return null;

  return jobStage === null ||
    STAGE_ORDER.indexOf("APPLIED") <= STAGE_ORDER.indexOf(jobStage) ? (
    <Dialog>
      <DialogTrigger asChild>
        <button
          disabled={isPending}
          className="hover:cursor-pointer hover:text-[var(--app-red)]"
          title="Reject Job"
        >
          <Ghost />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Job</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this job as <strong>Rejected</strong>?
            <br />
            <span className="text-red-600 font-semibold">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleReject}
            >
              {isPending ? "Rejecting..." : "Reject Job"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
}
