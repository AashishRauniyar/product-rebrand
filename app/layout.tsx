import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { SessionTimeout } from "@/components/session-timeout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verified Supplements Store - Premium Rebranded Supplements",
  description:
    "Discover our newly rebranded line of premium supplements, designed for optimal health and performance. Verified quality, exceptional results.",
  keywords:
    "supplements, health, fitness, vitamins, rebranded, premium, verified supplements",
  openGraph: {
    title: "Verified Supplements Store - Premium Rebranded Supplements",
    description:
      "Experience the next level of wellness with our rebranded supplements.",
    type: "website",
    url: "https://verifiedsupplements.store", // Replace with actual URL when live
    images: [
      {
        url: "https://source.unsplash.com/1200x630/?health,supplements", // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: "Verified Supplements Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Supplements Store - Premium Rebranded Supplements",
    description:
      "Our rebranded supplements are here to elevate your health journey.",
    images: ["https://source.unsplash.com/1200x630/?wellness,fitness"], // Replace with actual Twitter image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider>
            {children}
            <SessionTimeout />
          </ThemeProvider>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
