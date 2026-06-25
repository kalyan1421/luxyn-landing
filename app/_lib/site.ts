/**
 * Single source of truth for site-wide constants.
 *
 * ⚠️ BEFORE LAUNCH — replace every value marked `PLACEHOLDER` with the real
 * thing. Everything else (SEO metadata, sitemap, footer, structured data,
 * contact form) reads from here, so you only change it once.
 */

export const site = {
  name: "LUXYN",
  /** Production origin — used for canonical URLs, sitemap, and Open Graph. */
  url: "https://luxynstudios.com",
  /** Home <title>. Leads with the primary keyword + city so the page can rank
   *  for local intent ("salon suites Leander TX"), then the brand promise. */
  title: "Salon & Wellness Suites for Rent in Leander, TX | LUXYN",
  description:
    "LUXYN leases private, design-led salon & wellness suites in Leander, TX to independent beauty professionals — hair, skin, nails, brows & massage. Flexible leasing, premium amenities, the freedom to build and grow.",
  /** Short, punchy strapline — used as the site's slogan in structured data. */
  tagline: "Private, design-led salon & wellness suites in Leander, TX.",
  /** OG / Twitter share image (lives in /public/assets). Purpose-built 1200×630
   *  card — small + correctly sized so every share scraper accepts it. */
  ogImage: "/assets/og.jpg",
  /** Square brand mark (1200×1200) — used for the manifest, Apple touch icon,
   *  and the `logo` field in Organization / LocalBusiness structured data. */
  logo: "/assets/logo.png",

  // ════════════════════════════════════════════════════════════════════
  //  ⚠️  FILL BEFORE LAUNCH — every value below is fake placeholder data.
  //  Replace with the real LUXYN business details. These feed the footer,
  //  the contact section, AND the SEO/JSON-LD structured data, so getting
  //  them right matters for both customers and search engines.
  //  Checklist:  [ ] email   [x] phone + phoneHref   [x] full address
  //              [ ] social handles   [ ] contactEndpoint (see below)
  // ════════════════════════════════════════════════════════════════════

  /** Contact details — surface in the footer + JSON-LD structured data. */
  contact: {
    email: "luxynsales@gmail.com", // primary sales/lead inbox
    phone: "+1 737-287-7396", // display format
    phoneHref: "+17372877396", // same number, digits + leading "+" only, for tel:
    address: {
      street: "14300 Ronald Reagan Blvd, Building 8",
      locality: "Leander", // city
      region: "TX", // state / region
      postalCode: "78641",
      country: "US", // ISO country code
    },
  },

  /** Social profiles — empty strings are hidden in the footer. */
  socials: {
    instagram: "https://www.instagram.com/luxynstudios/",
    facebook: "https://facebook.com/luxynstudios",
    x: "https://x.com/luxynstudios",
    youtube: "https://www.youtube.com/@LuxynStudios",
    pinterest: "https://www.pinterest.com/luxynstudios/",
    linkedin: "https://www.linkedin.com/company/luxynstudios/",
  },

  /**
   * Contact-form delivery endpoint. This is a static export with no server, so
   * the form POSTs to a Cloudflare Worker (see /worker) that sends the enquiry
   * via Resend. Both enquiry types (lease + tour) POST here with a `variant`
   * field. Deploy the Worker, then paste its URL below. While left as the
   * placeholder, the form short-circuits to a friendly "not configured" message
   * instead of silently dropping leads.
   */
  contactEndpoint: "https://luxyn-contact.luxyn.workers.dev", // deployed Cloudflare Worker (see /worker)

  /** Cloudflare Turnstile site key — spam protection for the contact form.
   *  Leave "" to disable the widget entirely. When set, also configure the
   *  matching TURNSTILE_SECRET in the Worker (see /worker). */
  turnstileSiteKey: "", // optional — paste Turnstile site key, or leave "" to disable

  /** Extra signals for richer search results (Google LocalBusiness rich data). */
  business: {
    /** Price band shown in LocalBusiness rich results: "$" – "$$$$". */
    priceRange: "$$", // TODO PLACEHOLDER — confirm band
    /** Concrete, citation-ready facts for AEO — AI answer engines cite specific
     *  numbers, not adjectives. Fill each with the REAL value before launch.
     *  Empty strings are omitted everywhere (facts.json, llms.txt, llms-full.txt),
     *  so it is safe to ship blank — but DO NOT invent these. */
    facts: {
      suiteCount: "", // e.g. "24" — number of private suites available to lease
      suiteSizeRange: "", // e.g. "90–160 sq ft" — typical suite footprint
      leaseTerms: "", // e.g. "Flexible monthly and annual leases"
      yearEstablished: "", // e.g. "2026"
    },
    /** Real, sourced customer ratings (e.g. aggregated from Google reviews) —
     *  enables star rich results on the LocalBusiness. NEVER hand-write these:
     *  self-authored ratings violate Google's policy and earn no stars. Leave
     *  reviewCount: 0 to omit the AggregateRating from structured data entirely. */
    aggregateRating: {
      ratingValue: "", // e.g. "4.9" — average of genuine customer ratings
      reviewCount: 0, // e.g. 37 — number of ratings behind the average
    },
    /** Map coordinates for the LocalBusiness "geo" — improves local/Maps SEO.
     *  Leave both "" until known; empty values are omitted from structured data. */
    geo: {
      // ⚠️ APPROXIMATE — derived from the street address (Ronald Reagan Blvd,
      // Leander TX 78641). Replace with the exact rooftop pin from Google Maps
      // before launch so the LocalBusiness marker lands on the building.
      latitude: "30.5788",
      longitude: "-97.8531",
    },
    /** Opening hours in schema.org format. Leave [] to omit.
     *  ⚠️ TODO — set the real leasing-office hours before launch. Publishing
     *  wrong hours here surfaces them in Google/Maps, so left empty until known.
     *  Example: ["Mo-Fr 09:00-18:00", "Sa 10:00-16:00"] */
    openingHours: [] as string[],
  },

  /** Search-engine ownership verification tokens. Paste the value from the
   *  provider's TXT/meta verification step; empty strings are omitted. */
  verification: {
    google: "", // TODO PLACEHOLDER — Google Search Console meta token
    bing: "", // TODO PLACEHOLDER — Bing Webmaster Tools meta token
  },
} as const;

/** True once the real Worker URL has been pasted into `contactEndpoint`. */
export const isFormConfigured = (): boolean =>
  !site.contactEndpoint.includes("YOUR-SUBDOMAIN");

export const fullAddress = [
  site.contact.address.street,
  `${site.contact.address.locality}, ${site.contact.address.region} ${site.contact.address.postalCode}`,
].join(", ");
