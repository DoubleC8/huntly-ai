"use server";

import { signOut } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Note: Sign in is handled by Clerk's SignInButton component
// This logout function is used by navbar buttons

export const logout = async () => {
  await signOut();
  redirect("/");
};
