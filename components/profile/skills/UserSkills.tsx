import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import UserSkillsSidebar from "./UserSkillsSidebar";

import { formatEntry } from "@/lib/utils";
import DeleteUserFieldButton from "../buttons/DeleteUserFieldButton";

export default function UserSkills({ skills }: { skills: string[] }) {
  return (
    <div className="h-fit flex flex-col gap-3">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-xl">Skills</h2>
        <UserSkillsSidebar />
      </div>

      <div className="w-3/4 flex gap-2 flex-wrap">
        {skills.length ? (
          skills.map((skill, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Badge className="flex font-semibold items-center text-white bg-[var(--app-dark-purple)] gap-3">
                {formatEntry(skill)}
                <DeleteUserFieldButton field="skills" value={skill} />
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">
            Your skills section is empty. Add entries manually or upload a
            resume and let{" "}
            <strong className="text-[var(--app-blue)]">Huntly Ai</strong> assess
            your skills! <br />
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
