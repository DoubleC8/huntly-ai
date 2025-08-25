// app/constants/jobStage.ts

import { JobStage } from "@/app/generated/prisma";

export const STAGE_COLORS: Record<JobStage, string> = {
  WISHLIST: "--app-purple",
  APPLIED: "--app-dark-purple",
  INTERVIEW: "--app-blue",
  OFFER: "--app-light-blue",
  REJECTED: "--app-red",
};

export const STAGE_LABELS: Record<JobStage, string> = {
  WISHLIST: "Wishlisted",
  APPLIED: "Applied",
  INTERVIEW: "Interviewing",
  OFFER: "Offered a Position",
  REJECTED: "Rejected",
};

export const STAGE_ORDER: JobStage[] = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
];