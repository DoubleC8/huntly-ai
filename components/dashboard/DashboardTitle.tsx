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
      name: "Wishlisted",
      href: "/jobs/dashboard/stage/wishlist",
      key: "WISHLIST",
    },
    { name: "Applied", href: "/jobs/dashboard/stage/applied", key: "APPLIED" },
    {
      name: "Interviewing",
      href: "/jobs/dashboard/stage/interview",
      key: "INTERVIEW",
    },
    { name: "Offered", href: "/jobs/dashboard/stage/offer", key: "OFFER" },
  ];

  const currentLink = links.find((link) => link.href === pathname);
  const currentTitle = currentLink?.name || "Recommended";

  return (
    <>
      {/* MOBILE NAV */}
      <div className="md:hidden w-full h-14 bg-[var(--background)] flex gap-2 justify-between items-center px-3 font-semibold overflow-x-scroll">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={
              pathname === link.href
                ? "px-3 bg-[var(--app-blue)] rounded-md text-[var(--background)]"
                : "px-3"
            }
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* DESKTOP NAV */}
      <div className="pageTitleContainer">
        <div className="lg:flex-row lg:items-center lg:gap-0 flex flex-col gap-3">
          <div
            className="lg:w-3/10 
          flex items-center gap-3"
          >
            <h1 className="pageTitle">{currentTitle} Jobs</h1>
            <ChevronRight />
          </div>

          <div className="lg:w-7/10 flex items-center justify-evenly font-bold h-fit">
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
