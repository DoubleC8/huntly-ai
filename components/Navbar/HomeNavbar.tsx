"use client";

import Image from "next/image";
import Link from "next/link";
import NavbarLoginButton from "./NavbarLoginButton";

export default function HomeNavbar() {
  return (
    <nav className="flex top-0 z-50 h-14 w-full items-center px-4 border-b border-gray-200 shadow-md">
      {""}
      <div className="container mx-auto flex justify-between items-center px-6 md:px-8">
        <Link href={"/"} className="flex items-center">
          <Image src={"/logo.png"} alt="logo" width={50} height={50} />
          <span
            className="text-xl tracking-wide
         font-extrabold text-[var(--app-blue)]"
          >
            Huntly Ai
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <NavbarLoginButton />
        </div>
      </div>
    </nav>
  );
}
