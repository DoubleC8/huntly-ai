import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Smile } from "lucide-react";

export function NoPreferencesCard() {
  return (
    <div className="my-auto">
      <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <Smile className="text-[var(--app-blue)]" size={32} />
          <p className="font-medium text-lg">
            Welcome to{" "}
            <strong className="text-[var(--app-blue)]">Huntly Ai</strong>
          </p>
          <CardDescription>
            Let’s get started, upload your{" "}
            <strong className="text-[var(--app-blue)]">Resume</strong> first,
            then set your{" "}
            <strong className="text-[var(--app-blue)]">Job Preferences</strong>{" "}
            to start seeing personalized job matches.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 w-1/2 mx-auto">
          <Link href="/jobs/resume" className="w-full">
            <Button className="w-full">Add Your Resume</Button>
          </Link>
          <Link href="/jobs/profile" className="w-full">
            <Button variant="outline" className="w-full">
              Set Job Preferences
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
