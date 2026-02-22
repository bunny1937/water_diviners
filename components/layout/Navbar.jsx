// components/layout/Navbar.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSiteContent } from "@/lib/getSiteContent";
import { headers } from "next/headers";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const [c, session, headersList] = await Promise.all([
    getSiteContent("navbar"),
    getServerSession(authOptions),
    headers(),
  ]);

  // IP check (same dual-layer as middleware)
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const isAllowedIP = ip === process.env.ADMIN_ALLOWED_IP;
  const isAdminGoogle = session?.isAdmin === true;
  const isAdmin = isAllowedIP || isAdminGoogle; // either is enough

  return (
    <NavbarClient
      brandName={c.brandName || "M.M.S"}
      brandTagline={c.brandTagline || "Water Diviners"}
      ctaPhone={c.ctaPhone || "tel:9370427023"}
      ctaLabel={c.ctaLabel || "Call Now"}
      isAdmin={isAdmin}
    />
  );
}
