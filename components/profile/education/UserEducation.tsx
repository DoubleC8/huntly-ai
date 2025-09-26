import { Education } from "@/app/generated/prisma";
import UserEducationSideBar from "./UserEducationSideBar";
import Link from "next/link";
import { PenSquare, School } from "lucide-react";
import { format } from "date-fns";
import DeleteEducationEntry from "./DeleteEducationEntry";
import { UserEducationCard } from "./UserEducationCard";

export default function UserEducation({
  education,
}: {
  education: Education[];
}) {
  return (
    <div className="h-fit flex flex-col gap-5">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-xl">Education</h2>
        <UserEducationSideBar />
      </div>

      <div className="flex flex-col gap-2 flex-wrap">
        {education.length ? (
          education.map((edu) => (
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
