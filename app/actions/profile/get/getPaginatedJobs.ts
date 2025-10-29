"use server";

import { getCurrentUserEmail } from "@/lib/auth-helpers";
import { getUserProfileData } from "./getUserInfo";


export async function getPaginatedJobs(page: number, limit: number) {
  const email = await getCurrentUserEmail();
  if (!email) return { jobs: [], totalJobs: 0 };

  const { user, totalJobs } = await getUserProfileData({
    email,
    page,
    limit,
  });

  return { jobs: user?.jobs ?? [], totalJobs };
}