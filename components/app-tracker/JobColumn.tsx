import { Job } from "@/app/generated/prisma";
import JobColumnJobPost from "./JobColumnJobPost";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export default function JobColumn({
  id,
  jobs,
  title,
  color,
  icon,
  total_jobs,
  description,
}: {
  id: string;
  jobs: Job[];
  title: string;
  color: string;
  icon: React.ElementType;
  total_jobs: number;
  description: string;
}) {
  const Icon = icon;

  const { setNodeRef, isOver } = useDroppable({
    id: id.toUpperCase(),
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full h-[40vh] max-h-[40vh] min-h-[40vh]", // default: small & medium screens
        "md:min-h-[33vh]",
        "lg:w-[24%] lg:h-full lg:max-h-none",
        "bg-[var(--background)] shadow-md rounded-lg flex flex-col text-[var(--background)]"
      )}
    >
      <div
        className="w-full py-2 px-3 flex rounded-t-lg text-lg font-bold justify-between sticky top-0 z-10"
        style={{ backgroundColor: `var(${color})` }}
      >
        <div className="flex items-center gap-1">
          <h1>{title}</h1>
          <Icon size={18} />
        </div>
        <p>{total_jobs}</p>
      </div>

      {jobs.length > 0 ? (
        <div className="flex flex-col gap-3 h-full p-3 overflow-y-auto">
          {jobs.map((job) => (
            <JobColumnJobPost job={job} key={job.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center my-auto gap-3 h-full p-3 overflow-y-auto">
          <div className="text-muted-foreground flex flex-col gap-3 p-2 items-center text-center">
            <Icon size={30} />
            <p className="text-sm opacity-70">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
