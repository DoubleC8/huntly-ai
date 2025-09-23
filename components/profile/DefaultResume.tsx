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
import { ExternalLink, Star } from "lucide-react";

export default function DefaultResume({ resume }: { resume: Resume }) {
  return (
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

          <TableHead className="lg:table-cell hidden font-semibold text-center text-[var(--background)] bg-[var(--app-blue)] rounded-tr-2xl">
            Created
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-[var(--card)] !h-14">
        <TableRow key={resume.id} className="font-semibold">
          {/* Resume name + star */}
          <TableCell className="rounded-bl-2xl">
            <div className="flex items-center gap-3">
              <Star fill="yellow" className="text-[var(--app-yellow)]" />
              <p>{resume.fileName.split(".")[0]}</p>
            </div>
          </TableCell>

          {/* Target Job Title */}
          <TableCell className="md:table-cell hidden text-muted-foreground">
            {resume.targetJobTitle ? (
              <p>{resume.targetJobTitle}</p>
            ) : (
              <p>No Target Job Title Set...</p>
            )}
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
        </TableRow>
      </TableBody>
    </Table>
  );
}
