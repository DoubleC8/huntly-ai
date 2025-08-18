"use client";

import React, { useState } from "react";
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
import Link from "next/link";
import { logout } from "@/lib/auth-actions";

const NavbarBurgerButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsMenuOpen((prev) => !prev)}>
        <Menu size={25} />
      </button>
      <div className={`offScreenMenu ${isMenuOpen ? "active" : ""}`}>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-full flex justify-end"
        >
          <X size={25} />
        </button>
        <div className="w-full h-full flex flex-col justify-between font-semibold">
          <div className="h-3/4 flex flex-col justify-evenly">
            <Link href={"/jobs/dashboard"} className="flex gap-1 items-center">
              <Briefcase size={16} />
              <p>Jobs</p>
            </Link>
            <Link href={"/jobs/profile"} className="flex gap-1 items-center">
              <UserRoundPen size={16} />
              <p>Profile</p>
            </Link>
            <Link href={"/jobs/resume"} className="flex gap-1 items-center">
              <FileText size={16} />
              <p>Resume</p>
            </Link>
          </div>
          <div className="h-1/4 flex flex-col justify-evenly">
            <Link href={"/jobs/settings"} className="flex gap-1 items-center">
              <Settings size={16} />
              <p>Settings</p>
            </Link>
            <Link
              href="mailto:christophercortes@ucsb.edu?subject=Huntly%20Ai%20Feedback"
              className="flex gap-1 items-center"
            >
              <Send size={16} />
              <p>Contact Us</p>
            </Link>

            <button onClick={logout} className="flex gap-1 items-center">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarBurgerButton;
