import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <nav
      className="px-4 py-1 md:flex-row
    bg-[var(--background)] flex flex-col justify-between top-0 z-50 h-14 w-full items-center  border-t border-gray-200 shadow-md"
    >
      <div
        className="md:w-1/2
        w-full justify-between
      text-muted-foreground flex items-center bg-red"
      >
        <a
          href="https://github.com/DoubleC8"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--app-blue)] ease-in-out duration-200"
        >
          About
        </a>
        <a
          href="https://github.com/DoubleC8"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--app-blue)] ease-in-out duration-200"
        >
          GitHub
        </a>
        <Link
          href="mailto:christophercortes@ucsb.edu?subject=Huntly%20Ai%20Feedback"
          className="hover:text-[var(--app-blue)] ease-in-out duration-200"
        >
          <p>Contact</p>
        </Link>
        <a
          href="https://github.com/DoubleC8"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--app-blue)] ease-in-out duration-200"
        >
          Privacy Policy
        </a>
      </div>
      <p className="text-muted-foreground flex items-center gap-1">
        © 2025 Huntly AI. Built with{" "}
        <Heart size={14} className="hover:text-[var(--app-blue)]" /> by Chris
        Cortes.
      </p>
    </nav>
  );
}
