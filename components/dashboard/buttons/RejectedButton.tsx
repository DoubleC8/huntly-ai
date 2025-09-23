"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Ghost, HeartCrack, LoaderCircle } from "lucide-react";
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
      <DialogTrigger asChild title="Mark Job as Rejected">
        <Ghost className="text-muted-foreground ease-in-out duration-200 hover:text-[var(--app-red)] hover:cursor-pointer" />
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
