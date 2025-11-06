import { Badge } from "@/components/ui/badge";
import { formatEntry } from "@/lib/utils";
import { Crosshair, FileText, Lightbulb, ListTodo } from "lucide-react";

export default function JobPageDescription({
  jobDescription,
  jobResponsibilities,
  jobQualifications,
  jobSkills,
}: {
  jobDescription: string;
  jobResponsibilities: string[];
  jobQualifications: string[];
  jobSkills: string[];
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FileText className="text-[var(--app-blue)]" />
          <h1 className="font-bold text-2xl">Description</h1>
        </div>
        {jobDescription ? (
          <p>{jobDescription}</p>
        ) : (
          <p className="text-muted-foreground">
            Our AI is still hasnt gotten the jobs description, try checking back
            later!
          </p>
        )}
      </div>
      {/**reponsibilities */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ListTodo className="text-[var(--app-blue)]" />
          <h1 className="font-bold text-2xl">Responsibilites</h1>
        </div>
        {jobResponsibilities?.length ? (
          <ul className="list-disc ml-5 space-y-3">
            {jobResponsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Huntly-AI was unable to extract job Responsibilites.
          </p>
        )}
      </div>
      {/**qualifications */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Crosshair className="text-[var(--app-blue)]" />
          <h1 className="font-bold text-2xl">Qualifications</h1>
        </div>
        {jobQualifications?.length ? (
          <ul className="list-disc ml-5 space-y-3">
            {jobQualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Huntly-AI was unable to extract job Qualifications.
          </p>
        )}
      </div>
      {/**skills */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-[var(--app-blue)]" />
          <h1 className="font-bold text-2xl">Skills</h1>
        </div>
        {jobSkills?.length ? (
          <div className="flex gap-2">
            {jobSkills.map((skill, index) => (
              <Badge
                key={index}
                className="bg-[var(--app-dark-purple)] text-[var(--background)]"
              >
                {formatEntry(skill)}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Huntly-AI was unable to extract required job Skills.
          </p>
        )}
      </div>
    </>
  );
}
