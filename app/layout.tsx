import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, EB_Garamond, Inter, Jost } from "next/font/google";
import "./globals.css";
import { site, fullAddress } from "./_lib/site";
import { faqs, contentDates } from "./_lib/content";

/* Self-hosted via next/font — no render-blocking <link> to Google, automatic
 * `font-display: swap`, and size-adjusted fallbacks that cut layout shift.
 * Each exposes a CSS variable that globals.css maps onto the Tailwind font-* keys. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"], weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant", display: "swap",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin"], weight: ["400"],
  variable: "--font-eb", display: "swap",
});
const inter = Inter({
  subsets: ["latin"], weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"], variable: "--font-inter", display: "swap",
});
const jost = Jost({
  subsets: ["latin"], weight: ["400", "600"],
  variable: "--font-jost", display: "swap",
});
const fontVars = `${cormorant.variable} ${ebGaramond.variable} ${inter.variable} ${jost.variable}`;

const GA_MEASUREMENT_ID = "G-YRH0H9ZJPP";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "salon suites",
    "salon suite rental",
    "beauty studio rental",
    "wellness suite lease",
    "private beauty suites",
    "independent stylist space",
    "esthetician room rental",
    site.name,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: "en_US",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — private, design-led beauty & wellness suites`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  // Icons are provided by file conventions: app/icon.svg, app/apple-icon.png,
  // app/favicon.ico — Next emits the <link> tags automatically.
  // Search-console ownership tags — only emitted once a token is set in site.ts.
  ...((site.verification.google || site.verification.bing)
    ? {
        verification: {
          ...(site.verification.google ? { google: site.verification.google } : {}),
          ...(site.verification.bing ? { other: { "msvalidate.01": site.verification.bing } } : {}),
        },
      }
    : {}),
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#142337",
  colorScheme: "dark light",
};

/* ── Structured data (JSON-LD) ──────────────────────────────────────────────
 * One connected @graph so Google can resolve Organization ↔ WebSite ↔ WebPage
 * ↔ LocalBusiness by @id. Optional fields (geo, opening hours, verification)
 * are only included once their real values are set in site.ts. */
const orgId = `${site.url}/#organization`;
const siteId = `${site.url}/#website`;
const businessId = `${site.url}/#localbusiness`;
const sameAs = Object.values(site.socials).filter(Boolean);

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.contact.address.street,
  addressLocality: site.contact.address.locality,
  addressRegion: site.contact.address.region,
  postalCode: site.contact.address.postalCode,
  addressCountry: site.contact.address.country,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: site.name,
      url: site.url,
      description: site.description,
      slogan: site.tagline,
      logo: { "@type": "ImageObject", url: `${site.url}${site.logo}`, width: 1200, height: 1200 },
      image: `${site.url}${site.ogImage}`,
      email: site.contact.email,
      telephone: site.contact.phone,
      address: postalAddress,
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-US",
      publisher: { "@id": orgId },
    },
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: `${site.url}/`,
      name: site.title,
      description: site.description,
      inLanguage: "en-US",
      isPartOf: { "@id": siteId },
      about: { "@id": businessId },
      primaryImageOfPage: `${site.url}${site.ogImage}`,
    },
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": businessId,
      name: site.name,
      description: site.description,
      url: site.url,
      image: `${site.url}${site.ogImage}`,
      logo: `${site.url}${site.logo}`,
      email: site.contact.email,
      telephone: site.contact.phone,
      priceRange: site.business.priceRange,
      currenciesAccepted: "USD",
      address: postalAddress,
      areaServed: [
        { "@type": "City", name: "Leander" },
        { "@type": "City", name: "Cedar Park" },
        { "@type": "City", name: "Austin" },
      ],
      parentOrganization: { "@id": orgId },
      ...(sameAs.length ? { sameAs } : {}),
      ...(site.business.openingHours.length ? { openingHours: site.business.openingHours } : {}),
      ...(site.business.geo.latitude && site.business.geo.longitude
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: site.business.geo.latitude,
              longitude: site.business.geo.longitude,
            },
          }
        : {}),
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Private salon & wellness suite leasing",
          serviceType: "Salon suite rental",
          provider: { "@id": orgId },
          areaServed: {
            "@type": "City",
            name: site.contact.address.locality,
          },
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${site.url}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      ],
    },
    {
      // FAQ rich results + a clean source for AI answer engines. Mirrors the
      // on-page FAQ exactly (Google requires the markup match visible content).
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      isPartOf: { "@id": siteId },
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        datePublished: contentDates.published,
        dateModified: contentDates.updated,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      // Customer testimonial shown on the page, marked up as a Review of the
      // business. NOTE: no numeric rating is asserted here because the
      // testimonial carries none — to earn star snippets, wire a real
      // AggregateRating sourced from genuine customer ratings (e.g. Google).
      "@type": "Review",
      "@id": `${site.url}/#review-sarah-j`,
      itemReviewed: { "@id": businessId },
      author: { "@type": "Person", name: "Sarah J." },
      reviewBody:
        "Luxyn has completely transformed how my clients perceive my brand.",
      publisher: { "@id": orgId },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        {/* Hero background is a CSS background-image, so the browser can't
            discover it until stylesheets parse. Preload it at high priority to
            cut LCP — it's the largest above-the-fold paint. */}
        <link rel="preload" as="image" href="/assets/hero-bg.webp" fetchPriority="high" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="author" href={`mailto:${site.contact.email}`} />
        <meta itemProp="name" content={site.name} />
        <meta name="geo.placename" content={fullAddress} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </html>
  );
}
