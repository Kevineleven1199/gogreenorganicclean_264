import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
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
  title: "GoGreenOS | Operating system for modern service businesses",
  description:
    "Run your cleaning and home services business on a beautiful, automated, multi-tenant SaaS platform built for GoGreen Organic Clean.",
  icons: {
    icon: "/favicon.ico"
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${display.variable} ${body.variable}`}>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
