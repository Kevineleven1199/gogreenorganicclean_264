import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "../styles/globals.css";
import Providers from "@/components/providers";

const display = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display"
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Go Green Organic Clean | Sarasota’s Premier Organic Cleaning Service",
  description:
    "Experience all-organic residential and commercial cleaning in Sarasota, FL. Non-toxic, pet-safe, and eco-conscious service with customizable packages.",
  keywords: [
    "organic cleaning",
    "eco friendly cleaning",
    "Sarasota cleaning service",
    "green cleaning company",
    "non toxic cleaners"
  ],
  metadataBase: new URL("https://gogreenorganicclean.com"),
  openGraph: {
    title: "Go Green Organic Clean | Sarasota’s Premier Organic Cleaning Service",
    description:
      "Experience all-organic residential and commercial cleaning in Sarasota, FL. Non-toxic, pet-safe, and eco-conscious service with customizable packages.",
    url: "https://gogreenorganicclean.com",
    siteName: "Go Green Organic Clean",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Go Green Organic Clean crew in a pristine home"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Go Green Organic Clean",
    description:
      "Premium organic cleaning services in Sarasota and surrounding counties.",
    images: ["/images/og-cover.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${display.variable} ${body.variable} bg-surface text-foreground`}>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
