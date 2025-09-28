import { Badge } from "@/components/ui/badge";
import UserJobPreferencesSidebar from "./UserJobPreferencesSidebar";
import DeleteJobPrefence from "./DeleteJobPreference";
import { formatEntry } from "@/lib/utils";

export default function UserJobPreferences({
  jobPreferences,
}: {
  jobPreferences: string[];
}) {
  return (
    <div className="h-fit flex flex-col gap-3">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-xl">Job Preferences</h2>
        <UserJobPreferencesSidebar />
      </div>

      <div className="w-3/4 flex gap-2 flex-wrap">
        {jobPreferences.length ? (
          jobPreferences.map((job, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Badge className="flex font-semibold items-center text-[var(--background)] bg-[var(--app-light-blue)] gap-3">
                {formatEntry(job)}
                <DeleteJobPrefence preference={job} />
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">
            No job preferences set yet. Add some job titles you would be
            interested in and let{" "}
            <strong className="text-[var(--app-blue)]">Huntly Ai</strong> find
            jobs based on these titles!
          </p>
        )}
      </div>
    </div>
  );
}
