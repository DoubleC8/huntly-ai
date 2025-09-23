import { User } from "@/app/generated/prisma";
import { SquarePen } from "lucide-react";
import { Badge } from "../../ui/badge";
import UserInfoSideBar from "./UserInfoSideBar";

export default function UserInfo({ user }: { user: User }) {
  const userFields: { label: string; value: string | null }[] = [
    { label: "Email", value: user.email },
    { label: "GitHub", value: user.githubUrl },
    { label: "LinkedIn", value: user.linkedInUrl },
    { label: "Portfolio", value: user.portfolioUrl },
    { label: "Phone", value: user.phoneNumber },
    { label: "City", value: user.city },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-bold text-xl">{user.name}</h2>
          <UserInfoSideBar />
        </div>

        <div className="w-1/2">
          {userFields.map(
            (field, i) =>
              field.value && (
                <Badge key={i} title={field.label}>
                  {field.value}
                </Badge>
              )
          )}
        </div>
      </div>
    </div>
  );
}
