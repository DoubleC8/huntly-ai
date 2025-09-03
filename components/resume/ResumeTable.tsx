import { Resume } from "@/app/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow as formatFn } from "date-fns";
import DeleteResumeButton from "./DeleteResumeButton";

export default function ResumeTable({
  resumes,
  refresh,
}: {
  resumes: Resume[];
  refresh?: () => void;
}) {
  return (
    <Table className="mx-auto !bg-[var(--background)]">
      <TableHeader>
        <TableRow className="bg-[var(--app-blue)]">
          <TableHead className="text-[var(--background)] font-semibold rounded-tl-lg">
            Resume
          </TableHead>
          <TableHead
            className="
           text-[var(--background)] text-left font-semibold"
          >
            Link
          </TableHead>
          <TableHead
            className="md:table-cell md:text-center
          hidden text-[var(--background)] font-semibold text-left"
          >
            Created
          </TableHead>
          <TableHead className="text-[var(--background)] font-semibold text-left rounded-tr-lg"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="!overflow-x-auto">
        {resumes.map((resume) => (
          <TableRow key={resume.id} className="font-semibold">
            <TableCell>{resume.fileName.split(".")[0]}</TableCell>
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
              className="md:table-cell md:text-center
            hidden text-muted-foreground"
            >
              {formatFn(resume.createdAt, { addSuffix: true })}
            </TableCell>
            <TableCell>
              <DeleteResumeButton resume={resume} refresh={refresh} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
