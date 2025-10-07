import { Skeleton } from "@/components/ui/skeleton";

export default function JobsTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="w-full">
      <div className="flex bg-[var(--app-blue)] text-[var(--background)] font-semibold rounded-t-2xl">
        <div className="flex-1 p-3">Company</div>
        <div className="hidden md:flex-1 md:block p-3">Job Title</div>
        <div className="hidden md:flex-1 md:block p-3">Location</div>
        <div className="flex-1 text-center p-3 rounded-tr-2xl">Status</div>
      </div>

      <div className="bg-[var(--card)] rounded-b-2xl">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 px-4 border-b border-muted last:border-none"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="hidden md:flex flex-1 justify-start">
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="hidden md:flex flex-1 justify-start">
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex-1 flex justify-center">
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
