import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeTableSkeleton() {
  return (
    <div className="relative w-full mx-auto rounded-t-2xl">
      <Skeleton className="h-12 w-12 rounded-full bg-red-500" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
