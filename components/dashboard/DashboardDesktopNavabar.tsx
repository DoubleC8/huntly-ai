import { ListFilter, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Clock, ThumbsUp } from "lucide-react";

export default function DashboardDesktopNavbar() {
  return (
    <div className="md:flex w-full justify-between hidden">
      <div className="md:flex w-full justify-between gap-3 hidden">
        <div className="w-[75%] flex gap-2">
          <Input
            type="url"
            placeholder="Add External Job Link"
            className="bg-[var(--background)] h-9"
          />
          <Button>
            Search
            <Search />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="bg-[var(--background)] h-9">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recommended">
                  <ThumbsUp color="#1F51FF" /> Recommended
                </SelectItem>
                <SelectItem value="top matched">
                  <BadgeCheck color="#1F51FF" /> Top Matched
                </SelectItem>
                <SelectItem value="most recent">
                  <Clock color="#1F51FF" /> Most Recent
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            Filter
            <ListFilter />
          </Button>
        </div>
      </div>
    </div>
  );
}
