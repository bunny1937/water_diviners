import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function proxy(request) {
  console.log("🛡️ PROXY HIT:", request.nextUrl.pathname);

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // IP check (your existing)
  const allowedIP = process.env.ADMIN_ALLOWED_IP || "::1";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "::1";
  if (ip === allowedIP) {
    console.log("✅ IP OK");
    return NextResponse.next();
  }

  // Email JWT (your existing)
  const jwtCookie = request.cookies.get("adminToken")?.value;
  if (jwtCookie) {
    try {
      jwt.verify(jwtCookie, process.env.JWT_SECRET);
      console.log("✅ EMAIL JWT OK");
      return NextResponse.next();
    } catch {}
  }

  // 🔥 GOOGLE SESSION — READ ALL COOKIES DIRECTLY
  const allCookies = request.cookies.getAll();
  console.log(
    "🍪 ALL COOKIES:",
    allCookies.map((c) => `${c.name}=${c.value?.slice(0, 20)}...`).join(", "),
  );

  const nextAuthCookies = allCookies.filter(
    (c) => c.name.includes("next-auth") || c.name.includes("authjs"),
  );

  console.log(
    "🔍 NextAuth cookies:",
    nextAuthCookies.map((c) => c.name),
  );

  // Find session token & decode it
  const sessionCookie = allCookies.find((c) =>
    c.name.includes("session-token"),
  );

  if (sessionCookie?.value) {
    console.log("✅ SESSION COOKIE FOUND:", sessionCookie.name);
    try {
      // Decode NextAuth JWT directly
      const decoded = jwt.verify(
        sessionCookie.value,
        process.env.NEXTAUTH_SECRET,
      );
      console.log("✅ DECODED EMAIL:", decoded.email);

      if (decoded.email === process.env.ADMIN_GOOGLE_EMAIL) {
        console.log("🎉 GOOGLE ADMIN APPROVED");
        return NextResponse.next();
      }
    } catch (e) {
      console.log("❌ Session decode error:", e.message);
    }
  }

  // Allow login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  console.log("🚫 BLOCKED → /admin/login");
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = { matcher: ["/admin/:path*"] };
