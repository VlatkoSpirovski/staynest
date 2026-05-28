import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getSiteUrl } from "@/lib/utils";
import { SeoJsonLd } from "@/components/seo-jsonld";

const inter = Inter({ subsets: ["latin"] });

export const preferredRegion = "fra1";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "StayNest",
    template: "%s · StayNest"
  },
  description: "Digital guest guides for villas, apartments and rentals. One QR code, always up to date.",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    siteName: "StayNest",
    title: "StayNest",
    description: "Digital guest guides for villas, apartments and rentals. One QR code, always up to date."
  },
  twitter: {
    card: "summary_large_image",
    title: "StayNest",
    description: "Digital guest guides for villas, apartments and rentals. One QR code, always up to date."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <SeoJsonLd />
        {children}
      </body>
    </html>
  );
}
