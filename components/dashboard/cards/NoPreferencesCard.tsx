import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Frown } from "lucide-react";

export function NoPreferencesCard() {
  return (
    <div className="my-auto">
      <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
        <CardContent className="flex flex-col items-center gap-3">
          <Frown className="text-[var(--app-blue)]" />
          <p>No job preferences set up yet</p>
          <CardDescription>
            {" "}
            Add your resume, then add job preferences to your profile to start
            seeing results!
          </CardDescription>
        </CardContent>
        <CardFooter className="mx-auto">
          <Link href="/jobs/profile" className="mx-auto">
            <Button className="w-full text-white">Go to Profile</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
