import { User } from "@/app/generated/prisma";
import { Badge } from "../../ui/badge";
import UserInfoSideBar from "./UserInfoSideBar";
import {
  BriefcaseBusiness,
  Building2,
  LucideIcon,
  Mail,
  PanelTop,
  Phone,
  GitBranch,
} from "lucide-react";
import parsePhoneNumberFromString from "libphonenumber-js";

function formatPhoneForDisplay(phone: string): string {
  const phoneNumber = parsePhoneNumberFromString(phone);
  return phoneNumber ? phoneNumber.formatInternational() : phone;
}

export default function UserInfo({ user }: { user: User }) {
  const userFields: {
    label: string;
    value: string | null;
    icon: LucideIcon;
  }[] = [
    { label: "Email", value: user.email, icon: Mail },
    { label: "GitHub", value: user.githubUrl, icon: GitBranch },
    { label: "LinkedIn", value: user.linkedInUrl, icon: BriefcaseBusiness },
    { label: "Portfolio", value: user.portfolioUrl, icon: PanelTop },
    {
      label: "Phone",
      value: user.phoneNumber ? formatPhoneForDisplay(user.phoneNumber) : null,
      icon: Phone,
    },
    { label: "City", value: user.city, icon: Building2 },
  ];
  return (
    <div className="h-fit flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-bold text-xl">{user.name}</h2>
          <UserInfoSideBar user={user} />
        </div>

        <div className="w-3/4 flex gap-2 flex-wrap">
          {userFields.map(
            (field, i) =>
              field.value && (
                <Badge key={i} title={field.label}>
                  <field.icon />
                  <span className="text-[var(--app-blue)]">{field.value}</span>
                </Badge>
              )
          )}
        </div>
      </div>
    </div>
  );
}
