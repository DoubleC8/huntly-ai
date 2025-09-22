"use client";

import { useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { X } from "lucide-react";
import { Badge } from "../ui/badge";

const JOB_TITLES = [
  "Software Engineer",
  "Frontend Software Engineer",
  "Backend Software Engineer",
  "Data Engineer",
  "Data Analyst",
  "Quantitative Analyst",
  "Product Manager",
];

export default function JobPreferences() {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const addJob = (job: string) => {
    if (!selectedJobs.includes(job)) {
      setSelectedJobs([...selectedJobs, job]);
    }
  };

  const removeJob = (job: string) => {
    setSelectedJobs(selectedJobs.filter((j) => j !== job));
  };

  return (
    <div className="w-full  mx-auto flex flex-col gap-4">
      {/* Searchable input */}
      <Command>
        <CommandInput placeholder="Search job titles..." />
        <CommandGroup>
          {JOB_TITLES.map((job) => (
            <CommandItem key={job} onSelect={() => addJob(job)}>
              {job}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>

      {/* Selected chips */}
      <div className="flex flex-wrap gap-2">
        {selectedJobs.map((job) => (
          <Badge key={job} className="flex items-center gap-1">
            {job}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeJob(job)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
