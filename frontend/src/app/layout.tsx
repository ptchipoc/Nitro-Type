import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// Configure fonts with proper options
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://eindev.ir",
  ),
  title: {
    default: "Nitro Type — NT",
    template: "%s | NT",
  },
  description:
    "Integrated programming learning platform focused on technical development, competitive practice, and community collaboration.",
  keywords: [
    "Programming",
    "Coding Education",
    "Competitive Programming",
    "Typing Code",
    "Algorithmic Thinking",
    "Collaborative Learning",
    "NT",
  ],
  authors: [{ name: "NT" }],
  creator: "NT",
  publisher: "NT",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "NT — Nitro Type",
    description:
      "Integrated programming learning platform focused on technical development, competitive practice, and community collaboration.",
    siteName: "NT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NT — Nitro Type",
    description:
      "A digital workshop where code meets curiosity. Experiments, prototypes, and open-source artifacts.",
    creator: "@NT",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans antialiased flex flex-col min-h-screen ">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
