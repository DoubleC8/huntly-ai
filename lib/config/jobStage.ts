import { JobStage } from "@/app/generated/prisma";
import { CircleCheck, CircleUserRound, Dot, PartyPopper, Star, Trash2 } from "lucide-react";

export const STAGES = [
  "DEFAULT",
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const satisfies JobStage[];

export const STAGE_ORDER: JobStage[] = [
  JobStage.APPLIED,
  JobStage.INTERVIEW,
  JobStage.OFFER,
];

export const STAGE_LABELS: Record<JobStage, string> = {
  DEFAULT: "Not Tracked",
  WISHLIST: "Wishlisted",
  APPLIED: "Applied",
  INTERVIEW: "Interviewing",
  OFFER: "Offered",
  REJECTED: "Rejected",
};

export const STAGE_COLORS: Record<JobStage, string> = {
  DEFAULT: "--muted-foreground",
  WISHLIST: "--app-yellow",
  APPLIED: "--app-dark-purple",
  INTERVIEW: "--app-blue",
  OFFER: "--app-light-blue",
  REJECTED: "--app-red",
};

export const STAGE_ICONS: Record<JobStage, React.ComponentType<{ className?: string }>> = {
  DEFAULT: Dot,
  WISHLIST: Star,
  APPLIED: CircleCheck,
  INTERVIEW: CircleUserRound,
  OFFER: PartyPopper,
  REJECTED: Trash2,
}

export const ALLOWED_TRANSITIONS: Record<JobStage, JobStage[]> = {
  DEFAULT: ["WISHLIST", "APPLIED"],
  WISHLIST: ["DEFAULT", "APPLIED"],
  APPLIED: STAGE_ORDER,         
  INTERVIEW: STAGE_ORDER,
  OFFER: STAGE_ORDER,           
  REJECTED: [],                   
};

export const STAGE_ROUTES: Partial<Record<JobStage, string>> = {
  WISHLIST: "/jobs/dashboard/stage/wishlist",
  APPLIED: "/jobs/dashboard/stage/applied",
  INTERVIEW: "/jobs/dashboard/stage/interview",
  OFFER: "/jobs/dashboard/stage/offer",
  REJECTED: "/jobs/dashboard/stage/rejected",
};

export const STAGE_MESSAGES: Record<JobStage, string> = {
  WISHLIST: "You have Wishlisted this Job.",
  APPLIED: "You have Applied for this Job.",
  INTERVIEW: "You are currently Interviewing for this Job.",
  OFFER: "You have have been offered a position at this company. Go Celebrate!", 
  REJECTED: "This job didn't work out. Keep pushing forward in your search!",
  DEFAULT: "Try applying to this job today!"
}