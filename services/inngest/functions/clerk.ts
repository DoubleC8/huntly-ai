import { env } from "@/data/env/server";
import { inngest } from "../client";
import { Webhook } from "svix"
import { NonRetriableError } from "inngest";
import {  deleteUser, insertUser, updateUser } from "@/features/users/db/users"
import { insertUserNotificationSettings } from "@/features/users/db/userNotificationSettings"
import { prisma } from "@/lib/prisma"


function verifyWebhook({
  raw,
  headers,
}: {
  raw?: string
  headers?: Record<string, string | string[] | undefined>
}) {
  if (!raw || !headers) {
    throw new NonRetriableError("Missing webhook payload")
  }

  const normalizedHeaders = Object.entries(headers).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value == null) {
        return acc
      }

      acc[key.toLowerCase()] = Array.isArray(value) ? value.join(",") : value
      return acc
    },
    {}
  )

  const decodedRaw = decodeRawBody(raw)

  return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(decodedRaw, normalizedHeaders)
}

function decodeRawBody(raw: string) {
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8")
    if (decoded.trim().length > 0 && isProbablyJson(decoded)) {
      return decoded
    }
  } catch {
    // fall through to return raw
  }
  return raw
}

function isProbablyJson(value: string) {
  const firstChar = value.trim().at(0)
  return firstChar === "{" || firstChar === "["
}

export const clerkCreateUser = inngest.createFunction({ id: 'clerk/create-db-user', 
    name: "Clerk - Create DB User"
}, {
    event: "clerk/user.created"
}, async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data)
      } catch {
        throw new NonRetriableError("Invalid webhook")
      }
    })

    const userId = await step.run("create-user", async () => {
      const userData = event.data.data
      const email = userData.email_addresses.find(
        (email: { id: string; email_address: string }) => email.id === userData.primary_email_address_id
      )

      if (email == null) {
        throw new NonRetriableError("No primary email address found")
      }

      await insertUser({
        id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        image: userData.image_url,
        email: email.email_address,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      })

      // Get the actual user ID from database (in case user already existed with different ID)
      const dbUser = await prisma.user.findUnique({
        where: { email: email.email_address },
        select: { id: true },
      })

      return dbUser?.id ?? userData.id
    })

    await step.run("create-user-notification-settings", async () => {
      await insertUserNotificationSettings({ 
        userId,
        newJobEmailNotifications: false 
      })
    })
})


export const clerkUpdateUser = inngest.createFunction(
  { id: "clerk/update-db-user", name: "Clerk - Update DB User" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data)
      } catch {
        throw new NonRetriableError("Invalid webhook")
      }
    })

    await step.run("update-user", async () => {
      const userData = event.data.data
      const email = userData.email_addresses.find(
        (email: { id: string; email_address: string }) => email.id === userData.primary_email_address_id
      )

      if (email == null) {
        throw new NonRetriableError("No primary email address found")
      }

      await updateUser(userData.id, {
        name: `${userData.first_name} ${userData.last_name}`,
        image: userData.image_url,
        email: email.email_address,
        updatedAt: new Date(userData.updated_at),
      })
    })
  }
)

export const clerkDeleteUser = inngest.createFunction(
  { id: "clerk/delete-db-user", name: "Clerk - Delete DB User" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data)
      } catch {
        throw new NonRetriableError("Invalid webhook")
      }
    })

    await step.run("delete-user", async () => {
      const { id } = event.data.data

      if (id == null) {
        throw new NonRetriableError("No id found")
      }
      await deleteUser(id)
    })
  }
)