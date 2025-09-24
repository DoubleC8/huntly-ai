import { User, Education } from "@/app/generated/prisma";
import UserEducationSideBar from "./UserEducationSideBar";
import Link from "next/link";

type UserWithEducation = User & {
  education: Education[];
};

export default function UserEducation({ user }: { user: UserWithEducation }) {
  return (
    <div className="h-fit flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-bold text-xl">Education</h2>
          <UserEducationSideBar user={user} />
        </div>

        <div className="w-3/4 flex gap-2 flex-wrap">
          {user.education.length ? (
            user.education.map((edu, index) => {
              return (
                <div key={edu.id} className="border-b pb-2">
                  <p className="font-semibold">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.degree} {edu.major && `• ${edu.major}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-muted-foreground">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              );
            })
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
    </div>
  );
}
