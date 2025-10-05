// app/constants/jobStage.ts

import { JobStage } from "@/app/generated/prisma";
import { CircleCheck, CircleUserRound, Dot, PartyPopper, Star, Trash2 } from "lucide-react";

export const STAGE_COLORS: Record<JobStage, string> = {
  DEFAULT: "--muted-foreground",
  WISHLIST: "--app-purple",
  APPLIED: "--app-dark-purple",
  INTERVIEW: "--app-blue",
  OFFER: "--app-light-blue",
  REJECTED: "--app-red",
};

export const STAGE_LABELS: Record<JobStage, string> = {
  DEFAULT: "Default",
  WISHLIST: "Wishlisted",
  APPLIED: "Applied",
  INTERVIEW: "Interviewing",
  OFFER: "Offered a Position",
  REJECTED: "Rejected",
};

export const STAGE_ICONS: Record<JobStage, React.ComponentType<{ className?: string }>> = {
  DEFAULT: Dot,
  WISHLIST: Star,
  APPLIED: CircleCheck,
  INTERVIEW: CircleUserRound,
  OFFER: PartyPopper,
  REJECTED: Trash2,
}

export const STAGE_ORDER: JobStage[] = [
  JobStage.DEFAULT,
  JobStage.WISHLIST,
  JobStage.APPLIED,
  JobStage.INTERVIEW,
  JobStage.OFFER,
  JobStage.REJECTED,
];