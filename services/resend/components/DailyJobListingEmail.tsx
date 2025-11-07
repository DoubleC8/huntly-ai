import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  employment: string;
  remoteType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  aiSummary: string;
  sourceUrl: string;
  matchScore: number;
};

export default function DailyJobListingEmail({
  jobListings = [],
  serverUrl = "http://localhost:3000",
  userName = "User",
}: {
  userName?: string;
  jobListings?: JobListing[];
  serverUrl?: string;
}) {
  const formatSalary = (min: number, max: number, currency: string) => {
    if (min === 0 && max === 0) return null;
    const currencySymbol = currency === "USD" ? "$" : currency;
    if (min === max) {
      return `${currencySymbol}${min.toLocaleString()}`;
    }
    return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;
  };

  // Handle empty job listings
  if (!jobListings || jobListings.length === 0) {
    return (
      <Html>
        <Head />
        <Body style={main}>
          <Container style={container}>
            <Heading style={heading}>New Job Recommendations!</Heading>
            <Text style={paragraph}>
              Hi {userName}, we couldn't find any new jobs matching your preferences today. Check back tomorrow!
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              You're receiving this email because you have job notifications enabled.
              <br />
              <Link href={`${serverUrl}/jobs/settings`} style={link}>
                Manage your notification settings
              </Link>
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Job Recommendations!</Heading>

          <Text style={paragraph}>
            Hi {userName}, we found {jobListings.length} new {jobListings.length === 1 ? "job" : "jobs"} that match your preferences.
          </Text>

          {jobListings.map((job, index) => (
            <Section key={job.id} style={jobCard}>
              <Heading as="h2" style={jobTitle}>
                {job.title}
              </Heading>
              <Text style={companyName}>{job.company}</Text>

              <Section style={jobDetails}>
                <Text style={detailText}>
                  <strong>Location:</strong> {job.location}
                </Text>
                <Text style={detailText}>
                  <strong>Type:</strong> {job.employment}
                </Text>
                <Text style={detailText}>
                  <strong>Remote:</strong> {job.remoteType}
                </Text>
                {formatSalary(job.salaryMin, job.salaryMax, job.currency) && (
                  <Text style={detailText}>
                    <strong>Salary:</strong> {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </Text>
                )}
                <Text style={detailText}>
                  <strong>Match Score:</strong> {job.matchScore}%
                </Text>
              </Section>

              <Text style={description}>{job.description}</Text>

              <Button href={job.sourceUrl} style={button}>
                View Job Details
              </Button>
            </Section>
          ))}

          <Hr style={hr} />

          <Text style={footer}>
            You're receiving this email because you have job notifications enabled.
            <br />
            <Link href={`${serverUrl}/jobs/settings`} style={link}>
              Manage your notification settings
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const heading = {
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
  padding: "17px 0 27px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
};

const jobCard = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  border: "1px solid #e1e4e8",
};

const jobTitle = {
  fontSize: "20px",
  lineHeight: "1.4",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 8px 0",
};

const companyName = {
  fontSize: "16px",
  lineHeight: "1.4",
  color: "#666",
  margin: "0 0 16px 0",
  fontWeight: "500",
};

const jobDetails = {
  margin: "12px 0",
};

const detailText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#484848",
  margin: "4px 0",
};

const description = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#666",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "16px 0 0 0",
};

const hr = {
  borderColor: "#e1e4e8",
  margin: "32px 0 16px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};

const link = {
  color: "#0070f3",
  textDecoration: "underline",
};

