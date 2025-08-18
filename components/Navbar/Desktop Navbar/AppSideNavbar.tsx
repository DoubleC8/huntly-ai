import type { Session } from "next-auth";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  LogOut,
  Menu,
  Send,
  Settings,
  UserRoundPen,
  X,
} from "lucide-react";
import Image from "next/image";
import { logout } from "@/lib/auth-actions";

export default function AppSidebarNavbar({
  session,
}: {
  session: Session | null;
}) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-2/10 bg-[var(--card)] p-5 flex flex-col gap-5">
      <Link
        href={"/jobs/dashboard"}
        className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
      >
        <Image src={"/logo.png"} alt="logo" width={50} height={50} />
        <span
          className="lg:text-lg lg:font-extrabold
          text-md font-bold text-[var(--ring)]"
        >
          Huntly Ai
        </span>
      </Link>
      <nav
        className="lg:text-lg lg:font-bold
      text-md font-semibold w-full h-full flex flex-col"
      >
        <div className="h-3/4 flex flex-col gap-8">
          <Link
            href={"/jobs/dashboard"}
            className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
          >
            <Briefcase size={20} />
            <p>Jobs</p>
          </Link>
          <Link
            href={"/jobs/profile"}
            className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
          >
            <UserRoundPen size={20} />
            <p>Profile</p>
          </Link>
          <Link
            href={"/jobs/resume"}
            className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
          >
            <FileText size={20} />
            <p>Resume</p>
          </Link>
        </div>
        <div className="h-1/4 flex flex-col justify-evenly border-t border-gray-100">
          <Link
            href={"/jobs/settings"}
            className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
          >
            <Settings size={20} />
            <p>Settings</p>
          </Link>
          <Link
            href="mailto:christophercortes@ucsb.edu?subject=Huntly%20Ai%20Feedback"
            className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
          >
            <Send size={20} />
            <p>Contact Us</p>
          </Link>

          <button
            onClick={logout}
            className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
