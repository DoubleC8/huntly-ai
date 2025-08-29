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

export default function ResumeTable({ resumes }: { resumes: Resume[] }) {
  return (
    <Table className="bg-[var(--background)] rounded-2xl">
      <TableHeader>
        <TableRow className="border-red-500 py-5">
          <TableHead>Resume</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Uploaded</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes.map((resume) => (
          <TableRow key={resume.id}>
            <TableCell>{resume.fileName.split(".")[0]}</TableCell>
            <TableCell className="hover:text-[var(--blue)]">
              <Link href={resume.publicUrl}>Link</Link>
            </TableCell>
            <TableCell>{resume.createdAt.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
