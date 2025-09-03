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
import { Frown } from "lucide-react";

export default function ResumeTable({
  resumes,
  refresh,
}: {
  resumes: Resume[];
  refresh?: () => void;
}) {
  return (
    <Table className="mx-auto rounded-t-2xl">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold text-[var(--background)] bg-[var(--app-blue)] rounded-tl-2xl">
            <p className="py-3">Resume</p>
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
        {resumes.map((resume, index) => {
          const isLast = index === resumes.length - 1;

          return (
            <TableRow key={resume.id} className="font-semibold">
              <TableCell className={isLast ? "rounded-bl-2xl" : ""}>
                {resume.fileName.split(".")[0]}
              </TableCell>
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
                <DeleteResumeButton resume={resume} refresh={refresh} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
