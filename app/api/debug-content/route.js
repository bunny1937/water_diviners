import { connectDB } from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  const url = new URL(req.url);
  const section = url.searchParams.get("section") || "hero";

  // All data for this section
  const allData = await SiteContent.find({ section }).sort({ key: 1 }).lean();

  // Expected keys for each section
  const expectedKeys = {
    hero: [
      "brandName",
      "tagline",
      "subtitle",
      "expertName",
      "expertTitle",
      "yearsExperience",
      "yearsLabel",
      "feature1",
      "feature2",
      "feature3",
      "feature4",
      "ctaCallLabel",
      "ctaCallPhone",
      "ctaWhatsappLabel",
      "ctaWhatsappHref",
      "scrollLabel",
    ],
    navbar: ["brandName", "brandTagline", "ctaLabel", "ctaPhone"],
    stats: [
      "experienceTarget",
      "experienceLabel",
      "projectsTarget",
      "projectsLabel",
      "successTarget",
      "successLabel",
      "clientsTarget",
      "clientsLabel",
    ],
    journey: ["sectionTitle", "sectionSubtitle"].concat(
      Array.from({ length: 5 }, (_, i) => [
        `step${i + 1}Title`,
        `step${i + 1}Subtitle`,
        `step${i + 1}Desc`,
      ]).flat(),
    ),
    process: ["sectionTitle"].concat(
      Array.from({ length: 4 }, (_, i) => [
        `step${i + 1}Title`,
        `step${i + 1}Desc`,
        `step${i + 1}Detail1`,
        `step${i + 1}Detail2`,
        `step${i + 1}Detail3`,
      ]).flat(),
    ),
    services: [
      "sectionTitle",
      "sectionSubtitle",
      "ctaTitle",
      "ctaText",
      "ctaButtonLabel",
    ].concat(
      Array.from({ length: 6 }, (_, i) => [
        `service${i + 1}Title`,
        `service${i + 1}Desc`,
        `service${i + 1}Feature1`,
        `service${i + 1}Feature2`,
        `service${i + 1}Feature3`,
        `service${i + 1}Feature4`,
      ]).flat(),
    ),
    footer: [
      "brandName",
      "brandTagline",
      "description",
      "quickLinksTitle",
      "servicesTitle",
      "contactTitle",
      "location",
      "phoneDisplay",
      "emailDisplay",
      "phone",
      "whatsappHref",
      "copyrightOwner",
    ],
  };

  // What we actually found
  const foundKeys = allData.map((d) => d.key);

  // Expected for this section
  const expected = expectedKeys[section] || [];
  const missing = expected.filter((k) => !foundKeys.includes(k));
  const extra = foundKeys.filter((k) => !expected.includes(k));

  return NextResponse.json({
    section,
    totalDocs: allData.length,
    foundKeys: foundKeys.length,
    expectedKeys: expected.length,
    missing,
    extra,
    allData: allData.slice(0, 20), // first 20 for preview
    rawSample: allData.slice(0, 3), // raw docs for inspection
  });
}
