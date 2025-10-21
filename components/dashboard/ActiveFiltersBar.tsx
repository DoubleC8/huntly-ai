"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

export default function ActiveFiltersBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = Object.entries(Object.fromEntries(searchParams.entries()));

  if (filters.length === 0) return null;

  const labelMap: Record<string, string> = {
    search: "Keyword",
    location: "City",
    employment: "Job Type",
    remoteType: "Work Model",
    salaryMin: "Salary Min",
  };

  function formatValue(key: string, value: string) {
    if (key === "salaryMin") {
      const num = Number(value);
      return isNaN(num) ? value : `$${num.toLocaleString()}`;
    }
    if (key === "employment") {
      return value.replace("-", " ");
    }
    return value;
  }

  return (
    <div
      className="md:flex-row md:justify-between
        flex flex-col gap-3 pb-3"
    >
      {filters.map(([key, value]) => (
        <span
          key={key}
          className="text-sm bg-[var(--muted)] text-[var(--foreground)] px-2 py-1 rounded-md"
        >
          <strong>{labelMap[key] ?? key}:</strong> {formatValue(key, value)}
        </span>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/jobs/dashboard")}
      >
        Clear all
      </Button>
    </div>
  );
}
