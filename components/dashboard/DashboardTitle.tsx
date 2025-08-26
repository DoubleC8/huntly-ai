import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardTitle() {
  return (
    <div className="pageTitleContainer">
      <div className="flex items-center gap-3">
        <Link href={"/jobs/dashboard"} className="pageTitle">
          Recommended Jobs
        </Link>
        <ChevronRight />
        <div className="flex gap-3 font-bold">
          <Link
            href={"/jobs/dashboard/wishlist"}
            className="hover:bg-[var(--app-blue)] hover:text-[var(--background)] py-1 px-3 rounded-lg ease-in-out duration-200"
          >
            Wishlisted
          </Link>
          <Link
            href={"/jobs/dashboard/applied"}
            className="hover:bg-[var(--app-blue)] hover:text-[var(--background)] py-1 px-3 rounded-lg ease-in-out duration-200"
          >
            Applied
          </Link>
          <Link
            href={"/jobs/dashboard/interview"}
            className="hover:bg-[var(--app-blue)] hover:text-[var(--background)] py-1 px-3 rounded-lg ease-in-out duration-200"
          >
            Interviewing
          </Link>
          <Link
            href={"/jobs/dashboard/offer"}
            className="hover:bg-[var(--app-blue)] hover:text-[var(--background)] py-1 px-3 rounded-lg ease-in-out duration-200"
          >
            Offered a Position
          </Link>
        </div>
      </div>
    </div>
  );
}
