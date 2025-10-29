import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/jobs(.*)"]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId } = await auth();
  const pathname = request.nextUrl.pathname;

  // If user is logged in and tries to access home page, redirect to dashboard
  if (pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/jobs/dashboard", request.url));
  }

  // Protect routes that require authentication
  if (isProtectedRoute(request) && !userId) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect_url", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
