"use server";

import { JobStage } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

//
// ─── BASIC JOB QUERIES ─────────────────────────────────────────────
//

// Find a single job by ID
export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: { id },
  });
}

// Get all jobs for a specific user
export async function getJobsByUserId(userId: string) {
  return prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// Get jobs filtered by stage (e.g. APPLIED, INTERVIEW, OFFER)
export async function getJobsByStage(userId: string, stage: JobStage) {
  return prisma.job.findMany({
    where: {
      userId,
      stage,
    },
    orderBy: { createdAt: "desc" },
  });
}

//
// ─── ADVANCED SEARCH ─────────────────────────────────────────────
//

// Unified search function that safely handles optional filters and pagination
export async function searchJobs({
  userId,
  searchQuery = "",
  locationQuery = "",
  employment,
  remoteType,
  salaryMin,
}: {
  userId: string;
  searchQuery?: string;
  locationQuery?: string;
  employment?: string;
  remoteType?: string;
  salaryMin?: number;
  page?: number;
  limit?: number;
}) {
  return prisma.job.findMany({
    where: {
      userId,
      stage: JobStage.DEFAULT,
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { company: { contains: searchQuery, mode: "insensitive" } },
          { aiSummary: { contains: searchQuery, mode: "insensitive" } },
        ],
      }),
      ...(locationQuery && {
        location: { contains: locationQuery, mode: "insensitive" },
      }),
      ...(employment && { employment }),
      ...(remoteType && { remoteType }),
      ...(salaryMin && { salaryMin: { gte: salaryMin } }),
    },
    orderBy: { postedAt: "desc" },
  });
}

//
// ─── COUNT HELPER FOR PAGINATION ─────────────────────────────────────────────
//

export async function countSearchJobs({
  userId,
  searchQuery = "",
  locationQuery = "",
  employment,
  remoteType,
  salaryMin,
}: {
  userId: string;
  searchQuery?: string;
  locationQuery?: string;
  employment?: string;
  remoteType?: string;
  salaryMin?: number;
}) {
  return prisma.job.count({
    where: {
      userId,
      stage: JobStage.DEFAULT,
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { company: { contains: searchQuery, mode: "insensitive" } },
          { aiSummary: { contains: searchQuery, mode: "insensitive" } },
        ],
      }),
      ...(locationQuery && {
        location: { contains: locationQuery, mode: "insensitive" },
      }),
      ...(employment && { employment }),
      ...(remoteType && { remoteType }),
      ...(salaryMin && { salaryMin: { gte: salaryMin } }),
    },
  });
}