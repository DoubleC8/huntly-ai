"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { useState, useMemo } from "react";

// Extract company name from job title if company is unknown
function extractCompanyFromTitle(title: string): string | null {
  // Try to find company name patterns in title
  const patterns = [
    /(?:at|@)\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s*[-–—]|\s*\||$)/i, // "Software Engineer at Company Name"
    /([A-Z][a-zA-Z0-9\s&]+?)\s*[-–—]\s*[A-Z]/, // "Company Name - Job Title"
    /^([A-Z][a-zA-Z0-9\s&]+?)\s*[-–—]\s/i, // "Company Name - ..."
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      const company = match[1].trim();
      // Filter out common job-related words
      if (!/job|position|role|opening|hiring/i.test(company) && company.length > 2) {
        return company;
      }
    }
  }

  return null;
}

// Clean company name for logo API
function cleanCompanyName(company: string): string {
  return company
    .replace(/[^a-zA-Z0-9\s&-]/g, "") // Remove special chars except spaces, &, -
    .replace(/\s+/g, " ") // Normalize spaces
    .trim()
    .split(" ")[0]; // Take first word (most logos work with company name, not full name)
}

// Generate initials from company name
function getCompanyInitials(company: string): string {
  const words = company.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return company.substring(0, 2).toUpperCase();
}

type CompanyLogoProps = {
  company: string;
  jobTitle?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function CompanyLogo({
  company,
  jobTitle,
  width = 65,
  height = 65,
  className = "rounded-lg",
}: CompanyLogoProps) {
  const [logoError, setLogoError] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  // Determine the best company name to use
  const companyName = useMemo(() => {
    if (company && company !== "Unknown Company") {
      return company;
    }
    
    // Try to extract from job title
    if (jobTitle) {
      const extracted = extractCompanyFromTitle(jobTitle);
      if (extracted) {
        return extracted;
      }
    }
    
    return "Unknown Company";
  }, [company, jobTitle]);

  // Clean company name for logo API
  const logoCompanyName = useMemo(() => {
    if (companyName === "Unknown Company") {
      return null;
    }
    return cleanCompanyName(companyName);
  }, [companyName]);

  // Generate logo URL
  const logoUrl = logoCompanyName
    ? `https://img.logo.dev/${logoCompanyName}.com?token=pk_dTXM_rabSbuItZAjQsgTKA`
    : null;

  // Fallback: Show building icon or initials
  if (logoError || !logoUrl || companyName === "Unknown Company") {
    const initials = companyName !== "Unknown Company" 
      ? getCompanyInitials(companyName) 
      : "CO"; // Default "Company"
    
    return (
      <div
        className={`${className} bg-muted flex items-center justify-center`}
        style={{ width, height }}
      >
        <div className="flex flex-col items-center justify-center">
          <Building2 className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground mt-1">
            {initials}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      width={width}
      height={height}
      alt={`${companyName} logo`}
      className={className}
      onError={() => {
        setLogoError(true);
        if (!fallbackUsed) {
          setFallbackUsed(true);
        }
      }}
    />
  );
}

