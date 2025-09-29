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
import { ExternalLink, HeartCrack, Star } from "lucide-react";
import TargetJobTitle from "./TargetJobTitle";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import AddResumeButton from "./AddResumeButton";
import ResumeNavbar from "./ResumeNavbar";

export default function ResumeTable({
  resumes,
  email,
}: {
  resumes: Resume[];
  email: string;
}) {
  if (resumes.length === 0) {
    return (
      <div className="my-auto">
        <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
          <CardContent className="flex flex-col items-center gap-3">
            <HeartCrack />
            <p>No resumes uploaded yet</p>
            <CardDescription>
              Upload a resume to start applying for jobs and tracking your
              progress.
            </CardDescription>
          </CardContent>
          <CardFooter className="mx-auto">
            <AddResumeButton resumeCount={resumes.length} email={email} />
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div className="h-fit flex flex-col gap-3">
      <ResumeNavbar resumeCount={resumes.length} email={email} />
      <Table className="mx-auto rounded-t-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-[var(--background)] bg-[var(--app-blue)] rounded-tl-2xl">
              <p className="py-3">Resume</p>
            </TableHead>

            <TableHead className="md:table-cell hidden font-semibold text-left text-[var(--background)] bg-[var(--app-blue)]">
              Target Job Title
            </TableHead>

            <TableHead className="text-end font-semibold text-[var(--background)] bg-[var(--app-blue)]">
              Link
            </TableHead>

            <TableHead className="lg:table-cell hidden font-semibold text-center text-[var(--background)] bg-[var(--app-blue)]">
              Created
            </TableHead>

            <TableHead className="font-semibold text-left bg-[var(--app-blue)] rounded-tr-2xl" />
          </TableRow>
        </TableHeader>

        <TableBody className="bg-[var(--background)] !h-14">
          {resumes
            .sort(
              (a: Resume, b: Resume) =>
                (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
            )
            .map((resume, index) => {
              const isLast = index === resumes.length - 1;
              return (
                <TableRow key={resume.id} className="font-semibold">
                  {/* Resume name + star */}
                  <TableCell className={isLast ? "rounded-bl-2xl" : ""}>
                    <div className="flex items-center gap-3">
                      <button
                        className="hover:cursor-pointer disabled:cursor-not-allowed"
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

                  {/* Target Job Title */}
                  <TableCell className="md:table-cell hidden text-muted-foreground">
                    <TargetJobTitle
                      resumeJobTitle={resume.targetJobTitle ?? ""}
                      resumeId={resume.id}
                    />
                  </TableCell>

                  {/* Resume Link */}
                  <TableCell className="hover:text-[var(--app-blue)] text-muted-foreground">
                    <a
                      target="_blank"
                      href={resume.publicUrl}
                      rel="noopener noreferrer"
                      className="flex items-center justify-end"
                    >
                      <ExternalLink className="hover:cursor-pointer ease-in-out duration-200" />
                    </a>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="lg:table-cell hidden md:text-center text-muted-foreground">
                    {formatFn(resume.createdAt, { addSuffix: true })}
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell className={isLast ? "rounded-br-2xl" : ""}>
                    <div
                      className="md:justify-center
                  w-full flex items-end justify-end"
                    >
                      <DeleteResumeButton resume={resume} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
