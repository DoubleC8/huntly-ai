import { CircleCheck, CircleUserRound, PartyPopper, Star } from "lucide-react";
import JobColumn from "./JobColumn";

export default function AppTrackerColumnContainer() {
  return (
    <div
      className="lg:flex-row lg:justify-between lg:gap-0 lg:h-fit
          w-full h-screen flex flex-col gap-3"
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
        description="Congrats! Copmpanies that have offered you a position will appear here. Time to celebrate!"
      />
    </div>
  );
}
