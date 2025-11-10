"use client";

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
import { SignOutButton } from "@clerk/nextjs";
import { useState } from "react";

const NavbarBurgerButton = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () =>
    setTimeout(() => {
      (setOpen(false), 1000);
    });
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Open Menu">
          <Menu />
        </button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="h-full">
          <SheetTitle className="font-bold text-[var(--app-blue)]">
            Huntly Ai
          </SheetTitle>
          <SheetDescription
            asChild
            className="font-semibold text-[var(--foreground)]"
          >
            <div className="w-full h-full flex flex-col justify-between">
              <div className="h-3/4 flex flex-col justify-evenly">
                {[
                  { href: "/jobs/dashboard", label: "Jobs", icon: Briefcase },
                  {
                    href: "/jobs/app-tracker",
                    label: "App Tracker",
                    icon: LayoutDashboardIcon,
                  },
                  { href: "/jobs/resume", label: "Resume", icon: FileText },
                  {
                    href: "/jobs/profile",
                    label: "Profile",
                    icon: UserRoundPen,
                  },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleClose}
                    className="flex gap-1 items-center"
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
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

                <SignOutButton>
                  <button className="flex gap-1 items-center w-full text-left">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarBurgerButton;
