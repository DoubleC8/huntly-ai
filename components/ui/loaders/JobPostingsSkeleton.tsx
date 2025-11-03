import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPostingsSkeleton({
  postings = 3,
}: {
  postings?: number;
}) {
  return (
    <>
      {Array.from({ length: postings }).map((_, i) => (
        <Skeleton
          key={i}
          className="bg-[var(--background)] text-card-foreground flex flex-col gap-6 rounded-xl border p-3 shadow-md"
        >
          <div className="flex flex-col gap-3">
            <Skeleton className="bg-gray-200 w-20 h-20 rounded-lg" />
            <Skeleton className="bg-gray-200 w-3/4 h-7 rounded-lg" />
            <Skeleton className="bg-gray-200 w-1/2 h-7 rounded-lg" />
            <Skeleton className="bg-gray-200 w-1/3 h-7 rounded-lg" />
          </div>
        </Skeleton>
      ))}
    </>
  );
}
