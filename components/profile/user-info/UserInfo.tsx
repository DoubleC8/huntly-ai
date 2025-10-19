import { User } from "@/app/generated/prisma";
import { Badge } from "../../ui/badge";
import {
  BriefcaseBusiness,
  Building2,
  LucideIcon,
  Mail,
  Phone,
  GitBranch,
  ExternalLink,
  UserRound,
} from "lucide-react";
import { formatPhoneForDisplay } from "@/lib/utils";
import UserInfoSidebar from "./UserInfoSidebar";
import DeleteUserFieldButton from "../buttons/DeleteUserFieldButton";
import { FieldType } from "@/app/actions/profile/delete/deleteUserProfileEntry";

export default function UserInfo({ user }: { user: User }) {
  const userFields: {
    label: string;
    fieldKey: FieldType;
    value: string | null;
    icon: LucideIcon;
    isLink: boolean;
  }[] = [
    {
      label: "Email",
      fieldKey: "email",
      value: user.email,
      icon: Mail,
      isLink: false,
    },
    {
      label: "GitHub",
      fieldKey: "githubUrl",
      value: user.githubUrl,
      icon: GitBranch,
      isLink: true,
    },
    {
      label: "LinkedIn",
      fieldKey: "linkedInUrl",
      value: user.linkedInUrl,
      icon: BriefcaseBusiness,
      isLink: true,
    },
    {
      label: "Portfolio",
      fieldKey: "portfolioUrl",
      value: user.portfolioUrl,
      icon: UserRound,
      isLink: true,
    },
    {
      label: "Phone",
      fieldKey: "phoneNumber",
      value: user.phoneNumber ? formatPhoneForDisplay(user.phoneNumber) : null,
      icon: Phone,
      isLink: false,
    },
    {
      label: "City",
      fieldKey: "city",
      value: user.city,
      icon: Building2,
      isLink: false,
    },
  ];
  return (
    <div className="h-fit flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-bold text-xl">{user.name}</h2>
          <UserInfoSidebar user={user} />
        </div>

        <div className="w-3/4 flex gap-2 flex-wrap">
          {userFields.map((field, i) => {
            if (!field.value) return null;

            return (
              <Badge
                key={i}
                title={field.label}
                className="flex items-center gap-1 pr-2"
              >
                <field.icon className="text-[var(--app-blue)]" size={16} />

                {field.isLink ? (
                  <>
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--app-blue)] ease-in-out duration-200 truncate max-w-[200px]"
                    >
                      {field.value}
                    </a>
                    <ExternalLink size={14} />
                  </>
                ) : (
                  <span>{field.value}</span>
                )}

                {field.fieldKey !== "email" && (
                  <DeleteUserFieldButton
                    field={field.fieldKey}
                    value={field.value}
                    isBlack={true}
                  />
                )}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
