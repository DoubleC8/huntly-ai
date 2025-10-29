import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Frown } from "lucide-react";
import Link from "next/link";

export async function NoResultsFound() {
  return (
    <div className="my-auto">
      <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
        <CardContent className="flex flex-col items-center gap-3">
          <Frown className="text-[var(--app-blue)]" />
          <p>No Jobs Matched your Search</p>
          <CardDescription>Try Refining your Seach!</CardDescription>
        </CardContent>
        <CardFooter className="mx-auto">
          <Link href="/jobs/dashboard" className="mx-auto">
            <Button className="w-full">Go Back</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
