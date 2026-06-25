import { site, fullAddress } from "../../_lib/site";
import { contentDates } from "../../_lib/content";

/**
 * /facts.json — machine-readable facts panel (per AEO best practice). Lets AI
 * agents fetch structured, dated facts about LUXYN directly and check staleness
 * via `lastUpdated`. Only verifiable, first-party facts are listed here — no
 * unsourced statistics.
 */
export const dynamic = "force-static";

function build() {
  const asOf = contentDates.updated;
  const f = site.business.facts;
  // Concrete, specific facts are only emitted once a real value is set in
  // site.ts — AI engines cite numbers, but inventing them would be worse than
  // omitting them, so empty values are filtered out here.
  const concreteFacts = [
    f.suiteCount && { id: "suite_count", value: `${f.suiteCount} private salon & wellness suites`, source: `${site.url}/salon-suites`, as_of: asOf },
    f.suiteSizeRange && { id: "suite_size", value: f.suiteSizeRange, source: `${site.url}/salon-suites`, as_of: asOf },
    f.leaseTerms && { id: "lease_terms", value: f.leaseTerms, source: `${site.url}/salon-suites`, as_of: asOf },
    f.yearEstablished && { id: "year_established", value: f.yearEstablished, source: `${site.url}/`, as_of: asOf },
  ].filter(Boolean);
  return {
    page: `${site.url}/`,
    organization: site.name,
    version: contentDates.updated,
    lastUpdated: `${contentDates.updated}T00:00:00Z`,
    facts: [
      { id: "business_type", value: "Private salon & wellness suite leasing", source: `${site.url}/salon-suites`, as_of: asOf },
      { id: "location", value: `${fullAddress}, US`, source: `${site.url}/contact`, as_of: asOf },
      { id: "area_served", value: "Leander, Cedar Park, and the greater Austin, TX area", source: `${site.url}/`, as_of: asOf },
      { id: "email", value: site.contact.email, source: `${site.url}/contact`, as_of: asOf },
      { id: "phone", value: site.contact.phone, source: `${site.url}/contact`, as_of: asOf },
      {
        id: "tenants",
        value: "Independent hair stylists, colorists, nail artists, estheticians, brow & lash artists, massage therapists, and wellness practitioners",
        source: `${site.url}/gallery`,
        as_of: asOf,
      },
      {
        id: "amenities",
        value: "24/7 secure access, high-speed fiber Wi-Fi, on-site laundry, client lounge, daily common-area cleaning, custom suite branding",
        source: `${site.url}/amenities`,
        as_of: asOf,
      },
      {
        id: "lease_model",
        value: "Professionals lease a private, lockable suite and keep full ownership of their business, schedule, pricing, brand, and clients",
        source: `${site.url}/salon-suites`,
        as_of: asOf,
      },
      { id: "price_range", value: site.business.priceRange, source: `${site.url}/`, as_of: asOf },
      ...concreteFacts,
      { id: "how_to_start", value: "Book a private tour or reserve a suite via the contact page", source: `${site.url}/contact`, as_of: asOf },
    ],
  };
}

export function GET() {
  return new Response(JSON.stringify(build(), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
