import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3">
      <Skeleton className="rounded-sm h-7 w-55 bg-zinc-300" />
      <Skeleton className="rounded-sm h-7 w-3/4 bg-zinc-300" />
    </div>
  );
}
