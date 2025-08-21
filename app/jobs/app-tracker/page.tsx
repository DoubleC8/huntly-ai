import { auth } from "@/auth";
import JobColumn from "@/components/App Tracker/JobColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CircleCheck,
  CircleUserRound,
  ListFilter,
  PartyPopper,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

export default async function ApplicationTrackerPage() {
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
        {/**Hidden on mobile */}
        <div className="pageTitleContainer">
          <h1 className="pageTitle">Application Tracker</h1>
        </div>

        <div className="mobileAppPageNav">
          <div
            className="
          w-9/10 flex gap-2"
          >
            <Input
              type="url"
              placeholder="Add External Job Link"
              className="bg-[var(--background)] h-9 w-8/10"
            />
            <Button>
              <Plus />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button>
              <ListFilter />
            </Button>
            <Button variant="destructive">
              <Trash2 />
            </Button>
          </div>
        </div>

        {/**This code below will hold the recommended jobs */}
        <div className="pageContainer">
          {/**Hidden on mobile */}
          <div
            className="md:flex 
          w-full justify-between gap-5 hidden"
          >
            <div className="w-[75%] flex gap-2">
              <Input
                type="url"
                placeholder="Add External Job Link"
                className="bg-[var(--background)]  h-9"
              />
              <Button>
                Add Job
                <Plus />
              </Button>
            </div>
            <div className="flex gap-5">
              <Button>
                Filter
                <ListFilter />
              </Button>
              <Button variant="destructive">
                Trash
                <Trash2 />
              </Button>
            </div>
          </div>

          <div
            className="lg:flex-row lg:justify-between lg:gap-0 lg:h-fit
          w-full h-screen flex flex-col gap-5"
          >
            <JobColumn
              title="Wishlist"
              color="--app-purple"
              icon={Star}
              total_jobs={0}
              description="Jobs you’re interested in but haven’t applied to yet. Start building your wishlist!"
            />
            <JobColumn
              title="Applied"
              color="--app-dark-purple"
              icon={CircleCheck}
              total_jobs={0}
              description="Track jobs you've submitted an application to. Try applying to one today!"
            />
            <JobColumn
              title="Interviewed"
              color="--app-blue"
              icon={CircleUserRound}
              total_jobs={0}
              description="Once you’ve landed an interview, it will show up here. Keep pushing!"
            />
            <JobColumn
              title="Offered"
              color="--app-light-blue"
              icon={PartyPopper}
              total_jobs={0}
              description="Congrats! Copmpanies that have offered you a job will appear here. Time to celebrate!"
            />
          </div>
        </div>
      </div>
    </>
  );
}
