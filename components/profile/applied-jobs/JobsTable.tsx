import { STAGE_COLORS } from "@/app/constants/jobStage";
import { Job } from "@/app/generated/prisma";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function JobsTable({ jobs }: { jobs: Job[] }) {
  return (
    <Table className="mx-auto rounded-t-2xl">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold text-[var(--background)] bg-[var(--app-blue)] rounded-tl-2xl">
            <p className="py-3">Company</p>
          </TableHead>

          <TableHead className="md:table-cell hidden font-semibold text-left text-[var(--background)] bg-[var(--app-blue)]">
            Job Title
          </TableHead>

          <TableHead className="md:table-cell hidden text-left font-semibold text-[var(--background)] bg-[var(--app-blue)]">
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
                <div className="flex items-center gap-3">
                  <a
                    target="_blank"
                    href="https://logo.dev"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={`https://img.logo.dev/${job.company}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
                      width={35}
                      height={35}
                      alt="Logo API"
                      className="rounded-lg"
                    />
                  </a>
                  <div>
                    <p>{job.company}</p>
                    <p className="text-muted-foreground block md:hidden">
                      {job.title}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="md:table-cell hidden">
                <a
                  target="_blank"
                  href={job.sourceUrl}
                  rel="noopener noreferrer"
                  className="ease-in-out duration-200 hover:cursor-pointer hover:text-[var(--app-blue)]"
                >
                  {job.title}
                </a>
              </TableCell>
              <TableCell className="md:table-cell hidden text-left">
                {job.location}
              </TableCell>
              <TableCell
                className={
                  isLast ? "rounded-br-2xl text-center" : "text-center"
                }
              >
                {job.stage ? (
                  <p style={{ color: `var(${STAGE_COLORS[job.stage]})` }}>
                    {job.stage}
                  </p>
                ) : null}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
