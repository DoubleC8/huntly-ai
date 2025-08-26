"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, PartyPopper, Star, UserCircle } from "lucide-react";
import { JobStage } from "@/app/generated/prisma";

export default function StageFilterSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("stage", value);
    } else {
      params.delete("stage");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Select
        name="stage"
        defaultValue={searchParams.get("stage") ?? undefined}
        onValueChange={handleChange}
      >
        <SelectTrigger className="bg-[var(--background)] h-9">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={JobStage.WISHLIST}>
              <Star color="var(--app-purple)" /> Wishlisted
            </SelectItem>
            <SelectItem value={JobStage.APPLIED}>
              <BadgeCheck color="var(--app-dark-purple)" /> Applied
            </SelectItem>
            <SelectItem value={JobStage.INTERVIEW}>
              <UserCircle color="var(--app-blue)" /> Interviewing
            </SelectItem>
            <SelectItem value={JobStage.OFFER}>
              <PartyPopper color="var(--app-light-blue)" /> Offered a Position
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
