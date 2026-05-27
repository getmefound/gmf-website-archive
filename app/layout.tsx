import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CheckoutClickTracker } from "@/components/checkout/CheckoutClickTracker";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getmefound.ai"),
  title: {
    default: "GetMeFound - AI Search Visibility for Local Businesses",
    template: "%s - GetMeFound",
  },
  description:
    "GetMeFound helps local businesses get found and recommended in Google, Maps, AI search, and near-me moments.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "GetMeFound - Be the local business AI recommends.",
    description:
      "AI search visibility, Google Business Profile cleanup, reviews, and local trust signals for service businesses.",
    url: "https://getmefound.ai",
    siteName: "GetMeFound",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetMeFound - Be the local business AI recommends.",
    description:
      "AI search visibility, Google Business Profile cleanup, reviews, and local trust signals for service businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GetMeFound",
  url: "https://getmefound.ai",
  description:
    "GetMeFound helps local businesses get found and recommended in Google, Maps, AI search, and near-me moments.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "support",
    email: "support@getmefound.ai",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GetMeFound",
  url: "https://getmefound.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-accent-text)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navbar />
        {children}
        <Footer />
        <CheckoutClickTracker />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
