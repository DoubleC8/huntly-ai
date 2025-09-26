import { Education } from "@/app/generated/prisma";
import UserEducationSideBar from "./UserEducationSideBar";
import Link from "next/link";
import { PenSquare, School, Trash, Trash2 } from "lucide-react";
import { format } from "date-fns";
import DeleteEducationEntry from "./DeleteEducationEntry";

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
            <div key={edu.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <School className="text-[var(--app-blue)]" />
                  <h1 className="font-bold text-lg">{edu.school}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <PenSquare className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]" />
                  <DeleteEducationEntry education={edu} />
                </div>
              </div>
              <div
                className="
                border-t-[1px] border-gray-200 w-full font-semibold text-muted-foreground"
              >
                <p>
                  {edu.degree} in {edu.major}
                </p>
                <p>
                  {edu.startDate
                    ? format(new Date(edu.startDate), "MMMM yyyy")
                    : "Start date not set"}{" "}
                  -{" "}
                  {edu.onGoing
                    ? "Present"
                    : edu.endDate
                    ? format(new Date(edu.endDate), "MMMM yyyy")
                    : "End date not set"}
                </p>
                <p>{edu.gpa}</p>
              </div>
            </div>
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
