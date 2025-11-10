import { DeletedObjectJSON, UserJSON } from "@clerk/nextjs/server";
import { EventSchemas, Inngest } from "inngest";
import type { JobSearchResult } from "./utils/jobSearchUtils";

type ClerkWebhookData<T> = {
  data: {
    data: T
    raw: string
    headers: Record<string, string>
  }
}

type Events = {
    "clerk/user.created": ClerkWebhookData<UserJSON>
    "clerk/user.updated": ClerkWebhookData<UserJSON>
    "clerk/user.deleted": ClerkWebhookData<DeletedObjectJSON>
    "app/resume.uploaded": {
      user: {
        id: string
      }
    }
    "app/jobPreferences.updated": {
      user: {
        id: string
      }
    }
    "app/resume.defaultChanged": {
      user: {
        id: string
      }
    }
    "app/email.daily-job-notifications": {
      data: {
        userId: string
        userEmail: string
        userName: string
        jobPreferences: string[]
        skills: string[]
        resumeSummary: string | null
        jobs?: JobSearchResult[]
        jobsAlreadyPersisted?: boolean
      }
    }
    "app/jobs.daily-processing": {
      data: {
        userId: string
        userEmail: string
        userName: string
        jobPreferences: string[]
        skills: string[]
        resumeSummary: string | null
        newJobEmailNotifications: boolean
      }
    }
}

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "huntly-ai", 
  schemas: new EventSchemas().fromRecord<Events>(),
  // For local development, use eventKey if provided, otherwise rely on Inngest dev server
  eventKey: process.env.INNGEST_EVENT_KEY,
});