import Image from "next/image";
import { Building, Clock, MapPin } from "lucide-react";
import { ResumeMatchScore } from "../charts/ResumeMatchScore";
import { formatDistanceToNow as formatFn } from "date-fns";

export default function JobPageHeader({
  jobTitle,
  jobCompany,
  jobPostedAt,
  jobCreatedAt,
  jobAiSummary,
  jobLocation,
  jobEmployment,
  jobRemoteType,
}: {
  jobTitle: string;
  jobCompany: string;
  jobPostedAt: Date;
  jobCreatedAt: Date;
  jobAiSummary: string;
  jobLocation: string;
  jobEmployment: string;
  jobRemoteType: string;
}) {
  return (
    <div
      className="md:min-h-[20vh] md:max-h-fit md:flex-row md:justify-between md:gap-0 items-center
        flex flex-col gap-3 justify-between"
    >
      <div
        className="md:w-3/4
          flex flex-col gap-3 "
      >
        <div className="flex items-center gap-3">
          <a target="_blank" href="https://logo.dev" rel="noopener noreferrer">
            <Image
              src={`https://img.logo.dev/${jobCompany}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`}
              width={75}
              height={75}
              alt="Logo API"
              className="rounded-lg"
            />
          </a>

          {jobPostedAt ? (
            <p className="font-semibold">
              {jobCompany} •{" "}
              <span className="text-muted-foreground">
                {formatFn(new Date(jobPostedAt), {
                  addSuffix: true,
                })}
              </span>
            </p>
          ) : (
            <p>
              {jobCompany} •{" "}
              <span className="text-muted-foreground">
                {formatFn(new Date(jobCreatedAt), {
                  addSuffix: true,
                })}
              </span>
            </p>
          )}
        </div>
        <div
          className="md:items-start
            h-full flex flex-col  gap-3 justify-between"
        >
          <h1 className="font-bold text-2xl">{jobTitle}</h1>
          <div className="flex flex-col gap-1">
            {jobAiSummary ? (
              <>
                <p className="font-semibold">{jobAiSummary}</p>
                <p className="text-muted-foreground">(Ai Summary)</p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Our AI is still sharpening its resume writing skills. Check back
                soon!
              </p>
            )}
          </div>

          <div className="flex gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <p>{jobLocation}</p>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <p>{jobEmployment}</p>
            </div>
            <div className="flex items-center gap-1">
              <Building size={14} />
              <p>{jobRemoteType}</p>
            </div>
          </div>
        </div>
      </div>
      <ResumeMatchScore />
    </div>
  );
}
