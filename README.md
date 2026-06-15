# LUXYN Landing

Marketing landing page for **LUXYN** — private, design-led salon & wellness suites
for independent beauty professionals. A faithful, pixel-accurate port of a Claude
Design (`claude.ai/design`) handoff into Next.js, with scroll-reveal, a gold
marquee, parallax hero, a sticky scroll-aware nav with scrollspy, a progress bar,
and hover micro-interactions.

🔗 **Live:** https://luxyn-demo-a66a8.web.app

## Tech stack

- **Next.js 16** (App Router, TypeScript) — exported as a fully static site
- Plain CSS + transcribed inline styles (no UI framework)
- **Firebase Hosting** for delivery, **GitHub Actions** for CI/CD

## Project structure

| Path | What it is |
| --- | --- |
| `app/components/Landing.tsx` | The whole page — every section, with the design's inline styles transcribed verbatim |
| `app/lib/dc.tsx` | `E` element + `S()` CSS-string parser; drives hover and `IntersectionObserver` scroll-reveal |
| `app/globals.css` | Ported `<style>` block (reveal / marquee / floaty keyframes, nav) + Google Fonts |
| `public/assets/` | All design imagery |
| `firebase.json` / `.firebaserc` | Firebase Hosting config (serves `out/`, project `luxyn-demo-a66a8`) |
| `.github/workflows/` | CI/CD — live deploy on push to `main`, preview deploy on PRs |

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
firebase deploy --only hosting --project luxyn-demo-a66a8
```

## CI/CD

Two workflows in `.github/workflows/`:

- **`firebase-hosting-merge.yml`** — on every push to `main`: `npm ci` → `npm run build` → deploy to the **live** channel.
- **`firebase-hosting-pr.yml`** — on every pull request: builds and deploys to a temporary **preview** channel and comments the URL on the PR.

### One-time secret setup

Both workflows need a repository secret named **`FIREBASE_SERVICE_ACCOUNT`** holding
a Firebase service-account JSON key with Hosting deploy permission:

1. [Firebase Console](https://console.firebase.google.com/project/luxyn-demo-a66a8/settings/serviceaccounts/adminsdk)
   → **Project settings → Service accounts → Generate new private key** (downloads a JSON file).
2. Store it as the repo secret (do **not** commit the file):
   ```bash
   gh secret set FIREBASE_SERVICE_ACCOUNT \
     --repo kalyan1421/luxyn-landing \
     < ~/Downloads/luxyn-demo-a66a8-firebase-adminsdk-XXXXX.json
   ```
3. Delete the downloaded key file.
  
  
After the secret is set, push to `main` to trigger the first automated deploy.
