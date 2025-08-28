import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResumeTable() {
  return (
    <Table className="bg-[var(--background)]">
      <TableHeader>
        <TableRow>
          <TableHead>Resume</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
