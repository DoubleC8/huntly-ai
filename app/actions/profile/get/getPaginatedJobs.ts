"use server";

import { auth } from "@/auth";
import { getUserProfileData } from "./getUserInfo";


export async function getPaginatedJobs(page: number, limit: number) {
  const session = await auth();
  if (!session?.user?.email) return { jobs: [], totalJobs: 0 };

  const { user, totalJobs } = await getUserProfileData({
    email: session.user.email,
    page,
    limit,
  });

  return { jobs: user?.jobs ?? [], totalJobs };
}