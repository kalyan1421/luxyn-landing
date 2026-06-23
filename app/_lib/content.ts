/**
 * Shared SEO content — single source of truth for the FAQ and the dedicated
 * landing pages. Both the on-page UI and the JSON-LD structured data read from
 * here, so the rich-result markup can never drift from what the user sees
 * (a Google requirement for FAQ/▸ rich results).
 */

/** Content freshness stamps — surfaced to humans ("Last updated") and to AI
 *  answer engines via schema dateModified, llms.txt, and facts.json. AI
 *  citations skew heavily toward recently-updated content, so bump `updated`
 *  whenever the copy meaningfully changes. Fixed strings keep the static export
 *  deterministic. */
export const contentDates = {
  published: "2026-06-18",
  updated: "2026-06-22",
} as const;

/* ── FAQ ──────────────────────────────────────────────────────────────────
 * Targets the real long-tail questions people ask before renting a salon
 * suite. Rendered on the home page AND emitted as FAQPage JSON-LD, which is
 * exactly the format AI answer engines (ChatGPT, Perplexity, AI Overviews)
 * lift from. Keep answers self-contained — one question, one clear answer. */
export const faqs = [
  {
    q: "What is a salon suite?",
    a: "A salon suite is a private, lockable room that an independent beauty or wellness professional leases as their own studio. You get your own dedicated space to serve clients — instead of renting a chair in a shared, open salon — while LUXYN handles the building, amenities, and upkeep.",
  },
  {
    q: "Who can rent a suite at LUXYN?",
    a: "LUXYN suites are built for independent professionals across beauty and wellness — hair stylists, colorists, nail artists, estheticians, brow and lash artists, massage therapists, and wellness practitioners. If you run your own book of clients, a private suite gives you the space to grow.",
  },
  {
    q: "Where is LUXYN located?",
    a: "LUXYN is in Leander, TX at 14300 Ronald Reagan Blvd, Building 8 — convenient to the greater Austin area and easy for your clients to reach, with on-site parking.",
  },
  {
    q: "What's included in the lease?",
    a: "Your private suite comes with the things that let you focus on your craft: 24/7 secure access, high-speed fiber Wi-Fi, on-site laundry, a styled client lounge, daily cleaning of shared areas, and the freedom to brand and decorate your suite. A real person is on site to welcome your clients.",
  },
  {
    q: "Can I set my own hours and prices?",
    a: "Yes. You own your business completely — your schedule, your pricing, your brand, and your client relationships. LUXYN provides the space and support; how you run your studio is entirely yours.",
  },
  {
    q: "How much does it cost to rent a salon suite?",
    a: "Lease rates depend on suite size and availability. The simplest way to get current pricing is to book a private tour — we'll walk you through the available suites in person and share exact terms.",
  },
  {
    q: "How do I lease a suite or book a tour?",
    a: "Use the contact form on this site to either reserve a suite or book a private tour. Tell us about your craft and the space you envision, and our team will reach out to confirm availability and arrange your visit.",
  },
  {
    q: "I'm a client — how do I find a professional at LUXYN?",
    a: "LUXYN is home to a range of independent beauty and wellness professionals. Browse the artistry on our site to see the categories working from LUXYN, then connect with the professional that fits what you're looking for.",
  },
] as const;

/* ── Dedicated SEO landing pages ──────────────────────────────────────────
 * Each entry becomes a real crawlable route (/<slug>) with its own <title>,
 * description, H1 and content — giving search engines a focused page per topic
 * while the home page keeps its single-scroll experience. `homeAnchor` deep-
 * links back into that experience so navigation still feels continuous. */
export type SeoPage = {
  slug: string;
  /** Short label for nav / footer / breadcrumb. */
  navLabel: string;
  /** Page <title> — the layout template appends " — LUXYN". */
  title: string;
  description: string;
  /** Small eyebrow above the H1. */
  kicker: string;
  h1: string;
  /** Lead paragraphs. */
  intro: string[];
  /** Feature bullets surfaced as a list. */
  points: { title: string; body: string }[];
  /** Section id on the home page this topic maps to (deep-link target). */
  homeAnchor: string;
  /** Primary call-to-action shown at the foot of the page. */
  cta: { label: string; href: string };
};

export const seoPages: SeoPage[] = [
  {
    slug: "salon-suites",
    navLabel: "Salon Suites",
    title: "Private Salon Suites for Rent in Leander, TX",
    description:
      "Lease a private, design-led salon suite in Leander, TX. Own your hours, your brand, and your client experience in an elevated space built for independent beauty professionals.",
    kicker: "PRIVATE SUITES",
    h1: "Private salon suites for rent in Leander, TX",
    intro: [
      "LUXYN leases private, design-led salon suites to independent beauty and wellness professionals in Leander, TX. Each suite is a finished, lockable studio — a destination for your clients, not a cubicle.",
      "Founded on the belief that environment dictates energy, LUXYN gives you a curated atmosphere that elevates the client experience and supports your growth, with the independence to run your business your way.",
    ],
    points: [
      { title: "Design-led suites", body: "The most beautiful private suites in the category — finished to feel like a destination." },
      { title: "Independence, supported", body: "Own your business and your hours. Lean on LUXYN for the front desk, upkeep, and marketing." },
      { title: "Wellness under one roof", body: "Hair, skin, nails, brows, massage and more — a full sensory experience for every client." },
      { title: "On-site care", body: "A real person on site every day to welcome your clients and keep your space effortless." },
    ],
    homeAnchor: "philosophy",
    cta: { label: "Lease a suite", href: "/contact" },
  },
  {
    slug: "amenities",
    navLabel: "Amenities",
    title: "Salon Suite Amenities in Leander, TX",
    description:
      "Every LUXYN suite includes 24/7 secure access, high-speed fiber Wi-Fi, on-site laundry, a styled client lounge, daily common-area care, and custom branding — designed around comfort, care, and craft.",
    kicker: "AMENITIES",
    h1: "Salon suite amenities designed around comfort, care, and craft",
    intro: [
      "A LUXYN suite comes with everything you need to deliver a premium experience and run an effortless studio. The amenities are included so you can focus entirely on your clients and your craft.",
    ],
    points: [
      { title: "24/7 secure access", body: "Your business, your hours. Complete autonomy with a state-of-the-art security system for peace of mind." },
      { title: "On-site laundry", body: "Complimentary high-capacity laundry facilities to keep your workflow seamless and stress-free." },
      { title: "Client lounge", body: "A sophisticated waiting area with specialty coffee and refreshments to delight your guests." },
      { title: "High-speed fiber", body: "Dedicated enterprise-grade Wi-Fi for seamless booking, processing, and social media." },
      { title: "Daily common care", body: "Professional cleaning of all shared areas keeps the facility reflecting your high standards." },
      { title: "Custom branding", body: "Paint and decorate your suite to match your brand's unique identity and aesthetic." },
    ],
    homeAnchor: "amenities",
    cta: { label: "Book a tour", href: "/contact" },
  },
  {
    slug: "gallery",
    navLabel: "Gallery",
    title: "Salon Suites for Every Beauty & Wellness Professional",
    description:
      "From hair stylists and colorists to nail artists, estheticians, brow & lash artists, and massage therapists — LUXYN suites in Leander, TX are home to diverse independent artistry.",
    kicker: "DIVERSE ARTISTRY",
    h1: "A space for independent beauty & wellness professionals",
    intro: [
      "LUXYN is home to a diverse community of independent professionals. Whatever your specialty, there's a private suite designed to showcase your work and elevate how clients experience your brand.",
    ],
    points: [
      { title: "Hair stylists & colorists", body: "Private, well-lit suites built for cut, color, and styling work." },
      { title: "Nail artists", body: "Dedicated space for a calm, premium nail experience." },
      { title: "Estheticians", body: "Treatment-ready rooms for skin and facial services." },
      { title: "Brow & lash artists", body: "Quiet, focused suites for detailed brow and lash work." },
      { title: "Massage therapists", body: "Serene, private rooms for massage and bodywork." },
      { title: "Wellness practitioners", body: "Flexible suites for the full range of wellness services." },
    ],
    homeAnchor: "gallery",
    cta: { label: "Lease a suite", href: "/contact" },
  },
  {
    slug: "find-a-pro",
    navLabel: "Find a Pro",
    title: "Find a Beauty or Wellness Professional in Leander, TX",
    description:
      "Looking for a stylist, nail artist, esthetician, or massage therapist near Leander, TX? Discover independent beauty and wellness professionals working from LUXYN.",
    kicker: "FOR CLIENTS",
    h1: "Find a beauty or wellness professional in Leander, TX",
    intro: [
      "Looking for a professional? LUXYN is home to independent beauty and wellness experts across hair, skin, nails, brows, lashes, massage, and more — each working from their own private suite in Leander, TX.",
      "Explore the artistry working from LUXYN and connect with the professional that fits exactly what you're looking for.",
    ],
    points: [
      { title: "Independent experts", body: "Every professional runs their own studio and owns their client experience." },
      { title: "Private, comfortable suites", body: "Enjoy your service in a calm, private space — not a busy open floor." },
      { title: "A range of specialties", body: "Hair, skin, nails, brows, lashes, massage, and wellness, all under one roof." },
    ],
    homeAnchor: "findpro",
    cta: { label: "Explore the gallery", href: "/gallery" },
  },
  {
    slug: "contact",
    navLabel: "Contact",
    title: "Contact — Lease a Suite or Book a Tour in Leander, TX",
    description:
      "Get in touch with LUXYN in Leander, TX to reserve your private salon suite or book a tour. Email, call, or send an enquiry and our team will arrange your visit.",
    kicker: "GET IN TOUCH",
    h1: "Contact LUXYN in Leander, TX",
    intro: [
      "Ready to make LUXYN your professional home? Reserve a private suite or book a tour and our team will reach out to confirm availability and walk you through the space in person.",
    ],
    points: [],
    homeAnchor: "contact",
    cta: { label: "Reserve your suite", href: "/#contact" },
  },
];
