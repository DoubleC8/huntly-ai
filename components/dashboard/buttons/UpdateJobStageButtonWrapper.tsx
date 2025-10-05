"use client";
import { LucideIcon } from "lucide-react";
import UpdateJobStageButton from "./UpdateJobStageButton";

interface UpdateJobStageButtonWrapperProps {
  jobTitle: string;
  jobCompany: string;
  jobId: string;
  jobStage: any; // JobStage type
  compact?: boolean;
  targetJobStage?: any; // JobStage type
  Icon: LucideIcon;
  iconSize?: string;
  iconClassName?: string;
}

export default function UpdateJobStageButtonWrapper({
  Icon,
  ...props
}: UpdateJobStageButtonWrapperProps) {
  // Convert the icon component to its name
  const iconName = Icon.displayName || Icon.name || "CheckCircle";

  return <UpdateJobStageButton {...props} iconName={iconName} />;
}

