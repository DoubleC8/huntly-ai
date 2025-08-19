import Link from "next/link";
import NavbarBurgerButton from "./NavbarBurgerButton";
import Image from "next/image";

export default function AppMobileNavar() {
  return (
    <nav className="flex sticky top-0 z-50 h-14 items-center px-4 border-b border-gray-200 shadow-md">
      <NavbarBurgerButton />
      <Link
        href={"/jobs/dashboard"}
        className="flex flex-row gap-1 justify-center items-center w-full h-full"
      >
        <span
          className="text-xl tracking-wide
         font-extrabold text-[var(--ring)]"
        >
          Huntly Ai
        </span>
      </Link>
    </nav>
  );
}
