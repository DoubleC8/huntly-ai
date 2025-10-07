"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export function AppliedJobsPaginationBar({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <Pagination>
      <PaginationContent className="flex gap-3">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handleNavigate(Math.max(1, currentPage - 1))}
            className="bg-[var(--card)]"
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={() => handleNavigate(page)}
                className="bg-[var(--card)]"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() =>
              handleNavigate(Math.min(totalPages, currentPage + 1))
            }
            className="bg-[var(--card)]"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
