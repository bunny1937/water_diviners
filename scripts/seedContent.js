import dotenv from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Fix: explicitly load .env.local
const __dirname = fileURLToPath(new URL(".", import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const SiteContentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    key: { type: String, required: true },
    type: {
      type: String,
      enum: ["h1", "h2", "h3", "h4", "p", "span", "img", "a"],
      required: true,
    },
    value: { type: String, required: true },
    label: String,
  },
  { timestamps: true },
);

SiteContentSchema.index({ section: 1, key: 1 }, { unique: true });

const SiteContent =
  mongoose.models?.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);

const content = [
  // ─────────────── NAVBAR ───────────────
  {
    section: "navbar",
    key: "brandName",
    type: "span",
    value: "M.M.S",
    label: "Navbar Brand Name",
  },
  {
    section: "navbar",
    key: "brandTagline",
    type: "span",
    value: "Water Diviners",
    label: "Navbar Brand Tagline",
  },
  {
    section: "navbar",
    key: "ctaPhone",
    type: "a",
    value: "tel:9370427023",
    label: "Navbar Call Now Phone href",
  },
  {
    section: "navbar",
    key: "ctaLabel",
    type: "span",
    value: "Call Now",
    label: "Navbar CTA Button Label",
  },

  // ─────────────── HERO ───────────────
  {
    section: "hero",
    key: "brandName",
    type: "h1",
    value: "M.M.S WATER DIVINERS",
    label: "Hero Brand Name (H1)",
  },
  {
    section: "hero",
    key: "tagline",
    type: "span",
    value: "Discovering Water, Sustaining Life",
    label: "Hero Tagline",
  },
  {
    section: "hero",
    key: "subtitle",
    type: "p",
    value: "Professional Geophysical Water Survey Experts",
    label: "Hero Subtitle",
  },
  {
    section: "hero",
    key: "expertName",
    type: "h2",
    value: "Dhananjay Manohar Sawant",
    label: "Expert Name",
  },
  {
    section: "hero",
    key: "expertTitle",
    type: "p",
    value: "Geophysical Water Survey Expert",
    label: "Expert Title",
  },
  {
    section: "hero",
    key: "yearsExperience",
    type: "span",
    value: "10",
    label: "Years of Experience Number",
  },
  {
    section: "hero",
    key: "yearsLabel",
    type: "p",
    value: "Years of Excellence",
    label: "Years of Excellence Label",
  },
  {
    section: "hero",
    key: "feature1",
    type: "span",
    value: "Advanced Groundwater Scanning",
    label: "Hero Feature 1",
  },
  {
    section: "hero",
    key: "feature2",
    type: "span",
    value: "Accurate Depth Estimation",
    label: "Hero Feature 2",
  },
  {
    section: "hero",
    key: "feature3",
    type: "span",
    value: "High Success Rate",
    label: "Hero Feature 3",
  },
  {
    section: "hero",
    key: "feature4",
    type: "span",
    value: "Affordable & Reliable",
    label: "Hero Feature 4",
  },
  {
    section: "hero",
    key: "ctaCallLabel",
    type: "span",
    value: "Call Now",
    label: "Hero CTA Call Label",
  },
  {
    section: "hero",
    key: "ctaCallPhone",
    type: "a",
    value: "tel:9370427023",
    label: "Hero Call Phone href",
  },
  {
    section: "hero",
    key: "ctaWhatsappLabel",
    type: "span",
    value: "WhatsApp",
    label: "Hero CTA WhatsApp Label",
  },
  {
    section: "hero",
    key: "ctaWhatsappHref",
    type: "a",
    value: "https://wa.me/9370427023",
    label: "Hero WhatsApp href",
  },
  {
    section: "hero",
    key: "scrollLabel",
    type: "p",
    value: "Scroll to explore",
    label: "Hero Scroll Indicator Label",
  },

  // ─────────────── STATS BLOCK ───────────────
  {
    section: "stats",
    key: "experienceTarget",
    type: "span",
    value: "10",
    label: "Years Experience Count Target",
  },
  {
    section: "stats",
    key: "experienceLabel",
    type: "span",
    value: "Years Experience",
    label: "Years Experience Label",
  },
  {
    section: "stats",
    key: "projectsTarget",
    type: "span",
    value: "500",
    label: "Successful Projects Count Target",
  },
  {
    section: "stats",
    key: "projectsLabel",
    type: "span",
    value: "Successful Projects",
    label: "Projects Label",
  },
  {
    section: "stats",
    key: "successTarget",
    type: "span",
    value: "95",
    label: "Success Rate % Target",
  },
  {
    section: "stats",
    key: "successLabel",
    type: "span",
    value: "Success Rate",
    label: "Success Rate Label",
  },
  {
    section: "stats",
    key: "clientsTarget",
    type: "span",
    value: "300",
    label: "Happy Clients Count Target",
  },
  {
    section: "stats",
    key: "clientsLabel",
    type: "span",
    value: "Happy Clients",
    label: "Clients Label",
  },

  // ─────────────── JOURNEY SECTION ───────────────
  {
    section: "journey",
    key: "sectionTitle",
    type: "h2",
    value: "Our Journey With You",
    label: "Journey Section Title",
  },
  {
    section: "journey",
    key: "sectionSubtitle",
    type: "p",
    value:
      "From first contact to water discovery, experience the precision and care we bring to every project",
    label: "Journey Section Subtitle",
  },

  {
    section: "journey",
    key: "step1Title",
    type: "h3",
    value: "The Quest Begins",
    label: "Journey Step 1 Title",
  },
  {
    section: "journey",
    key: "step1Subtitle",
    type: "h4",
    value: "Understanding Your Need",
    label: "Journey Step 1 Subtitle",
  },
  {
    section: "journey",
    key: "step1Desc",
    type: "p",
    value:
      "Every drop of water tells a story. When you reach out to us, we begin by understanding your land, your requirements, and your dreams. Whether you're a farmer seeking to irrigate fields or a builder planning a new project, we listen first.",
    label: "Journey Step 1 Description",
  },

  {
    section: "journey",
    key: "step2Title",
    type: "h3",
    value: "Scientific Scanning",
    label: "Journey Step 2 Title",
  },
  {
    section: "journey",
    key: "step2Subtitle",
    type: "h4",
    value: "Advanced Geophysical Technology",
    label: "Journey Step 2 Subtitle",
  },
  {
    section: "journey",
    key: "step2Desc",
    type: "p",
    value:
      "Using cutting-edge geophysical instruments, we scan beneath the earth's surface. Our technology penetrates deep into soil layers, detecting water-bearing formations that are invisible to the naked eye. Science meets expertise.",
    label: "Journey Step 2 Description",
  },

  {
    section: "journey",
    key: "step3Title",
    type: "h3",
    value: "Data Analysis",
    label: "Journey Step 3 Title",
  },
  {
    section: "journey",
    key: "step3Subtitle",
    type: "h4",
    value: "Precision Mapping",
    label: "Journey Step 3 Subtitle",
  },
  {
    section: "journey",
    key: "step3Desc",
    type: "p",
    value:
      "The earth speaks in signals. Our expert, Dhananjay Sawant, analyzes geological data with 10 years of field experience. We map underground aquifers, calculate depth, predict yield, and identify the optimal drilling point.",
    label: "Journey Step 3 Description",
  },

  {
    section: "journey",
    key: "step4Title",
    type: "h3",
    value: "Mark The Spot",
    label: "Journey Step 4 Title",
  },
  {
    section: "journey",
    key: "step4Subtitle",
    type: "h4",
    value: "X Marks Success",
    label: "Journey Step 4 Subtitle",
  },
  {
    section: "journey",
    key: "step4Desc",
    type: "p",
    value:
      "With confidence built on data and experience, we mark the exact location for your borewell. No guesswork. No wasted resources. Just scientific precision that maximizes your chances of finding abundant water.",
    label: "Journey Step 4 Description",
  },

  {
    section: "journey",
    key: "step5Title",
    type: "h3",
    value: "Water Discovered",
    label: "Journey Step 5 Title",
  },
  {
    section: "journey",
    key: "step5Subtitle",
    type: "h4",
    value: "Life Flows",
    label: "Journey Step 5 Subtitle",
  },
  {
    section: "journey",
    key: "step5Desc",
    type: "p",
    value:
      "The drill penetrates the earth at our marked spot. Water surges up, transforming dry land into fertile ground. Your investment protected. Your future secured. Another successful project in our decade-long journey.",
    label: "Journey Step 5 Description",
  },

  // ─────────────── PROCESS SECTION ───────────────
  {
    section: "process",
    key: "sectionTitle",
    type: "h2",
    value: "Our Process",
    label: "Process Section Title",
  },

  {
    section: "process",
    key: "step1Title",
    type: "h3",
    value: "Site Survey",
    label: "Process Step 1 Title",
  },
  {
    section: "process",
    key: "step1Desc",
    type: "p",
    value:
      "We visit your location and conduct preliminary geological assessment",
    label: "Process Step 1 Description",
  },
  {
    section: "process",
    key: "step1Detail1",
    type: "span",
    value: "Topography analysis",
    label: "Process Step 1 Detail 1",
  },
  {
    section: "process",
    key: "step1Detail2",
    type: "span",
    value: "Soil sample collection",
    label: "Process Step 1 Detail 2",
  },
  {
    section: "process",
    key: "step1Detail3",
    type: "span",
    value: "Historical water data review",
    label: "Process Step 1 Detail 3",
  },

  {
    section: "process",
    key: "step2Title",
    type: "h3",
    value: "Geophysical Scanning",
    label: "Process Step 2 Title",
  },
  {
    section: "process",
    key: "step2Desc",
    type: "p",
    value: "Advanced equipment detects underground water formations",
    label: "Process Step 2 Description",
  },
  {
    section: "process",
    key: "step2Detail1",
    type: "span",
    value: "Resistivity measurement",
    label: "Process Step 2 Detail 1",
  },
  {
    section: "process",
    key: "step2Detail2",
    type: "span",
    value: "Electromagnetic detection",
    label: "Process Step 2 Detail 2",
  },
  {
    section: "process",
    key: "step2Detail3",
    type: "span",
    value: "Seismic wave analysis",
    label: "Process Step 2 Detail 3",
  },

  {
    section: "process",
    key: "step3Title",
    type: "h3",
    value: "Data Interpretation",
    label: "Process Step 3 Title",
  },
  {
    section: "process",
    key: "step3Desc",
    type: "p",
    value: "Expert analysis reveals optimal drilling locations",
    label: "Process Step 3 Description",
  },
  {
    section: "process",
    key: "step3Detail1",
    type: "span",
    value: "Depth calculation",
    label: "Process Step 3 Detail 1",
  },
  {
    section: "process",
    key: "step3Detail2",
    type: "span",
    value: "Yield estimation",
    label: "Process Step 3 Detail 2",
  },
  {
    section: "process",
    key: "step3Detail3",
    type: "span",
    value: "Quality assessment",
    label: "Process Step 3 Detail 3",
  },

  {
    section: "process",
    key: "step4Title",
    type: "h3",
    value: "Recommendation Report",
    label: "Process Step 4 Title",
  },
  {
    section: "process",
    key: "step4Desc",
    type: "p",
    value: "Comprehensive report with drilling specifications",
    label: "Process Step 4 Description",
  },
  {
    section: "process",
    key: "step4Detail1",
    type: "span",
    value: "Marked drilling point",
    label: "Process Step 4 Detail 1",
  },
  {
    section: "process",
    key: "step4Detail2",
    type: "span",
    value: "Depth specifications",
    label: "Process Step 4 Detail 2",
  },
  {
    section: "process",
    key: "step4Detail3",
    type: "span",
    value: "Written guarantee",
    label: "Process Step 4 Detail 3",
  },

  // ─────────────── SERVICES SECTION ───────────────
  {
    section: "services",
    key: "sectionTitle",
    type: "h2",
    value: "Our Services",
    label: "Services Section Title",
  },
  {
    section: "services",
    key: "sectionSubtitle",
    type: "p",
    value: "Comprehensive groundwater survey solutions tailored to your needs",
    label: "Services Section Subtitle",
  },

  {
    section: "services",
    key: "service1Title",
    type: "h3",
    value: "Groundwater Scanning",
    label: "Service 1 Title",
  },
  {
    section: "services",
    key: "service1Desc",
    type: "p",
    value:
      "Advanced geophysical survey using state-of-the-art equipment to detect underground water sources with precision.",
    label: "Service 1 Description",
  },
  {
    section: "services",
    key: "service1Feature1",
    type: "span",
    value: "Electromagnetic scanning",
    label: "Service 1 Feature 1",
  },
  {
    section: "services",
    key: "service1Feature2",
    type: "span",
    value: "Resistivity mapping",
    label: "Service 1 Feature 2",
  },
  {
    section: "services",
    key: "service1Feature3",
    type: "span",
    value: "Geological analysis",
    label: "Service 1 Feature 3",
  },
  {
    section: "services",
    key: "service1Feature4",
    type: "span",
    value: "Real-time data processing",
    label: "Service 1 Feature 4",
  },

  {
    section: "services",
    key: "service2Title",
    type: "h3",
    value: "Borewell Point Marking",
    label: "Service 2 Title",
  },
  {
    section: "services",
    key: "service2Desc",
    type: "p",
    value:
      "Scientifically determined exact drilling locations to maximize water yield and minimize drilling costs.",
    label: "Service 2 Description",
  },
  {
    section: "services",
    key: "service2Feature1",
    type: "span",
    value: "GPS coordinates",
    label: "Service 2 Feature 1",
  },
  {
    section: "services",
    key: "service2Feature2",
    type: "span",
    value: "Depth calculation",
    label: "Service 2 Feature 2",
  },
  {
    section: "services",
    key: "service2Feature3",
    type: "span",
    value: "Yield estimation",
    label: "Service 2 Feature 3",
  },
  {
    section: "services",
    key: "service2Feature4",
    type: "span",
    value: "Optimal positioning",
    label: "Service 2 Feature 4",
  },

  {
    section: "services",
    key: "service3Title",
    type: "h3",
    value: "Depth Estimation",
    label: "Service 3 Title",
  },
  {
    section: "services",
    key: "service3Desc",
    type: "p",
    value:
      "Accurate prediction of water table depth to plan drilling operations effectively and efficiently.",
    label: "Service 3 Description",
  },
  {
    section: "services",
    key: "service3Feature1",
    type: "span",
    value: "Multi-layer analysis",
    label: "Service 3 Feature 1",
  },
  {
    section: "services",
    key: "service3Feature2",
    type: "span",
    value: "Aquifer identification",
    label: "Service 3 Feature 2",
  },
  {
    section: "services",
    key: "service3Feature3",
    type: "span",
    value: "Depth measurement",
    label: "Service 3 Feature 3",
  },
  {
    section: "services",
    key: "service3Feature4",
    type: "span",
    value: "Formation mapping",
    label: "Service 3 Feature 4",
  },

  {
    section: "services",
    key: "service4Title",
    type: "h3",
    value: "Yield Prediction",
    label: "Service 4 Title",
  },
  {
    section: "services",
    key: "service4Desc",
    type: "p",
    value:
      "Forecast expected water output to ensure your investment meets irrigation or consumption needs.",
    label: "Service 4 Description",
  },
  {
    section: "services",
    key: "service4Feature1",
    type: "span",
    value: "Flow rate estimation",
    label: "Service 4 Feature 1",
  },
  {
    section: "services",
    key: "service4Feature2",
    type: "span",
    value: "Quality assessment",
    label: "Service 4 Feature 2",
  },
  {
    section: "services",
    key: "service4Feature3",
    type: "span",
    value: "Seasonal variation analysis",
    label: "Service 4 Feature 3",
  },
  {
    section: "services",
    key: "service4Feature4",
    type: "span",
    value: "Long-term sustainability",
    label: "Service 4 Feature 4",
  },

  {
    section: "services",
    key: "service5Title",
    type: "h3",
    value: "Pump Depth Guidance",
    label: "Service 5 Title",
  },
  {
    section: "services",
    key: "service5Desc",
    type: "p",
    value:
      "Expert recommendations on optimal pump installation depth for efficient water extraction.",
    label: "Service 5 Description",
  },
  {
    section: "services",
    key: "service5Feature1",
    type: "span",
    value: "Pump specifications",
    label: "Service 5 Feature 1",
  },
  {
    section: "services",
    key: "service5Feature2",
    type: "span",
    value: "Installation depth",
    label: "Service 5 Feature 2",
  },
  {
    section: "services",
    key: "service5Feature3",
    type: "span",
    value: "Efficiency optimization",
    label: "Service 5 Feature 3",
  },
  {
    section: "services",
    key: "service5Feature4",
    type: "span",
    value: "Maintenance guidance",
    label: "Service 5 Feature 4",
  },

  {
    section: "services",
    key: "service6Title",
    type: "h3",
    value: "Consultation & Report",
    label: "Service 6 Title",
  },
  {
    section: "services",
    key: "service6Desc",
    type: "p",
    value:
      "Detailed written report with all findings, recommendations, and drilling specifications for your records.",
    label: "Service 6 Description",
  },
  {
    section: "services",
    key: "service6Feature1",
    type: "span",
    value: "Detailed survey report",
    label: "Service 6 Feature 1",
  },
  {
    section: "services",
    key: "service6Feature2",
    type: "span",
    value: "Drilling specifications",
    label: "Service 6 Feature 2",
  },
  {
    section: "services",
    key: "service6Feature3",
    type: "span",
    value: "Location certificate",
    label: "Service 6 Feature 3",
  },
  {
    section: "services",
    key: "service6Feature4",
    type: "span",
    value: "Follow-up support",
    label: "Service 6 Feature 4",
  },

  {
    section: "services",
    key: "ctaTitle",
    type: "h3",
    value: "Need a Custom Solution?",
    label: "Services CTA Title",
  },
  {
    section: "services",
    key: "ctaText",
    type: "p",
    value:
      "Every project is unique. Contact us to discuss your specific requirements.",
    label: "Services CTA Text",
  },
  {
    section: "services",
    key: "ctaButtonLabel",
    type: "span",
    value: "Get in Touch",
    label: "Services CTA Button Label",
  },

  // ─────────────── FOOTER ───────────────
  {
    section: "footer",
    key: "brandName",
    type: "h3",
    value: "M.M.S Water Diviners",
    label: "Footer Brand Name",
  },
  {
    section: "footer",
    key: "brandTagline",
    type: "p",
    value: "Discovering Water, Sustaining Life",
    label: "Footer Tagline",
  },
  {
    section: "footer",
    key: "description",
    type: "p",
    value:
      "Professional geophysical water survey experts with 10 years of experience in groundwater detection. Trusted by farmers, builders, and landowners across Kankavli.",
    label: "Footer Description",
  },
  {
    section: "footer",
    key: "location",
    type: "span",
    value: "Kankavli, Maharashtra",
    label: "Footer Location",
  },
  {
    section: "footer",
    key: "phone",
    type: "a",
    value: "tel:9370427023",
    label: "Footer Phone href",
  },
  {
    section: "footer",
    key: "phoneDisplay",
    type: "span",
    value: "9370427023",
    label: "Footer Phone Display",
  },
  {
    section: "footer",
    key: "email",
    type: "a",
    value: "mailto:dhananjays637@gmail.com",
    label: "Footer Email href",
  },
  {
    section: "footer",
    key: "emailDisplay",
    type: "span",
    value: "dhananjays637@gmail.com",
    label: "Footer Email Display",
  },
  {
    section: "footer",
    key: "whatsappHref",
    type: "a",
    value: "https://wa.me/9370427023",
    label: "Footer WhatsApp href",
  },
  {
    section: "footer",
    key: "quickLinksTitle",
    type: "h4",
    value: "Quick Links",
    label: "Footer Quick Links Heading",
  },
  {
    section: "footer",
    key: "servicesTitle",
    type: "h4",
    value: "Our Services",
    label: "Footer Services Heading",
  },
  {
    section: "footer",
    key: "contactTitle",
    type: "h4",
    value: "Contact Us",
    label: "Footer Contact Heading",
  },
  {
    section: "footer",
    key: "copyrightOwner",
    type: "span",
    value: "Dhananjay Manohar Sawant",
    label: "Footer Copyright Owner Name",
  },

  // ─────────────── SEO / METADATA ───────────────
  {
    section: "meta",
    key: "siteTitle",
    type: "h1",
    value: "M.M.S Water Diviners – Professional Groundwater Survey Experts",
    label: "SEO Page Title",
  },
  {
    section: "meta",
    key: "siteDescription",
    type: "p",
    value:
      "M.M.S Water Diviners, owned by Dhananjay Manohar Sawant, is a professional groundwater survey company in Kankavli. We provide groundwater scanning, borewell point marking, depth estimation with 10 years of experience.",
    label: "SEO Meta Description",
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("✅ Connected to MongoDB");

  let inserted = 0;
  let skipped = 0;

  for (const item of content) {
    try {
      await SiteContent.updateOne(
        { section: item.section, key: item.key },
        { $setOnInsert: item },
        { upsert: true },
      );
      inserted++;
    } catch (e) {
      console.warn(`⚠️  Skipped ${item.section}/${item.key}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ Done. ${inserted} upserted, ${skipped} skipped.`);
  console.log(`📦 Total records in DB: ${await SiteContent.countDocuments()}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
