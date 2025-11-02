import { inngest } from "@/services/inngest/client";
import { clerkCreateUser, clerkUpdateUser, clerkDeleteUser } from "@/services/inngest/functions/clerk";
import { serve } from "inngest/next";


// Create an API that serves Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
  ],
});