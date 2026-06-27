/**
 * Blog content — single source of truth for the LUXYN blog. Mirrors the pattern
 * in content.ts: posts are typed data, and every surface (the /blog index, each
 * /blog/<slug> article, the sitemap, the llms feeds and the JSON-LD) reads from
 * this one list so nothing can drift.
 *
 * Posts are authored as structured blocks (not raw HTML/MDX) so they render with
 * the site's exact type scale and stay safe to emit into the llms-full feed.
 *
 * To add a post: append a BlogPost to `blogPosts`. The route, sitemap entry,
 * structured data, nav discoverability and feeds all update automatically.
 */
import type { Metadata } from "next";
import { site } from "./site";

/** A single block of article body copy. Kept deliberately small — enough to
 *  write a real, well-structured SEO article without an HTML parser. */
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  /** A figure with caption — in-body image or diagram. `src` lives in /public. */
  | { type: "image"; src: string; alt: string; caption?: string }
  /** An inline call-to-action band placed mid-article. */
  | { type: "cta"; label: string; href: string; text?: string }
  /** A market-insight / stat callout — a big number with a label and source. */
  | { type: "stat"; value: string; label: string; source?: string }
  /** A comparison table. First row of `rows` is data; `columns` is the header. */
  | { type: "table"; columns: string[]; rows: string[][]; caption?: string };

/** A single FAQ entry shown in the article's FAQ section and emitted as FAQPage
 *  JSON-LD so the article is eligible for an FAQ rich result. */
export type BlogFaq = { q: string; a: string };

export type BlogPost = {
  /** Clean URL slug — the article lives at /blog/<slug>. */
  slug: string;
  /** Page <title>; the layout template appends " — LUXYN". */
  title: string;
  /** Meta description + the excerpt shown on the index card. */
  description: string;
  /** Small eyebrow above the H1 — also used as the article category. */
  kicker: string;
  h1: string;
  /** ISO dates (fixed strings keep the static export deterministic). */
  published: string;
  updated: string;
  /** Estimated read time in minutes, shown in the byline. */
  readMins: number;
  author: string;
  /** Featured image (in /public/assets) — shown on the index card and as the
   *  article's banner. */
  image: string;
  /** Article body, rendered in order. */
  body: BlogBlock[];
  /** Topic tags shown as a tag cloud at the foot of the article. */
  tags?: string[];
  /** Question/answer pairs rendered as an FAQ section + FAQPage JSON-LD. */
  faqs?: BlogFaq[];
  /** Call-to-action at the foot of the article. */
  cta: { label: string; href: string };
  /** Set true for step-by-step guides whose H2s are numbered ("1. …", "2. …").
   *  Emits HowTo JSON-LD (in addition to BlogPosting) so the article is eligible
   *  for how-to treatment and gives AI answer engines clean, ordered steps. */
  howTo?: boolean;
};

/** Shared author note shown at the foot of every article. */
export const authorBio =
  "The LUXYN team helps independent beauty and wellness professionals find their footing as studio owners — from first tour to opening day — at our private salon suites in Leander, TX.";

/** Metadata for the /blog index route itself. */
export const blogIndex = {
  slug: "blog",
  navLabel: "Blog",
  title: "Salon Suite Insights & Guides — Leander, TX",
  description:
    "Practical guides for independent beauty & wellness pros — salon suite costs, booth-rental comparisons, and how to launch your own studio in Leander, TX.",
  kicker: "THE LUXYN JOURNAL",
  h1: "Insights for independent beauty & wellness pros",
  intro:
    "Practical, no-fluff guides on renting a salon suite, owning your book, and building a business you control — written for stylists, estheticians, and wellness pros in the greater Austin area.",
  image: "/assets/findpro-a.webp",
} as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "salon-suite-rentals-guide",
    title: "The Ultimate Guide to Renting a Salon Suite in 2026",
    description:
      "Thinking about renting a salon suite? A complete guide to salon suite rentals — costs, benefits, amenities, leasing tips, and how to choose the right space for your beauty business.",
    kicker: "SALON SUITE RENTALS",
    h1: "The ultimate guide to renting a salon suite in 2026",
    published: "2026-06-27",
    updated: "2026-06-27",
    readMins: 12,
    author: "LUXYN",
    image: "/assets/hero-arch.webp",
    body: [
      { type: "p", text: "The beauty and wellness industry has changed dramatically over the past decade. Today, professionals want more than a chair inside a busy salon — they want independence, flexibility, and the chance to build a business that reflects their own brand and vision. That shift is what has fueled the fast-growing demand for salon suite rentals." },
      { type: "p", text: "Instead of working under someone else's business, beauty professionals can lease a fully equipped private suite, welcome clients into a personalized environment, and manage every part of their business on their own terms. Whether you're a hairstylist, esthetician, barber, nail technician, lash artist, makeup artist, massage therapist, or wellness professional, renting a salon suite can be a major step toward a sustainable, independent career." },
      { type: "p", text: "This guide explains what salon suite rentals are, how they work, what they cost, who they're best for, and how to choose the right location for your business." },
      { type: "image", src: "/assets/about-1.webp", alt: "A private, finished salon suite at LUXYN in Leander, TX", caption: "A private LUXYN suite — a finished, brandable studio rather than a chair on an open floor." },

      { type: "h2", text: "What is a salon suite?" },
      { type: "p", text: "A salon suite is a private, self-contained workspace that beauty and wellness professionals lease to operate their own independent businesses. Unlike a traditional salon where many professionals work together under one business, a salon suite gives you an exclusive space where you control your schedule, pricing, services, branding, and client experience." },
      { type: "p", text: "Many salon suites are fully furnished and move-in ready, so you can start serving clients with minimal setup. Depending on the location, suites may include salon stations, shampoo bowls, cabinetry, utility access, Wi-Fi, parking, security, and shared amenities. Suite rentals have become popular because they offer the freedom to operate independently while avoiding the high costs and responsibilities of opening a full-service salon." },
      { type: "quote", text: "A salon suite is a private workspace you rent to run your own independent business — without owning or managing an entire salon." },

      { type: "h2", text: "Why salon suite rentals are growing so quickly" },
      { type: "p", text: "Consumers expect more personalized experiences, and professionals want greater control over how they serve their clients. Instead of working under fixed schedules, commission structures, and salon policies, many are choosing to become independent business owners. Some of the biggest reasons include:" },
      { type: "ul", items: [
        "Complete scheduling flexibility",
        "Higher earning potential",
        "Greater pricing control",
        "Personalized client experiences",
        "Professional privacy",
        "Stronger personal branding",
        "Better work-life balance",
      ] },
      { type: "p", text: "For clients, a private salon suite often creates a quieter, more comfortable environment where appointments feel exclusive and personal." },

      { type: "h2", text: "Who should rent a salon suite?" },
      { type: "p", text: "Salon suites suit a wide range of professionals across beauty and wellness. These businesses tend to thrive in a private suite:" },
      { type: "h3", text: "Hairstylists" },
      { type: "p", text: "Complete control over scheduling, pricing, and retail product selection — in a space that reflects their personal style." },
      { type: "h3", text: "Estheticians" },
      { type: "p", text: "Private treatment rooms are ideal for facials, skincare, and waxing, where privacy and comfort are essential." },
      { type: "h3", text: "Lash artists" },
      { type: "p", text: "A quiet, dedicated suite allows detailed work without distractions and a more relaxing experience for clients." },
      { type: "h3", text: "Nail technicians" },
      { type: "p", text: "An independent studio that showcases creativity while offering a personalized service experience." },
      { type: "h3", text: "Makeup artists" },
      { type: "p", text: "A beauty studio and consultation space in one — ideal for bridal, special events, and personal appointments." },
      { type: "h3", text: "Massage therapists" },
      { type: "p", text: "A private, calm setting designed specifically for wellness treatments." },
      { type: "h3", text: "Wellness professionals" },
      { type: "p", text: "Holistic therapies, wellness coaching, and specialized services benefit from a flexible, private workspace that enhances client comfort." },

      { type: "h2", text: "Benefits of renting a private salon suite" },
      { type: "p", text: "Choosing a salon suite isn't just about having your own space — it's about building a business that reflects your goals and values." },
      { type: "h3", text: "1. Be your own boss" },
      { type: "p", text: "You decide your hours, the services you offer, your pricing, your promotions, your client policies, and your business goals. Instead of following someone else's rules, you build a business that aligns with your vision." },
      { type: "h3", text: "2. Keep more of your earnings" },
      { type: "p", text: "Traditional salons often run on commission, where a portion of every service fee goes to the owner. With a suite, you typically pay a fixed rental fee and keep a larger share of your revenue — a predictable expense that makes planning easier and rewards growth." },
      { type: "h3", text: "3. Build your own brand" },
      { type: "p", text: "Your suite becomes an extension of your personal brand. From décor and color palette to music, scents, and the client experience, every detail can reflect your style and set you apart in a competitive market." },
      { type: "h3", text: "4. Create stronger client relationships" },
      { type: "p", text: "Clients appreciate the privacy and one-on-one attention of a suite. Without a busy salon floor, appointments feel more relaxed and personal, which builds trust, loyalty, and long-term relationships." },
      { type: "h3", text: "5. Enjoy a flexible schedule" },
      { type: "p", text: "Early mornings, evenings, weekends, or a four-day week — a suite lets you set a schedule that works for you and your clients." },

      { type: "h2", text: "Salon suite vs. traditional salon" },
      { type: "p", text: "Choosing between a traditional salon and a private suite is one of the biggest career decisions for beauty professionals. Both have advantages; the right choice depends on your goals, finances, and the independence you want." },
      { type: "table", columns: ["Feature", "Traditional salon", "Private salon suite"], rows: [
        ["Business ownership", "Salon owner", "You own your business"],
        ["Schedule", "Set by salon", "Flexible"],
        ["Pricing", "Controlled by salon", "You decide"],
        ["Branding", "Salon brand", "Your personal brand"],
        ["Client experience", "Shared space", "Private experience"],
        ["Earnings", "Salary or commission", "Keep more revenue"],
        ["Products", "Salon selected", "Your choice"],
        ["Décor", "Limited control", "Fully customizable"],
      ], caption: "If your goal is to build a long-term brand and lasting client relationships, a suite offers the independence many pros are looking for." },

      { type: "h2", text: "Salon suite vs. booth rental" },
      { type: "p", text: "Salon suites and booth rentals are sometimes confused, but they offer different experiences. With a booth rental, you rent a chair or station inside an existing salon. You may operate independently, but you still share the reception, waiting area, and overall environment with other professionals." },
      { type: "p", text: "A salon suite gives you an enclosed, private workspace. Clients enjoy a more personalized experience, and you have far greater control over your operations and atmosphere. A suite may be the better choice if you want greater privacy, a premium client experience, freedom to design your space, more control over branding, and flexible operations. Booth rentals can suit professionals just starting out — many later transition to suites as their business grows." },
      { type: "cta", text: "Want to see the difference in person rather than on paper?", label: "Book a tour", href: "/contact" },

      { type: "h2", text: "What's included in a luxury salon suite?" },
      { type: "p", text: "Every location is different, but premium salon suites typically include features that let you start serving clients immediately:" },
      { type: "ul", items: [
        "Fully furnished private suite",
        "Professional styling station",
        "Shampoo bowl (where applicable)",
        "Cabinets and storage",
        "Utility access",
        "High-speed Wi-Fi",
        "Air conditioning",
        "Secure building access",
        "Client waiting areas and restrooms",
        "Parking",
        "Laundry facilities (at some locations)",
        "Cleaning of common areas",
        "Business signage opportunities",
      ] },
      { type: "p", text: "Move-in-ready suites cut your startup time so you can focus on serving clients instead of managing renovations." },
      { type: "image", src: "/assets/gallery-1.webp", alt: "Styled common areas and amenities at LUXYN salon suites", caption: "Premium suites bundle the front-of-house and amenities so your craft, not the building, is your focus." },

      { type: "h2", text: "How much does a salon suite cost?" },
      { type: "p", text: "One of the most common questions is simply: how much does a salon suite cost? The answer depends on several factors — city, neighborhood, suite size, amenities, lease duration, and demand. Luxury markets generally carry higher rates than suburban or smaller cities." },
      { type: "p", text: "Rather than focusing on price alone, weigh the overall value: the professional environment, growth potential, client experience, location convenience, included amenities, and flexibility. Many professionals find that greater independence and stronger client retention help offset the rental cost over time." },
      { type: "stat", value: "40–60%", label: "of every ticket can go to the house on a typical commission split — the share a fixed suite lease lets you keep instead.", source: "Industry commission-split norms" },

      { type: "h2", text: "How to choose the right salon suite" },
      { type: "p", text: "Choosing the right suite is about more than finding an available space. It should support both your current needs and your long-term goals." },
      { type: "h3", text: "1. Choose the right location" },
      { type: "p", text: "Look for areas convenient for your target clients, with ample parking and easy access." },
      { type: "h3", text: "2. Evaluate the building" },
      { type: "p", text: "Is the property clean? Is it professionally maintained? Does it reflect the image you want for your brand? First impressions matter." },
      { type: "h3", text: "3. Consider amenities" },
      { type: "p", text: "Some amenities save significant costs over time. Look for internet, utilities, security, laundry, a reception area, a break room, and parking." },
      { type: "h3", text: "4. Understand the lease" },
      { type: "p", text: "Before signing, review the lease length, ask about renewal options, understand maintenance responsibilities, and clarify policies on signage and customization." },
      { type: "h3", text: "5. Think about future growth" },
      { type: "p", text: "Choose a location where your business can grow without forcing another move in the near future." },

      { type: "h2", text: "Common mistakes to avoid" },
      { type: "p", text: "Many professionals rush into a lease without considering their long-term needs. Avoid these common mistakes:" },
      { type: "ul", items: [
        "Choosing based only on price",
        "Ignoring parking availability",
        "Not reading the lease agreement",
        "Overlooking building security",
        "Forgetting to market your own business",
        "Selecting a suite that's too small",
        "Failing to budget for business expenses",
      ] },
      { type: "p", text: "Planning carefully builds a stronger foundation for long-term success." },

      { type: "h2", text: "Why choose LUXYN Studios?" },
      { type: "p", text: "At LUXYN Studios, we know every beauty professional has a unique vision for their business. That's why we provide premium private salon suites in Leander, TX, designed to help independent professionals build successful brands. When you lease a suite with us, you gain more than a workspace — you gain an environment built for growth, professionalism, and exceptional client experiences." },
      { type: "p", text: "Whether you're launching your first independent business or expanding an established clientele, our move-in-ready luxury suites give you the flexibility and privacy you need to succeed — designed for hairstylists, estheticians, nail technicians, lash artists, massage therapists, and wellness professionals. Schedule a tour today to see how LUXYN can help you take the next step toward business independence." },
      { type: "cta", text: "Ready to build your beauty business in a premium, professional environment?", label: "Schedule a tour today", href: "/contact" },
    ],
    tags: ["salon suite rentals", "salon suite for rent", "private salon suite", "salon suite lease", "salon suite cost", "luxury salon suites", "independent beauty business", "Leander TX"],
    faqs: [
      { q: "Is renting a salon suite worth it?", a: "For many independent beauty professionals, yes. A salon suite provides greater flexibility, branding opportunities, and earning potential while letting you create your own client experience." },
      { q: "Who can rent a salon suite?", a: "Salon suites are commonly leased by hairstylists, barbers, estheticians, lash artists, nail technicians, makeup artists, massage therapists, and wellness professionals." },
      { q: "Can I decorate my salon suite?", a: "Many providers allow reasonable customization, so you can create a workspace that reflects your personal brand while complying with property guidelines." },
      { q: "Do salon suites include furniture?", a: "Many luxury salon suites are fully furnished with essential equipment, while others offer flexible layouts for professionals who prefer to bring their own furnishings." },
      { q: "How long are salon suite leases?", a: "Lease terms vary by location and provider. Some offer flexible agreements, while others provide longer-term leases with renewal options." },
      { q: "Do I need my own business license?", a: "Requirements vary by state and local regulations. Check with your local licensing authority to ensure compliance before operating your business." },
    ],
    cta: { label: "Schedule a tour today", href: "/contact" },
  },
  {
    slug: "how-much-does-a-salon-suite-cost",
    title: "How Much Does It Cost to Rent a Salon Suite in Leander, TX?",
    description:
      "A clear breakdown of salon suite rental costs in Leander, TX — what's included in the lease, the hidden expenses to plan for, and how to know if a suite pays for itself.",
    kicker: "PRICING",
    h1: "How much does it cost to rent a salon suite in Leander, TX?",
    published: "2026-06-25",
    updated: "2026-06-25",
    readMins: 6,
    author: "LUXYN",
    image: "/assets/cta-bg.webp",
    body: [
      { type: "p", text: "If you're an independent stylist, esthetician, or wellness pro weighing the jump to your own suite, the first question is almost always the same: what will it actually cost? The honest answer is that it depends on suite size, location, and what's bundled into the lease — but you can get to a confident number quickly once you know what to look for." },
      { type: "p", text: "Below is a practical breakdown of how salon suite pricing works in the Leander and greater Austin area, what a lease typically includes, and the smaller costs people forget to plan for." },
      { type: "image", src: "/assets/about-1.webp", alt: "A private, finished salon suite at LUXYN in Leander, TX", caption: "A private LUXYN suite — the kind of finished, brandable space a suite lease covers." },
      { type: "h2", text: "What you're actually paying for" },
      { type: "p", text: "A salon suite lease isn't just rent on four walls. At a well-run studio, your monthly rate bundles in the infrastructure that would otherwise be a stack of separate bills — and a stack of separate headaches." },
      { type: "ul", items: [
        "Your own private, lockable room — a finished studio, not a chair on an open floor",
        "24/7 secure access so your hours are genuinely your own",
        "High-speed fiber Wi-Fi for booking, payments, and social",
        "On-site laundry, so towels and linens never leave the building",
        "A styled client lounge and daily cleaning of shared areas",
        "The freedom to brand and decorate your suite as your own",
      ] },
      { type: "p", text: "When you compare suites, compare what's included — not just the headline number. A slightly higher rate that covers utilities, Wi-Fi, laundry, and front-of-house care is often cheaper, and far less stressful, than a bare room where each of those is on you." },
      { type: "quote", text: "Compare what's included, not just the headline rate. A bundled suite is often cheaper than a bare room once you add up the separate bills." },
      { type: "h2", text: "The costs people forget to budget for" },
      { type: "p", text: "Beyond the lease itself, build a realistic first-year picture by accounting for a few one-time and recurring items:" },
      { type: "ul", items: [
        "Liability insurance — usually modest, and often required by your lease",
        "Product, color, and back-bar supplies for your services",
        "Booking/payment software, if not already part of your toolkit",
        "Initial décor or equipment to make the suite feel like your brand",
        "A small marketing budget to move clients with you and grow your book",
      ] },
      { type: "h2", text: "Does a suite pay for itself?" },
      { type: "p", text: "Here's the math that matters: in a commission salon, a large share of every ticket goes to the house. In your own suite, you pay a fixed lease and keep the rest. Once your book is steady, the suite usually costs less than the commission split you were already giving up — and everything above that line is yours." },
      { type: "stat", value: "40–60%", label: "of every ticket can go to the house on a typical commission split — the share a fixed suite lease lets you keep instead.", source: "Industry commission-split norms" },
      { type: "p", text: "The break-even point is simply the number of services per week that covers your lease. For most established pros, that's a small fraction of a normal schedule, which is exactly why the model works: you're trading a percentage of every dollar for a predictable, fixed cost." },
      { type: "h3", text: "A quick cost comparison" },
      { type: "p", text: "It helps to see the three models side by side. The numbers vary by market, but the shape of the trade-off stays the same:" },
      { type: "table", columns: ["Model", "What you pay", "What you keep"], rows: [
        ["Commission chair", "A percentage of every ticket", "Your share after the split"],
        ["Booth rental", "Weekly/monthly station fee", "Everything you earn at the chair"],
        ["Private suite", "Fixed monthly lease (amenities included)", "Everything above your fixed lease"],
      ], caption: "Costs vary by market — the trade-off between variable and fixed cost does not." },
      { type: "cta", text: "Want a real number for your situation rather than a range?", label: "Book a tour for pricing", href: "/contact" },
      { type: "h2", text: "Getting an exact number for LUXYN" },
      { type: "p", text: "Lease rates at LUXYN depend on suite size and current availability, so the most reliable way to get an exact figure is a short private tour. You'll see the available suites in person, and we'll walk you through the terms with no guesswork. Book a tour and we'll share current pricing for the suite that fits your craft." },
    ],
    tags: ["salon suite cost", "salon suite rental", "booth rental", "Leander TX", "beauty business", "commission split"],
    faqs: [
      { q: "How much does it cost to rent a salon suite in Leander, TX?", a: "It depends on suite size, location, and what's bundled into the lease. The most reliable way to get an exact figure is a short private tour, where you can see the suite and we'll walk through current pricing and terms with no guesswork." },
      { q: "What's included in a salon suite lease?", a: "At a well-run studio your monthly rate typically bundles a private lockable room, 24/7 secure access, high-speed Wi-Fi, on-site laundry, a styled client lounge, and daily cleaning of shared areas — infrastructure that would otherwise be several separate bills." },
      { q: "Are there hidden costs beyond the monthly rent?", a: "Plan for liability insurance, product and back-bar supplies, booking/payment software, initial décor or equipment, and a small marketing budget. Most are modest, but budgeting for them up front gives you a realistic first-year picture." },
      { q: "Is a salon suite cheaper than a commission chair?", a: "Once your book is steady, usually yes. You trade a percentage of every ticket for a fixed monthly lease, so everything you earn above your break-even line is yours to keep." },
    ],
    cta: { label: "Book a tour for pricing", href: "/contact" },
  },
  {
    slug: "salon-suite-vs-booth-rental",
    title: "Salon Suite vs. Booth Rental vs. Commission: Which Is Right for You?",
    description:
      "Salon suite, booth rental, or commission chair? Compare control, cost, privacy, and growth potential to choose the right setup for your beauty business in Leander, TX.",
    kicker: "GUIDE",
    h1: "Salon suite vs. booth rental vs. commission: which is right for you?",
    published: "2026-06-22",
    updated: "2026-06-25",
    readMins: 7,
    author: "LUXYN",
    image: "/assets/about-1.webp",
    body: [
      { type: "p", text: "Most beauty and wellness pros work under one of three models: a commission chair, a rented booth, or a private suite. Each trades a different amount of freedom for a different amount of support — and the right choice depends entirely on where you are in your business." },
      { type: "p", text: "Here's a clear-eyed comparison to help you decide." },
      { type: "h2", text: "The commission chair" },
      { type: "p", text: "You work inside someone else's salon and split each ticket with the house. It's the lowest-risk way to start: the salon supplies the space, the front desk, often the product, and a stream of walk-ins. The trade-off is control. You usually don't set your own prices, your hours, or your brand — and a large share of every dollar you earn goes to the owner." },
      { type: "p", text: "Best for: newer pros still building a client base, or anyone who wants zero overhead and doesn't mind sharing the upside." },
      { type: "h2", text: "The booth rental" },
      { type: "p", text: "You rent a station — a chair on an open floor — and keep what you earn. You set your prices and your schedule, which is a real step up in independence. But you're still working in a shared, open environment: the noise, the energy, and the client experience aren't fully yours to shape, and amenities vary widely from salon to salon." },
      { type: "p", text: "Best for: pros with a steady book who want autonomy but aren't ready for a fully private space." },
      { type: "h2", text: "The private salon suite" },
      { type: "p", text: "You lease your own lockable room and run it as your studio. You own everything that touches the client: the space, the ambiance, the pricing, the brand, and the relationship. At a full-service studio, the building, amenities, and upkeep are handled for you, so you get independence without becoming your own facilities manager." },
      { type: "quote", text: "A suite gives you independence without making you your own facilities manager — the building is handled, so your craft isn't." },
      { type: "ul", items: [
        "Complete privacy — a calm, one-on-one experience your clients remember",
        "Full ownership of your brand, hours, pricing, and client list",
        "Premium amenities and on-site support included in the lease",
        "A finished, design-led space that elevates how clients perceive your work",
      ] },
      { type: "p", text: "Best for: established pros ready to own the entire client experience and keep the full value of their work." },
      { type: "h2", text: "The three models at a glance" },
      { type: "p", text: "If you prefer to see the trade-offs side by side, here's how the three setups compare on the things that matter most day to day:" },
      { type: "table", columns: ["", "Commission", "Booth rental", "Private suite"], rows: [
        ["Privacy", "Shared floor", "Shared floor", "Fully private"],
        ["Set your prices", "Rarely", "Yes", "Yes"],
        ["Own your brand", "No", "Partly", "Fully"],
        ["Income kept", "After split", "Most", "All above lease"],
        ["Overhead/risk", "Lowest", "Medium", "Higher, predictable"],
      ], caption: "A higher-level view of where each model sits on control versus support." },
      { type: "h2", text: "How to choose" },
      { type: "p", text: "Ask yourself three questions: How loyal is my book? How much do I care about controlling the client experience? And how much of every ticket am I comfortable giving away? If your clients follow you, you care deeply about the experience, and you're tired of splitting your income, a private suite is almost always the next move." },
      { type: "p", text: "LUXYN is built for exactly that moment — design-led private suites in Leander, TX with the amenities and support handled, so the only thing left for you to focus on is your craft. Book a tour to see whether a suite fits where your business is headed." },
    ],
    tags: ["salon suite", "booth rental", "commission salon", "going independent", "beauty business", "Leander TX"],
    faqs: [
      { q: "What's the difference between a salon suite and a booth rental?", a: "A booth rental is a station on a shared, open floor — you keep what you earn but share the space, noise, and client experience. A salon suite is your own private, lockable room, so you control the privacy, ambiance, brand, and full client experience." },
      { q: "Is a salon suite better than a commission chair?", a: "It depends on where you are in your business. A commission chair is lowest-risk and supplies walk-ins, but you split every ticket and don't control your brand. A suite is the right move once your book is loyal and you want to own the experience and keep the full value of your work." },
      { q: "Which model is best for someone just starting out?", a: "A commission chair is usually best for newer pros still building a client base, since it has zero overhead and a built-in stream of walk-ins. A booth or suite makes more sense once you have a steady book that will follow you." },
      { q: "Do I lose my clients when I move to a suite?", a: "Not if you plan the move. Tell clients early and personally, make rebooking effortless, and give them a reason to be excited — a more private, comfortable experience. Most loyal clients follow without missing a beat." },
    ],
    cta: { label: "See the suites in person", href: "/contact" },
  },
  {
    slug: "how-to-start-a-salon-suite-business",
    title: "How to Start Your Own Salon Suite Business: A Step-by-Step Guide",
    description:
      "Ready to go independent? A step-by-step guide to launching your own salon suite business — from licensing and insurance to moving your clients and opening day in Leander, TX.",
    kicker: "PLAYBOOK",
    h1: "How to start your own salon suite business: a step-by-step guide",
    published: "2026-06-18",
    updated: "2026-06-25",
    readMins: 8,
    author: "LUXYN",
    image: "/assets/about-2.webp",
    body: [
      { type: "p", text: "Going independent is one of the most rewarding moves a beauty or wellness pro can make — and it's far less daunting when you break it into steps. Here's a practical playbook for opening your own salon suite, from the paperwork to your first day with clients." },
      { type: "image", src: "/assets/about-2.webp", alt: "A beauty professional working in her own private salon suite", caption: "Opening day in a space that's truly yours — the goal this playbook builds toward." },
      { type: "h2", text: "1. Get your licensing and business basics in order" },
      { type: "p", text: "Make sure your professional license is current, then set up the business side: register your business, get an EIN if you need one, open a separate business bank account, and pick up professional liability insurance. None of this is glamorous, but doing it cleanly up front saves real headaches later — and most suite leases will ask for proof of insurance anyway." },
      { type: "h2", text: "2. Define your brand and your numbers" },
      { type: "p", text: "Before you sign anything, get clear on who you serve and what you charge. Set your service menu and pricing, sketch the look and feel of your brand, and build a simple budget: your lease, supplies, insurance, software, and a small marketing reserve. Knowing your numbers tells you exactly how many services a week cover your costs — your break-even line." },
      { type: "h2", text: "3. Choose the right suite" },
      { type: "p", text: "Your space is part of your brand, so tour before you commit. As you compare options, look past the rent at what actually shapes your day-to-day:" },
      { type: "ul", items: [
        "Location and parking your clients will find easy",
        "What's included — Wi-Fi, laundry, utilities, cleaning, security",
        "Whether you can truly brand and decorate the suite as your own",
        "On-site support, like a real person to welcome your clients",
        "The overall feel — does it elevate the experience or just contain it?",
      ] },
      { type: "h2", text: "4. Bring your clients with you" },
      { type: "p", text: "Your book is your most valuable asset, so plan the move carefully. Tell clients early and personally, make rebooking effortless, and give them a reason to be excited — a more private, more comfortable experience that's entirely yours. A short announcement across your channels, plus direct messages to your regulars, moves most loyal clients without missing a beat." },
      { type: "quote", text: "Your book is your most valuable asset. Tell clients early, make rebooking effortless, and give them a reason to be excited about the move." },
      { type: "h2", text: "5. Set up systems before opening day" },
      { type: "p", text: "Have your booking and payment tools live, your retail and back-bar stocked, and your cancellation and deposit policies written down before your first appointment. A short pre-opening checklist keeps it simple:" },
      { type: "ol", items: [
        "Turn on online booking and a payment processor, and test a real transaction",
        "Stock back-bar, retail, and disposables for your first few weeks",
        "Write down your cancellation, deposit, and late policies",
        "Set up a simple bookkeeping system to track income and expenses",
        "Do a soft-launch day with a few regulars to shake out any kinks",
      ] },
      { type: "p", text: "Walking into opening day with the boring stuff already solved lets you spend your energy where it counts — on your clients." },
      { type: "cta", text: "Picturing your own suite for opening day?", label: "Book a private tour", href: "/contact" },
      { type: "h2", text: "6. Open, then keep growing" },
      { type: "p", text: "Opening day isn't the finish line. Ask happy clients for reviews, keep your social presence consistent, and lean on the marketing and front-of-house support your studio provides. Independence doesn't mean doing everything alone — the best suite communities give you room to grow with real backing behind you." },
      { type: "p", text: "If Leander or the greater Austin area is home, LUXYN is built to be the easiest place to make this leap: design-led private suites with the amenities, security, and on-site care already handled. Book a tour and we'll help you picture opening day in a space that's truly yours." },
    ],
    tags: ["start a salon suite", "salon business", "going independent", "salon suite checklist", "beauty entrepreneur", "Leander TX"],
    faqs: [
      { q: "What do I need to open my own salon suite?", a: "A current professional license, the business basics (registration, EIN if needed, a business bank account, and liability insurance), a defined brand and pricing, the right suite, a plan to move your clients, and your booking and payment systems set up before opening day." },
      { q: "How do I move my clients to a new salon suite?", a: "Tell clients early and personally, make rebooking effortless, and give them a reason to be excited about a more private experience. A short announcement across your channels plus direct messages to your regulars moves most loyal clients without missing a beat." },
      { q: "Do I need business insurance for a salon suite?", a: "Yes — professional liability insurance is standard, and most suite leases will ask for proof of it. It's usually modest and worth having in place before you sign." },
      { q: "How long does it take to launch a salon suite business?", a: "Once your license and insurance are sorted, the move itself can happen quickly. The pace usually depends on suite availability and how soon you want to bring your clients over — a tour is the fastest way to lock in timing." },
    ],
    cta: { label: "Start with a private tour", href: "/contact" },
    howTo: true,
  },
];

/** Look up a single post by slug (throws on an unknown slug — a build-time
 *  guard so a bad link in code fails loudly rather than 404-ing silently). */
export function getPost(slug: string): BlogPost {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) throw new Error(`getPost: unknown blog slug "${slug}"`);
  return post;
}

/** Per-article Metadata — own title/description, self-canonical URL, and an
 *  OpenGraph "article" object with the publish/modify dates and author so social
 *  and search treat each post as a first-class, dated article. */
export function blogPostMetadata(slug: string): Metadata {
  const p = getPost(slug);
  const path = `/blog/${p.slug}`;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.description,
      url: path,
      publishedTime: p.published,
      modifiedTime: p.updated,
      authors: [p.author],
    },
    robots: { index: true, follow: true },
  };
}

/** Metadata for the /blog index. */
export function blogIndexMetadata(): Metadata {
  return {
    title: blogIndex.title,
    description: blogIndex.description,
    alternates: { canonical: `/${blogIndex.slug}` },
    openGraph: {
      type: "website",
      title: blogIndex.title,
      description: blogIndex.description,
      url: `/${blogIndex.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

/** Human-friendly date for bylines, e.g. "June 25, 2026". Built from the fixed
 *  ISO string with a fixed locale so the static output is deterministic. */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[m - 1]} ${d}, ${y}`;
}

/** Absolute URL for a post — used by sitemap, feeds, and JSON-LD. */
export const postUrl = (slug: string) => `${site.url}/blog/${slug}`;

/** Stable anchor id from a heading's text (for the table of contents). */
export const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** The h2 headings of a post, as { id, text } — drives the table of contents. */
export function headings(post: BlogPost): { id: string; text: string }[] {
  return post.body
    .filter((b): b is { type: "h2"; text: string } => b.type === "h2")
    .map((b) => ({ id: slugify(b.text), text: b.text }));
}

/** Ordered steps for a how-to article, derived from its numbered H2s ("1. …")
 *  and the paragraph (or list) that follows each. `id` matches the on-page H2
 *  anchor so HowToStep.url can deep-link into the article. Drives HowTo JSON-LD. */
export function howToSteps(post: BlogPost): { id: string; name: string; text: string }[] {
  const steps: { id: string; name: string; text: string }[] = [];
  post.body.forEach((b, i) => {
    if (b.type !== "h2" || !/^\d+\.\s/.test(b.text)) return;
    const next = post.body[i + 1];
    const text =
      next?.type === "p" ? next.text
      : next?.type === "ul" ? next.items.join(" ")
      : b.text.replace(/^\d+\.\s*/, "");
    steps.push({ id: slugify(b.text), name: b.text.replace(/^\d+\.\s*/, ""), text });
  });
  return steps;
}

/** The other posts (newest first), for "related reading" and prev/next links. */
export function otherPosts(slug: string): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => b.published.localeCompare(a.published));
}

/** Previous/next article in publish order (newest → oldest), for the in-article
 *  pager. `prev` is the newer neighbour, `next` the older one. */
export function adjacentPosts(slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const ordered = [...blogPosts].sort((a, b) => b.published.localeCompare(a.published));
  const i = ordered.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? ordered[i - 1] : null,
    next: i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : null,
  };
}
