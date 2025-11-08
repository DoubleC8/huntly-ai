"use client";

import Image from "next/image";
import Link from "next/link";
import LoginButton from "./LoginButton";

export default function HomeNavbar() {
  return (
    <nav className="sticky bg-[var(--background)] flex justify-between top-0 z-50 h-14 w-full items-center px-4 border-b shadow-md">
      {""}

      <Link href={"/"} className="flex items-center">
        <Image src={"/logo.png"} alt="logo" width={50} height={50} />
        <span
          className="text-xl tracking-wide
         font-extrabold text-[var(--app-blue)]"
        >
          Huntly Ai
        </span>
      </Link>

      <LoginButton isButton={false} />
    </nav>
  );
}
