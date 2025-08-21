"use client";

import Image from "next/image";
import Link from "next/link";
import NavbarLoginButton from "./NavbarLoginButton";

export default function HomeNavbar() {
  return (
    <nav className="shadow-md py-4 border-b border-gray-200">
      {""}
      <div className="container mx-auto flex justify-between items-center px-6 md:px-8">
        <Link href={"/"} className="flex items-center">
          <Image src={"/logo.png"} alt="logo" width={50} height={50} />
          <span
            className="md:text-lg
         font-extrabold"
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
