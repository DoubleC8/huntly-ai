import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { CircleX, Frown } from "lucide-react";

export function NoJobsErrorCard() {
  return (
    <div className="my-auto">
      <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
        <CardContent className="flex flex-col items-center gap-3">
          <CircleX className="text-[var(--app-red)]" />
          <p>An Unexpected Error Occured</p>
          <CardDescription> Could Not Load Jobs.</CardDescription>
        </CardContent>
        <CardFooter className="mx-auto">
          <Link href="/jobs/dashboard" className="mx-auto">
            <Button className="w-full text-white">Try Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
