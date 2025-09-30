import { Education } from "@/app/generated/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { School } from "lucide-react";
import DeleteEducationEntry from "./DeleteEducationEntry";
import { format } from "date-fns";
import UserEducationSidebar from "./UserEducationSidebar";

export function UserEducationCard({ education }: { education: Education }) {
  return (
    <Card className="w-full gap-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="text-[var(--app-blue)]" />
            <h1 className="md:font-bold md:text-lg">{education.school}</h1>{" "}
          </div>
          <div
            className="
          flex items-center gap-2"
          >
            <UserEducationSidebar education={education} />
            <DeleteEducationEntry education={education} />{" "}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground font-semibold w-full border-t-[1px] pt-1">
          <p>
            {education.degree} in{" "}
            <span className="text-[var(--app-blue)]">{education.major}</span>
          </p>
          <p>
            {" "}
            {education.startDate
              ? format(new Date(education.startDate), "MMMM yyyy")
              : "Start date not set"}{" "}
            -{" "}
            {education.onGoing
              ? "Present"
              : education.endDate
              ? format(new Date(education.endDate), "MMMM yyyy")
              : "End date not set"}
          </p>
          <p>
            Gpa: <span className="text-[var(--app-blue)]">{education.gpa}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
