import { CircleCheck, CircleUserRound, PartyPopper, Star } from "lucide-react";
import JobColumn from "./JobColumn";
import { Job } from "@/app/generated/prisma";

export default function AppTrackerColumnContainer({
  wishlist,
  applied,
  interview,
  offered,
}: {
  wishlist: Job[];
  applied: Job[];
  interview: Job[];
  offered: Job[];
}) {
  return (
    <div
      className="lg:flex-row lg:justify-between lg:gap-0 lg:h-fit
          w-full h-screen flex flex-col gap-3"
    >
      <JobColumn
        jobs={wishlist}
        title="Wishlist"
        color="--app-purple"
        icon={Star}
        total_jobs={wishlist.length}
        description="Jobs you’re interested in but haven’t applied to yet. Start building your wishlist!"
      />
      <JobColumn
        jobs={applied}
        title="Applied"
        color="--app-dark-purple"
        icon={CircleCheck}
        total_jobs={applied.length}
        description="Track jobs you've submitted an application to. Try applying to one today!"
      />
      <JobColumn
        jobs={interview}
        title="Interview"
        color="--app-blue"
        icon={CircleUserRound}
        total_jobs={interview.length}
        description="Once you’ve landed an interview, it will show up here. Keep pushing!"
      />
      <JobColumn
        jobs={offered}
        title="Offered"
        color="--app-light-blue"
        icon={PartyPopper}
        total_jobs={offered.length}
        description="Congrats! Companies that have offered you a position will appear here. Time to celebrate!"
      />
    </div>
  );
}
