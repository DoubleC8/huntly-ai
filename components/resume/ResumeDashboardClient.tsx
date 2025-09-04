"use client";

import { useEffect, useState } from "react";
import ResumeUploadClient from "./ResumeUploadClient";
import ResumeTable from "./ResumeTable";
import { Resume } from "@/app/generated/prisma";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import { HeartCrack } from "lucide-react";
import ResumeNavbar from "./ResumeNavbar";

export default function ResumeDashboardClient({ email }: { email: string }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    const res = await fetch("/api/resumes");
    const data = await res.json();
    setResumes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <>
      <ResumeNavbar
        email={email}
        resumeCount={resumes.length}
        onUploadSuccess={fetchResumes}
      />
      {resumes.length === 0 || (resumes.length === 0 && !loading) ? (
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
                onUploadSuccess={fetchResumes}
                resumeCount={resumes.length}
              />
            </CardFooter>
          </Card>
        </div>
      ) : (
        <ResumeTable resumes={resumes} refresh={fetchResumes} />
      )}
    </>
  );
}
