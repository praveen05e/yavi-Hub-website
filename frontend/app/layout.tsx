import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { siteConfig } from "@/data/siteConfig";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.apiBaseUrl.includes("localhost") ? "http://localhost:3000" : siteConfig.apiBaseUrl),
  title: {
    default: "Yavi Interior Hub",
    template: "%s — Yavi Interior Hub",
  },
  description: siteConfig.heroSupportingText,
  openGraph: {
    title: "Yavi Interior Hub",
    description: siteConfig.heroSupportingText,
    type: "website",
  },
};

import { Analytics } from "@vercel/analytics/react";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="font-body bg-ivory text-near-black">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
