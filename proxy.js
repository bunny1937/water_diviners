import { NextResponse } from "next/server";

export function proxy(request) {
  const allowedIP = process.env.ADMIN_ALLOWED_IP;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.ip || "unknown";

  console.log("IP:", ip); // remove in production

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (ip !== allowedIP) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
