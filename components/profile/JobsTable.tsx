import { Job } from "@/app/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow as formatFn } from "date-fns";

export default function JobsTable({ jobs }: { jobs: Job[] }) {
  return (
    <Table className="mx-auto rounded-t-2xl">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold text-[var(--background)] bg-[var(--app-blue)] rounded-tl-2xl">
            <p className="py-3">Company Name</p>
          </TableHead>

          <TableHead className="md:table-cell hidden font-semibold text-left text-[var(--background)] bg-[var(--app-blue)]">
            Job Title
          </TableHead>

          <TableHead className="text-center font-semibold text-[var(--background)] bg-[var(--app-blue)]">
            Location
          </TableHead>

          <TableHead className="text-center font-semibold text-[var(--background)] bg-[var(--app-blue)] rounded-tr-2xl">
            Status{" "}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-[var(--card)] !h-14">
        {jobs.map((job, index) => {
          const isLast = index === jobs.length - 1;

          return (
            <TableRow key={job.id} className="font-semibold">
              <TableCell className={isLast ? "rounded-bl-2xl" : ""}>
                {job.company}
              </TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell className="text-center">{job.location}</TableCell>
              <TableCell
                className={
                  isLast ? "rounded-br-2xl text-center" : "text-center"
                }
              >
                {job.stage}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
