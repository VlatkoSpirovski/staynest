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
  description: "QR guest guides that help Airbnb and Booking.com hosts answer questions and collect more 5-star reviews.",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [{ url: "/staynest-logo.png", type: "image/png" }],
    apple: [{ url: "/staynest-logo.png", type: "image/png" }]
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    siteName: "StayNest",
    title: "StayNest",
    description: "QR guest guides that help Airbnb and Booking.com hosts answer questions and collect more 5-star reviews."
  },
  twitter: {
    card: "summary_large_image",
    title: "StayNest",
    description: "QR guest guides that help Airbnb and Booking.com hosts answer questions and collect more 5-star reviews."
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
