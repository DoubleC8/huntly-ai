import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { HeartCrack } from "lucide-react";
import AddResumeButton from "../buttons/AddResumeButton";

export default function UploadResumeCard({
  resumeCount,
  email,
}: {
  resumeCount: number;
  email: string;
}) {
  return (
    <div className="my-auto">
      <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
        <CardContent className="flex flex-col items-center gap-3">
          <HeartCrack className="text-[var(--app-red)]" />
          <p>No resumes uploaded yet</p>
          <CardDescription>
            Upload a resume to start applying for jobs and tracking your
            progress.
          </CardDescription>
        </CardContent>
        <CardFooter className="mx-auto">
          <AddResumeButton resumeCount={resumeCount} email={email} />
        </CardFooter>
      </Card>
    </div>
  );
}
