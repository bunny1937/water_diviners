import Providers from "@/components/layout/Providers";
import "./globals.css";

export const metadata = {
  title: "M.M.S Water Diviners | Professional Groundwater Survey Experts",
  description:
    "M.M.S Water Diviners, owned by Dhananjay Manohar Sawant, is a professional groundwater survey company in Kankavli. We provide groundwater scanning, borewell point marking, depth estimation with 10 years of experience.",
  keywords:
    "water diviner, groundwater survey, borewell, Kankavli, geophysical survey, water detection, Dhananjay Sawant",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
