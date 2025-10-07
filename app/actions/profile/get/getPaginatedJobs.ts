"use server";

import { auth } from "@/auth";
import { getUserProfileWithPaginatedJobs } from "@/lib/queries/userQueries";

export async function getPaginatedJobsAction(page: number, limit: number) {
  const session = await auth();
  if (!session?.user?.email) return { jobs: [], totalJobs: 0 };

  const { user, totalJobs } = await getUserProfileWithPaginatedJobs({
    email: session.user.email,
    page,
    limit,
  });

  return { jobs: user?.jobs ?? [], totalJobs };
}