import { Skeleton } from "@/components/ui/skeleton";

export default function JobsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full">
      <Skeleton className="mx-auto rounded-t-2xl h-13 bg-zinc-300"></Skeleton>

      <Skeleton className="bg-[var(--card)] rounded-b-2xl p-3 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div className="w-full flex items-center justify-between" key={i}>
            <div className="flex items-center gap-3">
              <Skeleton className="w-[35px] h-[35px] rounded-lg bg-zinc-400" />
              <Skeleton className="rounded-sm w-45 h-5 bg-zinc-400"></Skeleton>
            </div>
            <Skeleton className="rounded-sm w-35 h-5 bg-zinc-400" />
            <Skeleton className="rounded-sm w-35 h-5 bg-zinc-400" />
            <Skeleton className="rounded-sm w-25 h-5 bg-zinc-400" />
          </div>
        ))}
      </Skeleton>
    </div>
  );
}
