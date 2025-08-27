"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function DashboardTitle() {
  const pathname = usePathname();
  const links = [
    { name: "Recommended", href: "/jobs/dashboard" },
    { name: "Wishlist", href: "/jobs/dashboard/wishlist" },
    { name: "Applied", href: "/jobs/dashboard/applied" },
    { name: "Interview", href: "/jobs/dashboard/interview" },
    { name: "Offer", href: "/jobs/dashboard/offer" },
  ];

  return (
    <>
      <div
        className="md:hidden
    h-14 bg-[var(--background)] flex justify-between items-center px-3 font-semibold"
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={
              pathname === link.href
                ? "bg-[var(--app-blue)] text-[var(--background)] px-3 rounded-md"
                : ""
            }
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="pageTitleContainer">
        <div
          className="lg:flex-row lg:items-center
        flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <h1 className="pageTitle">Recommended Jobs</h1>
            <ChevronRight />
          </div>
          <div className="flex gap-3 font-bold justify-between h-fit ">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  pathname === link.href
                    ? "bg-[var(--app-blue)] text-[var(--background)] px-3 rounded-md"
                    : "hover:bg-[var(--app-blue)] hover:text-[var(--background)] px-3 rounded-md ease-in-out duration-200"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
