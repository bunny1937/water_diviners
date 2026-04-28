import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function proxy(request) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // IP check (your existing)
  const allowedIP = process.env.ADMIN_ALLOWED_IP || "::1";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "::1";
  if (ip === allowedIP) {
    return NextResponse.next();
  }

  // Email JWT (your existing)
  const jwtCookie = request.cookies.get("adminToken")?.value;
  if (jwtCookie) {
    try {
      jwt.verify(jwtCookie, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch {}
  }

  // Google session check via NextAuth
  try {
    const { getToken } = await import("next-auth/jwt");
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (token?.email === process.env.ADMIN_GOOGLE_EMAIL) {
      return NextResponse.next();
    }
  } catch {}

  // Allow login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = { matcher: ["/admin/:path*"] };
