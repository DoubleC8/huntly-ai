import { Job, JobStage } from "@/app/generated/prisma";
import JobColumnJobPost from "./JobColumnJobPost";
import { useDroppable } from "@dnd-kit/core";

export default function JobColumn({
  id,
  jobs,
  title,
  count,
  isLoading = false,
  color,
  icon: Icon,
  description,
  isDraggable = true,
  onStageChange,
}: {
  id: string;
  jobs: Job[];
  title: string;
  count: number | undefined;
  isLoading?: boolean;
  color: string;
  icon: React.ElementType;
  description: string;
  isDraggable?: boolean;
  onStageChange?: (jobId: string, newStage: JobStage) => void;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="bg-[var(--background)] h-full rounded-xl flex flex-col shadow-md"
    >
      <div
        className="w-full py-2 px-3 flex rounded-t-xl text-lg font-bold justify-between sticky top-0 z-10"
        style={{ backgroundColor: `var(${color})`, color: "white" }}
      >
        <div className="flex items-center gap-1">
          <h1>{title}</h1>
          <Icon size={18} />
        </div>
        <p>{isLoading ? "..." : count ?? 0}</p>
      </div>

      {!isLoading && (count ?? 0) > 0 ? (
        <div className="flex flex-col gap-3 flex-1 p-3 overflow-y-auto">
          {jobs.map((job) => (
            <JobColumnJobPost
              job={job}
              key={job.id}
              isDraggable={isDraggable}
              onStageChange={onStageChange}
            />
          ))}
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center text-center flex-1 text-muted-foreground p-3">
          <Icon size={30} className="opacity-60 animate-pulse" />
          <p className="text-sm mt-2 opacity-70">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center flex-1 text-muted-foreground p-3">
          <Icon size={30} className="opacity-60" />
          <p className="text-sm mt-2 opacity-70">{description}</p>
        </div>
      )}
    </div>
  );
}
