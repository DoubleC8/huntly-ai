import { auth } from "@/auth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Clock, ThumbsUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  //extra security, we have middleware but this is just incase it doesnt work for some reason
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  return (
    <div className="p-3 h-screen bg-[var(--card)] md:bg-[var(--background)]">
      <div
        className="md:hidden
      flex justify-start"
      >
        <Select>
          <SelectTrigger className="bg-[var(--background)] min-w-[50%]">
            <SelectValue placeholder="Select Category" />
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
      </div>

      <div className="hidden md:flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold tracking-wider">Jobs</h1>
        {/* Grid, charts, cards, or categorized job sections here */}
      </div>
    </div>
  );
}
