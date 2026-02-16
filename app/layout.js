import './globals.css';

export const metadata = {
  title: 'M.M.S Water Diviners | Professional Groundwater Survey Experts',
  description: 'M.M.S Water Diviners, owned by Dhananjay Manohar Sawant, is a professional groundwater survey company in Kankavli. We provide groundwater scanning, borewell point marking, depth estimation with 10 years of experience.',
  keywords: 'water diviner, groundwater survey, borewell, Kankavli, geophysical survey, water detection, Dhananjay Sawant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
