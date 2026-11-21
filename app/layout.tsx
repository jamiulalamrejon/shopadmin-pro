// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ShopAdmin", template: "%s | ShopAdmin" },
  description: "E-commerce admin dashboard - Developed by www.Jamiulalamrejon.com",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "ShopAdmin", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1660f5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
