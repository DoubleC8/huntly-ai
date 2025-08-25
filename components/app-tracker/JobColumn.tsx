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
        "lg:w-[24%] lg:h-[83vh] lg:max-h-[83vh] h-1/2 bg-[var(--background)] rounded-lg shadow-md flex flex-col text-[var(--background)] overflow-y-auto",
        {
          "ring-2 ring-[var(--app-blue)]": isOver,
        }
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

      {total_jobs === 0 && (
        <div className="flex-1 flex  flex-col my-auto justify-center text-center text-[var(--foreground)] px-4">
          <div
            className="lg:h-1/4
          h-1/2 flex flex-col gap-3 items-center "
          >
            <Icon size={30} />
            <p className="text-sm opacity-70">{description}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 p-2">
        {jobs.map((job) => (
          <JobColumnJobPost job={job} key={job.id} />
        ))}
      </div>
    </div>
  );
}
