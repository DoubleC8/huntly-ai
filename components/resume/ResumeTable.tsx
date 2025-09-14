"use client";

import { Resume } from "@/app/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow as formatFn } from "date-fns";
import DeleteResumeButton from "./DeleteResumeButton";
import { Star } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ResumeTable({
  resumes,
  setResumes,
}: {
  resumes: Resume[];
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>;
}) {
  const [isPending, startTransition] = useTransition();
  const localResumes = resumes;

  const handleSetDefaultResume = async (resumeId: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
        });

        if (!res.ok) {
          toast.error("Failed to set default resume.", {
            description: await res.text(),
          });
          return;
        }

        setResumes((prev) =>
          prev.map((resume) => ({
            ...resume,
            isDefault: resume.id === resumeId,
          }))
        );

        toast.success("Default Resume Updated!", {
          description: "Let the job hunt magic begin.",
        });
      } catch (error) {
        console.error("Error setting default resume:", error);
        toast.error("Failed to set default resume.");
      }
    });
  };

  return (
    <Table className="mx-auto rounded-t-2xl">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold text-[var(--background)] bg-[var(--app-blue)] rounded-tl-2xl">
            <p className="py-3">Resume</p>
          </TableHead>
          <TableHead className="text-left font-semibold text-[var(--background)] bg-[var(--app-blue)]">
            Target Job Title
          </TableHead>
          <TableHead className="text-left font-semibold text-[var(--background)] bg-[var(--app-blue)]">
            Link
          </TableHead>
          <TableHead
            className="md:table-cell md:text-center
          hidden font-semibold text-left text-[var(--background)] bg-[var(--app-blue)]"
          >
            Created
          </TableHead>
          <TableHead className="font-semibold text-left bg-[var(--app-blue)] rounded-tr-2xl"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-[var(--background)] !h-14">
        {localResumes
          .sort(
            (a: Resume, b: Resume) =>
              (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
          )
          .map((resume, index) => {
            console.log(resume.targetJobTitle);
            const isLast = index === resumes.length - 1;
            return (
              <TableRow key={resume.id} className="font-semibold">
                {/**resume name */}
                <TableCell className={isLast ? "rounded-bl-2xl" : ""}>
                  <div className="flex items-center gap-3">
                    <button
                      className="hover:cursor-pointer disabled:cursor-not-allowed"
                      onClick={() => handleSetDefaultResume(resume.id)}
                      disabled={isPending || resume.isDefault}
                      title={
                        resume.isDefault
                          ? "Already default"
                          : "Set as default resume"
                      }
                    >
                      {resume.isDefault ? (
                        <Star
                          fill="yellow"
                          className="text-[var(--app-yellow)]"
                        />
                      ) : (
                        <Star className="hover:text-[var(--app-yellow)]" />
                      )}
                    </button>
                    {resume.isDefault ? (
                      <p>
                        {resume.fileName.split(".")[0]}{" "}
                        <span className="hidden md:inline-block text-[var(--app-blue)]">
                          (Default)
                        </span>
                      </p>
                    ) : (
                      <p>{resume.fileName.split(".")[0]}</p>
                    )}
                  </div>
                </TableCell>

                {/**resume target job title */}
                <TableCell className="hover:text-[var(--app-blue)]">
                  <p>{resume.targetJobTitle}</p>
                </TableCell>

                {/**link to resume */}
                <TableCell className="hover:text-[var(--app-blue)]">
                  <a
                    target="_blank"
                    href={resume.publicUrl}
                    rel="noopener noreferrer"
                  >
                    Go to Resume
                  </a>
                </TableCell>

                <TableCell
                  className={`
            md:table-cell md:text-center hidden text-muted-foreground
          `}
                >
                  {formatFn(resume.createdAt, { addSuffix: true })}
                </TableCell>
                <TableCell className={isLast ? "rounded-br-2xl" : ""}>
                  <DeleteResumeButton resume={resume} setResumes={setResumes} />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
