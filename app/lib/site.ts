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
  title: "LUXYN — Space to do your best work",
  description:
    "LUXYN leases private, design-led suites to independent beauty and wellness professionals — the freedom to build, serve, and grow in an elevated space.",
  /** Short, punchy strapline — used as the site's slogan in structured data. */
  tagline: "Private, design-led suites for beauty & wellness professionals.",
  /** OG / Twitter share image (lives in /public/assets). 1536×1024 source. */
  ogImage: "/assets/cta-bg.png",
  /** Square brand mark (1200×1200) — used for the manifest, Apple touch icon,
   *  and the `logo` field in Organization / LocalBusiness structured data. */
  logo: "/assets/logo.png",

  // ════════════════════════════════════════════════════════════════════
  //  ⚠️  FILL BEFORE LAUNCH — every value below is fake placeholder data.
  //  Replace with the real LUXYN business details. These feed the footer,
  //  the contact section, AND the SEO/JSON-LD structured data, so getting
  //  them right matters for both customers and search engines.
  //  Checklist:  [ ] email   [x] phone + phoneHref   [x] full address
  //              [ ] social handles   [ ] formEndpoint (see below)
  // ════════════════════════════════════════════════════════════════════

  /** Contact details — surface in the footer + JSON-LD structured data. */
  contact: {
    email: "hello@luxynstudios.com", // TODO PLACEHOLDER — real inbox that monitors leads
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
    instagram: "https://instagram.com/luxynstudios", // TODO PLACEHOLDER — confirm handle (or "" to hide)
    facebook: "", // TODO PLACEHOLDER — add URL or leave "" to hide
    linkedin: "https://linkedin.com/company/luxynstudios", // TODO PLACEHOLDER — confirm handle (or "" to hide)
  },

  /**
   * Contact-form submission endpoint. This is a static export, so the form
   * POSTs to a third-party service. Create a free form at https://formspree.io
   * (or similar) and paste its endpoint here. While left as the placeholder,
   * the form short-circuits to a friendly "not configured" message instead of
   * silently failing.
   */
  // ⚠️ CRITICAL — until this is set to a real endpoint, NO enquiry is delivered.
  //    The form detects the placeholder and shows a "not connected yet" message
  //    instead of silently dropping leads. Create a free form at
  //    https://formspree.io (or similar) and paste its endpoint here.
  formEndpoint: "https://formspree.io/f/your-form-id", // TODO PLACEHOLDER — wire up before launch

  /** Extra signals for richer search results (Google LocalBusiness rich data). */
  business: {
    /** Price band shown in LocalBusiness rich results: "$" – "$$$$". */
    priceRange: "$$", // TODO PLACEHOLDER — confirm band
    /** Map coordinates for the LocalBusiness "geo" — improves local/Maps SEO.
     *  Leave both "" until known; empty values are omitted from structured data. */
    geo: {
      latitude: "", // TODO PLACEHOLDER — e.g. "34.0696"
      longitude: "", // TODO PLACEHOLDER — e.g. "-118.4053"
    },
    /** Opening hours in schema.org format. Leave [] to omit.
     *  Example: ["Mo-Fr 09:00-19:00", "Sa 10:00-17:00"] */
    openingHours: [] as string[], // TODO PLACEHOLDER
  },

  /** Search-engine ownership verification tokens. Paste the value from the
   *  provider's TXT/meta verification step; empty strings are omitted. */
  verification: {
    google: "", // TODO PLACEHOLDER — Google Search Console meta token
    bing: "", // TODO PLACEHOLDER — Bing Webmaster Tools meta token
  },
} as const;

/** True once a real form endpoint has been configured. */
export const isFormConfigured = !site.formEndpoint.includes("your-form-id");

export const fullAddress = [
  site.contact.address.street,
  `${site.contact.address.locality}, ${site.contact.address.region} ${site.contact.address.postalCode}`,
].join(", ");
