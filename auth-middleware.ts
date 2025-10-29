// This file is kept for backward compatibility but now uses Clerk
import { auth } from "@clerk/nextjs/server";

// Clerk's auth function can be used directly in middleware context
export { auth };
