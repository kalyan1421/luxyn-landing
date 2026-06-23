# LUXYN Landing

Marketing landing page for **LUXYN** — private, design-led salon & wellness suites
for independent beauty professionals. A faithful, pixel-accurate port of a Claude
Design (`claude.ai/design`) handoff into Next.js, with scroll-reveal, a gold
marquee, parallax hero, a glassmorphism overlay menu, a scroll progress bar,
a dedicated mobile layout, and hover micro-interactions.

🔗 **Live:** https://luxynstudios.com

## Tech stack

- **Next.js 16** (App Router, TypeScript) — exported as a fully static site
- Plain CSS + transcribed inline styles (no UI framework)
- **Firebase Hosting** for delivery, **GitHub Actions** for CI/CD

## Project structure

| Path | What it is |
| --- | --- |
| `app/_components/Landing.tsx` | The whole page — desktop canvas + dedicated mobile layout, with the design's inline styles transcribed verbatim and framer-motion reveals |
| `app/_components/ContactForm.tsx` | Accessible lease/tour enquiry form (validation, submit states, honeypot); POSTs to the endpoint in `site.ts` |
| `app/_components/LegalLayout.tsx` | Shared chrome for the privacy / terms / cookies pages |
| `app/_lib/site.ts` | **Single source of truth** for domain, business contact details, socials, and the form endpoint — replace the `PLACEHOLDER` values before launch |
| `app/layout.tsx` | Root layout + full SEO metadata (Open Graph, Twitter, robots, icons) + `LocalBusiness` JSON-LD |
| `public/robots.txt` | Static `robots.txt` (per-bot allow rules, private-path disallows) |
| `app/sitemap.ts` | Generated `sitemap.xml` |
| `app/(legal)/{privacy,terms,cookies}/page.tsx` | Legal pages (placeholder copy); route group does not affect URLs |
| `app/(marketing)/` | Public marketing routes; route group does not affect URLs |
| `app/(feeds)/` | Static machine-readable feed routes such as `/facts.json` and `/llms.txt` |
| `app/not-found.tsx` | Branded 404 |
| `app/globals.css` | Ported `<style>` block (marquee / floaty keyframes, glass menu, gallery hover, CSS scroll-reveal, form fields, skip-link, legal prose) + Google Fonts |
| `public/assets/` | All design imagery |
| `firebase.json` / `.firebaserc` | Firebase Hosting config (serves `out/`, project `luxyn-landing`) |
| `.github/workflows/` | CI/CD — live deploy on push to `main`, preview deploy on PRs |

## Before launch — replace placeholders

All site-wide values live in [`app/_lib/site.ts`](app/_lib/site.ts). Search it for
`PLACEHOLDER` and set the real values:

1. **`url`** — your production domain (used for canonical URLs, the sitemap, and Open Graph).
2. **`contact`** — business email, phone, and address (shown in the footer + structured data).
3. **`socials`** — profile URLs (empty strings are hidden automatically).
4. **`contactEndpoint`** — the contact form emails submissions via Resend through
   a small Cloudflare Worker (see [`worker/`](worker/README.md)). Deploy the
   Worker, then paste its URL here. Until it's set, the form shows a friendly
   "email us directly" message instead of failing silently.

Also review the placeholder legal copy in `app/(legal)/{privacy,terms,cookies}/page.tsx`
with your own counsel.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & static export

```bash
npm run build    # outputs a static site to ./out
```

`next.config.ts` sets `output: "export"`, so the build emits plain HTML/CSS/JS.

## Manual deploy

```bash
npm run build
firebase deploy --only hosting --project luxyn-landing
```

## CI/CD

Two workflows in `.github/workflows/`:

- **`firebase-hosting-merge.yml`** — on every push to `main`: `npm ci` → `npm run build` → deploy to the **live** channel.
- **`firebase-hosting-pr.yml`** — on every pull request: builds and deploys to a temporary **preview** channel and comments the URL on the PR.

### One-time secret setup

Both workflows need a repository secret named **`FIREBASE_SERVICE_ACCOUNT`** holding
a Firebase service-account JSON key with Hosting deploy permission:

1. [Firebase Console](https://console.firebase.google.com/project/luxyn-landing/settings/serviceaccounts/adminsdk)
   → **Project settings → Service accounts → Generate new private key** (downloads a JSON file).
2. Store it as the repo secret (do **not** commit the file):
   ```bash
   gh secret set FIREBASE_SERVICE_ACCOUNT \
     --repo Eshwar-ui/luxyn-landing \
     < ~/Downloads/luxyn-landing-firebase-adminsdk-XXXXX.json
   ```
3. Delete the downloaded key file.
  
  
After the secret is set, push to `main` to trigger the first automated deploy.
