import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";

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
  metadataBase: new URL("https://aioutsourcehub.com"),
  title: {
    default: "AI Outsource Hub - Growth Services for Local Businesses",
    template: "%s - AI Outsource Hub",
  },
  description:
    "Done-for-you growth for local businesses. Reviews, voice answering, and search visibility — run for you, not in a dashboard. Starts at $49/mo. No contract.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Outsource Hub — You run your business. We run the rest.",
    description:
      "Done-for-you growth for local businesses. Reviews, voice answering, and search visibility. Starts at $49/mo. No contract.",
    url: "https://aioutsourcehub.com",
    siteName: "AI Outsource Hub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Outsource Hub — You run your business. We run the rest.",
    description:
      "Done-for-you growth for local businesses. Reviews, voice answering, search visibility. Starts at $49/mo. No contract.",
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
  name: "AI Outsource Hub",
  url: "https://aioutsourcehub.com",
  description:
    "AI Outsource Hub runs growth services for local businesses - review automation, voice answering, search visibility, lead generation, and custom agents built around your business. You run your business. We run the rest.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "support",
    email: "support@aioutsourcehub.com",
  },
  sameAs: [
    "https://www.linkedin.com/company/ai-outsource-hub",
    "https://www.facebook.com/aioutsourcehub",
    "https://www.instagram.com/aioutsourcehub",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI Outsource Hub",
  url: "https://aioutsourcehub.com",
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
      </body>
    </html>
  );
}
