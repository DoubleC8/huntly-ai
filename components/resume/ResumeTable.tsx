import { Resume } from "@/app/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDistanceToNow as formatFn } from "date-fns";
import DeleteResumeButton from "./DeleteResumeButton";

export default function ResumeTable({ resumes }: { resumes: Resume[] }) {
  return (
    <Table
      className="
    bg-[var(--app-blue)] rounded-2xl"
    >
      <TableHeader>
        <TableRow className="hover:!bg-transparent">
          <TableHead className="text-[var(--background)]">Resume</TableHead>
          <TableHead className="text-[var(--background)]">Link</TableHead>
          <TableHead className="text-[var(--background)]">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-[var(--background)]">
        {resumes.map((resume) => (
          <TableRow key={resume.id} className="font-semibold">
            <TableCell>{resume.fileName.split(".")[0]}</TableCell>
            <TableCell className="hover:text-[var(--app-blue)]">
              <Link href={resume.publicUrl}>Go to Resume</Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatFn(resume.createdAt, { addSuffix: true })}
            </TableCell>
            <TableCell>
              <DeleteResumeButton resume={resume} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
