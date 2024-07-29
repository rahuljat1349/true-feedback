import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const url = request.nextUrl;

  if (
    token && url.pathname.startsWith("/signin") ||
    token && url.pathname.startsWith("/signup") ||
    token && url.pathname.startsWith("/verify") ||
    token && url.pathname.startsWith("/") 
   ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}


export const config = {
    matcher: [
        "/signin",
        "/signup",
        "/dashboard/:path*",
        "/verify/:path*",
    ]
}
