import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Job, JobStage } from "@/app/generated/prisma";
import { Button } from "../ui/button";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import { updateJobStage } from "@/app/actions/updateJobStage";
import { toast } from "sonner";
import { STAGE_ORDER } from "@/app/constants/jobStage";
import { formatJobDate, formatSalary } from "@/lib/date-utils";

export default function JobColumnJobPost({ job }: { job: Job }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: job.id,
      data: {
        job,
      },
    });

  const moveJobStage = async (direction: "up" | "down") => {
    const currentIndex = STAGE_ORDER.indexOf(job.stage as JobStage);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= STAGE_ORDER.length) return;

    const newStage = STAGE_ORDER[newIndex];

    try {
      await updateJobStage(job.id, newStage);
      toast.success(
        `Moved job to the ${
          newStage.charAt(0).toUpperCase() + newStage.slice(1).toLowerCase()
        } column.`,
        {
          description: "Congrats!",
        }
      );
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    } catch (err) {
      toast.error("Failed to update job stage.");
    }
  };

  return (
    <Card
      key={job.id}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : 0,
        position: isDragging ? "absolute" : "relative",
        width: isDragging ? "24%" : "",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className="lg:min-h-[32%] lg:h-[32%] lg:max-h-fit lg:overflow-y-auto
      flex flex-col gap-3 justify-between p-3"
    >
      <CardHeader className="flex gap-3 items-center p-0">
        <a target="_blank" href="https://logo.dev" rel="noopener noreferrer">
          <Image
            src={`https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
            width={45}
            height={45}
            alt="Logo API"
            className="rounded-lg"
          />
        </a>
        <div>
          <h2 className="font-bold">{job.title}</h2>
          <p className="font-medium text-xs text-muted-foreground">
            {job.company} — {job.location}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex justify-start p-0">
        <div className="font-medium text-xs text-muted-foreground">
          <p>
            Salary: ${formatSalary(job.salaryMin)} - $
            {formatSalary(job.salaryMax)} {job.currency}
          </p>
          <p>
            Job Type: {job.employment}, {job.remoteType}
          </p>
          {job.postedAt ? (
            <p>Posted: {formatJobDate(job.postedAt)}</p>
          ) : (
            <p>We found this job for you {formatJobDate(job.createdAt)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter
        className="md:gap-3 md:justify-center
       flex items-center justify-between"
      >
        <Button className="lg:hidden" onClick={() => moveJobStage("up")}>
          <ChevronUp />
        </Button>
        <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full">View Job Posting</Button>
        </a>
        <Button className="lg:hidden" onClick={() => moveJobStage("down")}>
          <ChevronDown />
        </Button>
      </CardFooter>
    </Card>
  );
}
