"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getJobStageCounts } from "@/app/actions/jobs/getJobStageCounts";

type LinkItem = {
  name: string;
  href: string;
  key?: string;
};

export default function DashboardTitle() {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      const res = await getJobStageCounts();
      setCounts(res);
    }
    fetchCounts();
  }, []);

  const links: LinkItem[] = [
    { name: "Recommended", href: "/jobs/dashboard" },
    {
      name: "Wishlist",
      href: "/jobs/dashboard/stage/wishlist",
      key: "WISHLIST",
    },
    { name: "Applied", href: "/jobs/dashboard/stage/applied", key: "APPLIED" },
    {
      name: "Interview",
      href: "/jobs/dashboard/stage/interview",
      key: "INTERVIEW",
    },
    { name: "Offer", href: "/jobs/dashboard/stage/offer", key: "OFFER" },
  ];

  return (
    <>
      {/* MOBILE NAV */}
      <div className="md:hidden h-14 bg-[var(--background)] flex justify-between items-center px-3 font-semibold">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={
              pathname === link.href
                ? "text-[var(--app-blue)] underline underline-offset-4"
                : ""
            }
          >
            {link.name}
            {link.key && counts?.[link.key] ? ` (${counts[link.key]})` : ""}
          </Link>
        ))}
      </div>

      {/* DESKTOP NAV */}
      <div className="pageTitleContainer">
        <div className="lg:flex-row lg:items-center flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="pageTitle">Recommended Jobs</h1>
            <ChevronRight />
          </div>
          <div className="lg:w-7/10 flex items-center justify-between font-bold h-fit">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  pathname === link.href
                    ? "bg-[var(--app-blue)] text-[var(--background)] rounded-md flex px-3 gap-3 w-fit"
                    : "hover:bg-[var(--app-blue)] hover:text-[var(--background)] ease-in-out duration-200 rounded-md flex px-3 gap-3 w-fit"
                }
              >
                {link.name}
                {link.key &&
                  counts?.[link.key] !== undefined &&
                  counts[link.key] > 0 && (
                    <p className="md:block hidden bg-[var(--app-blue)] px-2 text-[var(--background)] rounded-full">
                      {counts[link.key]}
                    </p>
                  )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
