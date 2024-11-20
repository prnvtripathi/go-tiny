import { NextResponse, NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  // check if the user is authenticated
  const session = await auth();
  const url = req.nextUrl.clone();
  url.pathname = "/login";

  if (!session) {
    return NextResponse.redirect(url.toString());
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/short/:path*", "/qr/:path*", "/api/backend/:path*"],
};
