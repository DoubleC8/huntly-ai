import { Education } from "@/app/generated/prisma";

import Link from "next/link";
import { UserEducationCard } from "./UserEducationCard";
import UserEducationSidebar from "./UserEducationSidebar";

export default function UserEducation({
  education,
}: {
  education: Education[];
}) {
  const sortedEducation: Education[] = [...education].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : null;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : null;

    if (dateA === null && dateB === null) return 0;
    if (dateA === null) return 1;
    if (dateB === null) return -1;
    return dateA - dateB; // Changed to descending order (most recent first)
  });
  return (
    <div className="h-fit flex flex-col gap-3">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-xl">Education</h2>
        <UserEducationSidebar />
      </div>

      <div className="flex flex-col gap-3 flex-wrap">
        {sortedEducation.length ? (
          sortedEducation.map((edu) => (
            <UserEducationCard education={edu} key={edu.id} />
          ))
        ) : (
          <p className="text-muted-foreground">
            Your education section is empty. Add entries manually or upload a
            resume and let{" "}
            <strong className="text-[var(--app-blue)]">Huntly Ai</strong> fill
            this out for you! <br />
            Go to{" "}
            <Link
              href={"/jobs/resume"}
              className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]"
            >
              Resume Page
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
