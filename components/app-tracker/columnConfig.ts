import { JobStage } from "@/app/generated/prisma";
import { CircleCheck, CircleUserRound, PartyPopper } from "lucide-react";

export interface ColumnConfig {
  id: JobStage;
  title: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const COLUMN_CONFIGS: ColumnConfig[] = [
  {
    id: JobStage.APPLIED,
    title: "Applied",
    color: "--app-dark-purple",
    icon: CircleCheck,
    description: "Track jobs you've submitted an application to.",
  },
  {
    id: JobStage.INTERVIEW,
    title: "Interview",
    color: "--app-blue",
    icon: CircleUserRound,
    description: "Once you've landed an interview, it will show up here.",
  },
  {
    id: JobStage.OFFER,
    title: "Offer",
    color: "--app-light-blue",
    icon: PartyPopper,
    description: "Congrats! Companies that have offered you a position will appear here.",
  },
];
