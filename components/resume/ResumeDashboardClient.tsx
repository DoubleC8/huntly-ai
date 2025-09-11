"use client";

import { useEffect, useState } from "react";
import ResumeUploadClient from "./ResumeUploadClient";
import ResumeTable from "./ResumeTable";
import { Resume } from "@/app/generated/prisma";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import { HeartCrack } from "lucide-react";
import ResumeNavbar from "./ResumeNavbar";
import ErrorBoundary from "../ui/ErrorBoundary";

export default function ResumeDashboardClient({ email }: { email: string }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    const res = await fetch("/api/resumes");
    const data = await res.json();
    // Sort default resume to top
    setResumes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <ErrorBoundary>
      {!loading && resumes.length === 0 ? (
        <div className="my-auto">
          <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
            <CardContent className="flex flex-col items-center gap-3">
              <HeartCrack />
              <p>No resumes uploaded yet</p>
              <CardDescription>
                Upload a resume to start applying for jobs and tracking your
                progress.
              </CardDescription>
            </CardContent>
            <CardFooter className="mx-auto">
              <ResumeUploadClient
                email={email}
                resumeCount={resumes.length}
                setResumes={setResumes}
              />
            </CardFooter>
          </Card>
        </div>
      ) : (
        <>
          <ResumeNavbar
            email={email}
            resumeCount={resumes.length}
            setResumes={setResumes}
          />
          <div className="flex flex-col gap-3">
            <ResumeTable resumes={resumes} setResumes={setResumes} />
            <p className="text-muted-foreground text-center text-sm">
              Mark your star resume, and let Huntly work its AI magic.
            </p>
          </div>
        </>
      )}
    </ErrorBoundary>
  );
}
