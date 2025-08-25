import {
  BadgeCheck,
  Clock,
  Ellipsis,
  ListFilter,
  Search,
  ThumbsUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

export default function DashboardMobileNavbar() {
  return (
    <div className="mobileAppPageNav">
      <div className="flex gap-1">
        <Input
          type="url"
          placeholder="Search for a Job"
          className="bg-[var(--background)] h-9"
        />
        <Button>
          <Search />
        </Button>
      </div>
      <div className="flex gap-1">
        <Select>
          <SelectTrigger className="bg-[var(--background)] h-9">
            <SelectValue placeholder={<Ellipsis />} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="recommended">
                <ThumbsUp />
                Recommended
              </SelectItem>
              <SelectItem value="top matched">
                <BadgeCheck />
                Top Matched
              </SelectItem>
              <SelectItem value="most recent">
                <Clock />
                Most Recent
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>
          <ListFilter />
        </Button>
      </div>
    </div>
  );
}
