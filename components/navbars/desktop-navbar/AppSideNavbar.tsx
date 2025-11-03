"use client";

import Link from "next/link";
import {
  Briefcase,
  FileText,
  LayoutDashboardIcon,
  LogOut,
  Send,
  Settings,
  UserRoundPen,
} from "lucide-react";
import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";

export default function AppSidebarNavbar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-2/10 p-5 flex flex-col gap-8 z-50">
      <Link
        href={"/jobs/dashboard"}
        className="lg:flex-row lg:gap-2
          flex flex-col gap-1 items-center"
      >
        <Image src={"/logo.png"} alt="logo" width={55} height={55} />
        <span
          className="lg:text-xl lg:font-extrabold tracking-wide
         font-bold text-[var(--foreground)]"
        >
          Huntly Ai
        </span>
      </Link>
      <nav className="w-full h-full flex flex-col ">
        <div className="h-3/4 flex flex-col gap-8 ">
          <Link href={"/jobs/dashboard"} className="sidebarNavbarLink">
            <Briefcase size={20} />
            <p>Jobs</p>
          </Link>
          <Link href={"/jobs/app-tracker"} className="sidebarNavbarLink">
            <LayoutDashboardIcon size={20} />
            <p>App Tracker</p>
          </Link>
          <Link href={"/jobs/resume"} className="sidebarNavbarLink">
            <FileText size={20} />
            <p>Resume</p>
          </Link>
          <Link href={"/jobs/profile"} className="sidebarNavbarLink">
            <UserRoundPen size={20} />
            <p>Profile</p>
          </Link>
        </div>
        <div className="h-1/4 flex flex-col justify-evenly border-t border-gray-100">
          <Link href={"/jobs/settings"} className="sidebarNavbarLink">
            <Settings size={20} />
            <p>Settings</p>
          </Link>
          <Link
            href="mailto:christophercortes@ucsb.edu?subject=Huntly%20Ai%20Feedback"
            className="sidebarNavbarLink"
          >
            <Send size={20} />
            <p>Contact Us</p>
          </Link>

          <SignOutButton>
            <button className="sidebarNavbarLink w-full text-left">
              <LogOut size={20} />
              <p>Sign Out</p>
            </button>
          </SignOutButton>
        </div>
      </nav>
    </aside>
  );
}
