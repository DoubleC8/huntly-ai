"use client";

import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import NavbarLoginButton from "./NavbarLoginButton";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="bg-white shadow-md py-4 border-b border-gray-200">
      {""}
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        <Link href={"/"} className="flex items-center">
          <Image src={"/logo.png"} alt="logo" width={50} height={50} />
          <span className="text-2xl font-extrabold text-gray-800">
            Huntly Ai
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <button
              className="flex items-center justify-center text-white p-2 rounded-sm cursor-pointer"
              onClick={logout}
            >
              Sign Out
            </button>
          ) : (
            <>
              <NavbarLoginButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
