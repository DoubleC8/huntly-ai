import { Frown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

export default function DashboardCard({
  message,
  description,
}: {
  message: string;
  description: string;
}) {
  return (
    <div className="pageContainer justify-center">
      <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
        <CardContent className="flex flex-col items-center gap-3">
          <Frown />
          <p>{message}</p>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Link
            href="/jobs/resume"
            className="lg:w-1/2 
          w-3/4 mx-auto"
          >
            <Button className="w-full">Go to Recommended Jobs</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
