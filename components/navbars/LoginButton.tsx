"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function LoginButton({ isButton }: { isButton: boolean }) {
  return (
    <SignInButton mode="modal">
      {isButton ? (
        <Button
          className="md:w-2/10
          w-1/2 mx-auto"
        >
          Get Started for Free
        </Button>
      ) : (
        <p className="ease-in-out duration-200 hover:text-[var(--ring)] hover:cursor-pointer">
          Sign In
        </p>
      )}
    </SignInButton>
  );
}
