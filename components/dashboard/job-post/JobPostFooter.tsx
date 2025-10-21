import { Building, Clock, MapPin } from "lucide-react";
import AddNoteButton from "../buttons/AddNoteButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JobPostFooter({
  jobLocation,
  jobEmployment,
  jobRemoteType,
  jobId,
  jobNote,
}: {
  jobLocation: string;
  jobEmployment: string;
  jobRemoteType: string;
  jobId: string;
  jobNote: string;
}) {
  return (
    <div
      className="md:flex-row
        flex flex-col gap-3 items-center justify-between w-full"
    >
      {/**job info row */}
      <div
        className="md:w-1/2
          flex gap-3"
      >
        {/**TODO: Add feature to when the user clicks on the location, it gives me a rough
         * estimate of their commute
         */}
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <p>{jobLocation}</p>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <p>{jobEmployment}</p>
        </div>
        <div className="flex items-center gap-1">
          <Building size={14} />
          <p>{jobRemoteType}</p>
        </div>
      </div>

      {/**view job and view/edit note on desktop*/}
      <div
        className="md:flex md:flex-row md:justify-end md:w-1/2
          flex flex-col-reverse gap-2 w-full "
      >
        {/**add notes button */}
        <div
          className="md:w-1/2 lg:w-1/4
            w-full"
        >
          <AddNoteButton jobId={jobId} initialNote={jobNote || ""} />
        </div>
        {/** view job button */}
        <Link
          href={`/jobs/dashboard/job/${jobId}`}
          className="md:w-1/2 lg:w-1/4
            w-full"
        >
          <Button className="w-full">View Job</Button>
        </Link>
      </div>
    </div>
  );
}
