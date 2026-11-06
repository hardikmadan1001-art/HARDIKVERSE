import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HARDIKVERSE | An Interactive World",
  description:
    "Enter the personal world of Hardik Madan. A curated experience of creativity, projects, and passion.",
  keywords: [
    "Hardik Madan",
    "Hardikverse",
    "Interactive Portfolio",
    "3D Experience",
    "Creative Developer",
  ],
  authors: [{ name: "Hardik Madan" }],
  openGraph: {
    title: "HARDIKVERSE",
    description:
      "Enter the personal world of Hardik Madan. A curated experience of creativity, projects, and passion.",
    type: "website",
    siteName: "Hardikverse",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "HARDIKVERSE — An Interactive World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HARDIKVERSE",
    description:
      "Enter the personal world of Hardik Madan. A curated experience of creativity, projects, and passion.",
    images: ["/og.png"],
    creator: "@hardikmadan",
  },
  alternates: {
    canonical: "https://hardikverse.com/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="font-sans vignette-wrap">
        {children}
      </body>
    </html>
  );
}
