import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  const nextAuthToken = await getToken({
    req: { cookies },
    secret: process.env.NEXTAUTH_SECRET,
  });

  return NextResponse.json({
    adminEmail: process.env.ADMIN_GOOGLE_EMAIL,
    nextAuthEmail: nextAuthToken?.email,
    nextAuthIsAdmin: nextAuthToken?.isAdmin,
    jwtCookie: !!token,
    allowedIP: process.env.ADMIN_ALLOWED_IP,
  });
}
