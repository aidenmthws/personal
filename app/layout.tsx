import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/landings";
import { rideOptInScript } from "@/lib/ride";

import "./globals.css";

/* Fraunces and Instrument Sans are cut down to printable ASCII and weights 400
   to 500, which is all the site uses. Add glyphs here before using others. */
const fraunces = localFont({
  src: "./fonts/fraunces-latin-ascii.woff2",
  weight: "400 500",
  variable: "--font-fraunces",
});

const instrumentSans = localFont({
  src: "./fonts/instrument-sans-latin-ascii.woff2",
  weight: "400 500",
  variable: "--font-instrument-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.pageTitle,
  description: site.shareDescription,
  openGraph: {
    title: site.pageTitle,
    description: site.shareDescription,
    siteName: site.name,
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrumentSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: rideOptInScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
