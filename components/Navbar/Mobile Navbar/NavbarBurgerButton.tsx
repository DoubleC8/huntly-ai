"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Briefcase,
  FileText,
  LayoutDashboardIcon,
  LogOut,
  Menu,
  Send,
  Settings,
  UserRoundPen,
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/auth-actions";

const NavbarBurgerButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="h-full">
          <SheetTitle className="font-bold text-[var(--app-blue)]">
            Huntly Ai
          </SheetTitle>
          <SheetDescription asChild className="font-semibold text-black">
            <div className="w-full h-full flex flex-col justify-between">
              <div className="h-3/4 flex flex-col justify-evenly">
                <Link
                  href={"/jobs/dashboard"}
                  className="flex gap-1 items-center"
                >
                  <Briefcase size={16} />
                  Jobs
                </Link>
                <Link
                  href={"/jobs/app-tracker"}
                  className="flex gap-1 items-center"
                >
                  <LayoutDashboardIcon size={16} />
                  App Tracker
                </Link>
                <Link href={"/jobs/resume"} className="flex gap-1 items-center">
                  <FileText size={16} />
                  Resume
                </Link>
                <Link
                  href={"/jobs/profile"}
                  className="flex gap-1 items-center"
                >
                  <UserRoundPen size={16} />
                  Profile
                </Link>
              </div>
              <div className="h-1/4 flex flex-col justify-evenly border-t border-gray-200">
                <Link
                  href={"/jobs/settings"}
                  className="flex gap-1 items-center"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <Link
                  href="mailto:christophercortes@ucsb.edu?subject=Huntly%20Ai%20Feedback"
                  className="flex gap-1 items-center"
                >
                  <Send size={16} />
                  Contact Us
                </Link>

                <button onClick={logout} className="flex gap-1 items-center">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarBurgerButton;
