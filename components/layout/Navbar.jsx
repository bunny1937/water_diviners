// components/layout/Navbar.jsx
export const dynamic = "force-dynamic";

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
  const isAdminGoogle = session?.isAdmin === true;
  // IP alone is not enough to show the Admin link — Google account must match
  const isAdmin = isAdminGoogle;

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
