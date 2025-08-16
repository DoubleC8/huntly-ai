import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/jobs"];

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};