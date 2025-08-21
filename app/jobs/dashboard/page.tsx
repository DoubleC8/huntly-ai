import { auth } from "@/auth";
import RecommendedJobsContainer from "@/components/Recommended Jobs/RecommendedJobsContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BadgeCheck,
  Clock,
  Ellipsis,
  ListFilter,
  Search,
  ThumbsUp,
} from "lucide-react";

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
    <>
      <div className="page">
        <div className="mobileAppPageNav">
          <div className="flex gap-1">
            <Input
              type="url"
              placeholder="Search for Job"
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

        <div className="pageTitleContainer">
          <h1 className="pageTitle">Recommended Jobs</h1>
        </div>

        {/**This code below will hold the recommended jobs */}
        <RecommendedJobsContainer />
      </div>
    </>
  );
}
