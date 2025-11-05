"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useJobStageCounts } from "@/lib/hooks/jobs/useJobStageCounts";
import { JobStage } from "@/app/generated/prisma";

type LinkItem = {
  name: string;
  href: string;
  key?: JobStage;
};

export default function DashboardTitle() {
  const pathname = usePathname();
  const { data: counts } = useJobStageCounts();

  const links: LinkItem[] = [
    { name: "Recommended", href: "/jobs/dashboard" },
    {
      name: "Wishlisted",
      href: "/jobs/dashboard/stage/wishlist",
      key: JobStage.WISHLIST,
    },
    {
      name: "Applied",
      href: "/jobs/dashboard/stage/applied",
      key: JobStage.APPLIED,
    },
    {
      name: "Interviewing",
      href: "/jobs/dashboard/stage/interview",
      key: JobStage.INTERVIEW,
    },
    {
      name: "Offered",
      href: "/jobs/dashboard/stage/offer",
      key: JobStage.OFFER,
    },
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
                ? "px-3 bg-[var(--app-blue)] rounded-md text-white"
                : "px-3 text-white"
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
                    ? "bg-[var(--app-blue)] text-white rounded-md flex px-3 gap-3 w-fit"
                    : "hover:bg-[var(--app-blue)] hover:text-[var(--background)] ease-in-out duration-200 rounded-md flex px-3 gap-3 w-fit"
                }
              >
                {link.name}
                {link.key &&
                  counts?.[link.key] !== undefined &&
                  counts[link.key] > 0 && (
                    <p className="md:block hidden bg-[var(--app-blue)] px-2 text-white rounded-full">
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
