/**
 * LUXYN contact Worker — receives the contact-form POST from the static site
 * and sends TWO emails via Resend:
 *   1. a lead email to the sales inbox (TO_EMAIL) with the enquiry details, and
 *   2. a confirmation email back to the person who submitted the form.
 * The Resend API key lives here (server-side only), never in the browser.
 *
 * Endpoints:
 *   OPTIONS  → CORS preflight
 *   POST     → { variant, name, email, phone, message, ... }
 *
 * Deploy + config: see worker/README.md.
 */

export interface Env {
  /** Secret — set with `wrangler secret put RESEND_API_KEY`. */
  RESEND_API_KEY: string;
  /** Sales inbox — where leads are delivered. Comma-separated for several. */
  TO_EMAIL: string;
  /** Verified Resend sender, e.g. `LUXYN <noreply@luxynstudios.com>`. */
  FROM_EMAIL: string;
  /** Comma-separated list of origins allowed to call this Worker. */
  ALLOWED_ORIGINS: string;
  /** Optional — phone shown in the confirmation email. */
  BRAND_PHONE?: string;
  /** Optional secret — when set, Cloudflare Turnstile tokens are verified.
   *  Set with `wrangler secret put TURNSTILE_SECRET`. */
  TURNSTILE_SECRET?: string;
}

type Variant = "lease" | "tour";

const ESCAPE: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const esc = (v: unknown): string => String(v ?? "").replace(/[&<>"']/g, c => ESCAPE[c]);

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

/** Return the request's Origin only if it's in the allow-list. */
function allowedOrigin(request: Request, env: Env): string | null {
  const allow = env.ALLOWED_ORIGINS.split(",").map(s => s.trim()).filter(Boolean);
  const origin = request.headers.get("Origin");
  return origin && allow.includes(origin) ? origin : null;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ── Email design system ──────────────────────────────────────────────────
 * Bulletproof, table-based HTML that survives Gmail / Outlook / Apple Mail:
 * inline styles only, web-safe fonts (Georgia for the serif display, Arial for
 * body), no external CSS or background images. Brand palette — navy #142337,
 * champagne #C2A06B, cream #F3ECDC. Static brand facts mirror app/_lib/site.ts. */
const BRAND = {
  name: "LUXYN",
  tagline: "Private, design-led salon & wellness suites",
  url: "https://luxynstudios.com",
  urlLabel: "luxynstudios.com",
  address: "14300 Ronald Reagan Blvd, Building 8 · Leander, TX 78641",
  instagram: "https://www.instagram.com/luxynstudios/",
};

/** Refined label/value details table. */
function detailTable(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;border:1px solid #ece4d3;border-radius:10px;border-collapse:separate;overflow:hidden">
    ${rows
      .map(
        ([k, v], i) => {
          const last = i === rows.length - 1 ? "" : "border-bottom:1px solid #ece4d3;";
          return `<tr>
             <td width="36%" style="padding:13px 18px;background:#faf6ec;${last}font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.8px;text-transform:uppercase;color:#9a8d6a;font-weight:bold;vertical-align:top">${esc(k)}</td>
             <td style="padding:13px 18px;${last}font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1b2c45;vertical-align:top">${esc(v).replace(/\n/g, "<br>")}</td>
           </tr>`;
        },
      )
      .join("")}
  </table>`;
}

/** Bulletproof, pill-shaped button. `tone` picks the brand fill. */
function button(href: string, label: string, tone: "gold" | "navy"): string {
  const bg = tone === "gold" ? "#C2A06B" : "#142337";
  const fg = tone === "gold" ? "#142337" : "#ffffff";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 4px"><tr>
    <td align="center" bgcolor="${bg}" style="border-radius:40px">
      <a href="${esc(href)}" style="display:inline-block;padding:14px 34px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;color:${fg};text-decoration:none;border-radius:40px">${esc(label)}</a>
    </td></tr></table>`;
}

/** Numbered step list with champagne tokens. */
function steps(items: string[]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px">
    ${items
      .map(
        (t, i) =>
          `<tr>
             <td width="30" valign="top" style="padding:7px 0">
               <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                 <td width="28" height="28" align="center" valign="middle" bgcolor="#f3ecdc" style="width:28px;height:28px;border-radius:14px;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#9a7b3e;font-weight:bold">${i + 1}</td>
               </tr></table>
             </td>
             <td valign="middle" style="padding:7px 0 7px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#43474e">${esc(t)}</td>
           </tr>`,
      )
      .join("")}
  </table>`;
}

const eyebrow = (t: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#b08d4f;font-weight:bold;margin:0 0 10px">${esc(t)}</div>`;
const heading = (t: string) =>
  `<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:26px;line-height:1.25;color:#142337">${esc(t)}</h1>`;
const para = (html: string) =>
  `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#43474e">${html}</p>`;
const subhead = (t: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8266;font-weight:bold;margin:26px 0 8px">${esc(t)}</div>`;
const divider = `<div style="border-top:1px solid #ece4d3;margin:26px 0"></div>`;

/** Wrap body content in the branded shell (header band + card + footer). */
function emailShell(preheader: string, inner: string, env: Env): string {
  const phone = env.BRAND_PHONE ? esc(env.BRAND_PHONE) : "";
  const phoneHref = env.BRAND_PHONE ? env.BRAND_PHONE.replace(/[^\d+]/g, "") : "";
  const phoneLine = phone
    ? `<a href="tel:${phoneHref}" style="color:#C2A06B;text-decoration:none">${phone}</a>&nbsp;&nbsp;·&nbsp;&nbsp;`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:#efe8da;-webkit-text-size-adjust:100%">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#efe8da;font-size:1px;line-height:1px">${esc(preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#efe8da">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px">
        <tr><td style="background:#142337;border-radius:16px 16px 0 0;padding:36px 40px 30px;text-align:center">
          <div style="font-family:Georgia,'Times New Roman',serif;color:#ffffff;font-size:30px;letter-spacing:11px;font-weight:400;padding-left:11px">${BRAND.name}</div>
          <div style="height:2px;width:44px;background:#C2A06B;margin:16px auto 0;line-height:2px;font-size:2px">&nbsp;</div>
          <div style="font-family:Arial,Helvetica,sans-serif;color:#aeb8c7;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-top:15px">${esc(BRAND.tagline)}</div>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px">${inner}</td></tr>
        <tr><td style="background:#0f1c30;border-radius:0 0 16px 16px;padding:26px 40px;text-align:center">
          <div style="font-family:Arial,Helvetica,sans-serif;color:#c7cedb;font-size:12px;line-height:1.8">
            ${esc(BRAND.address)}<br>
            ${phoneLine}<a href="${BRAND.url}" style="color:#C2A06B;text-decoration:none">${BRAND.urlLabel}</a>
          </div>
          <div style="font-family:Arial,Helvetica,sans-serif;color:#6c7790;font-size:11px;margin-top:14px">© ${BRAND.name} · Salon &amp; wellness suites in Leander, TX</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Send one email through the Resend REST API. Returns true on success. */
async function sendEmail(
  env: Env,
  params: { to: string[]; replyTo?: string; subject: string; html: string; text: string },
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: params.to,
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

/** Normalised enquiry, ready to render into either email. */
export interface Enquiry {
  variant: Variant;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  /** Human label for the enquiry type, e.g. "Lease a suite". */
  interest: string;
  /** Noun for prose, e.g. "enquiry" / "tour request". */
  requestKind: string;
  /** Verb phrase, e.g. "lease a suite" / "book a tour". */
  action: string;
  /** Label/value pairs shown in the details table. */
  rows: [string, string][];
}

/** Email sent to the sales inbox. reply_to is the submitter (set by caller),
 *  so a reply lands straight in the lead's inbox. */
export function buildLeadEmail(d: Enquiry, env: Env): { subject: string; html: string; text: string } {
  const replySubject = `Re: your ${d.requestKind} with LUXYN`;
  const inner =
    eyebrow(`New ${d.interest} enquiry`) +
    heading(`${d.firstName} wants to ${d.action}`) +
    para(`A fresh ${esc(d.requestKind)} just came in through the LUXYN website. The full details are below — reply to this email to respond to ${esc(d.firstName)} directly.`) +
    detailTable(d.rows) +
    button(`mailto:${esc(d.email)}?subject=${encodeURIComponent(replySubject)}`, `Reply to ${d.firstName}`, "navy") +
    `<p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#9a9486">Reply-to is set to ${esc(d.email)}, so your reply reaches them — not this inbox.</p>`;
  const text =
    `NEW ${d.interest.toUpperCase()} ENQUIRY — via the LUXYN website\n` +
    `${d.firstName} wants to ${d.action}. Reply to this email to reach them directly.\n\n` +
    d.rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return {
    subject: `New ${d.interest} enquiry — LUXYN`,
    html: emailShell(`${d.interest} enquiry from ${d.firstName} — ${d.phone || d.email}`, inner, env),
    text,
  };
}

/** Confirmation sent to the person who submitted the form. reply_to is the
 *  sales inbox (set by caller), so their reply reaches the team. */
export function buildConfirmationEmail(d: Enquiry, env: Env): { subject: string; html: string; text: string } {
  const callLine = env.BRAND_PHONE
    ? ` or call us at <a href="tel:${env.BRAND_PHONE.replace(/[^\d+]/g, "")}" style="color:#b08d4f;text-decoration:none">${esc(env.BRAND_PHONE)}</a>`
    : "";
  const nextSteps =
    d.variant === "tour"
      ? [
          "We confirm your preferred date and time, or suggest the closest opening.",
          "A LUXYN host reaches out to finalise the details of your visit.",
          "You tour the available suites in person and picture your craft in the space.",
        ]
      : [
          "We review your enquiry and match you with suites that fit your craft.",
          "A member of our team reaches out by phone or email to introduce LUXYN.",
          "We arrange a private tour at a time that suits you — no pressure, no rush.",
        ];
  const inner =
    eyebrow(d.interest) +
    heading(`Thank you, ${d.firstName}.`) +
    para(`We've received your ${esc(d.requestKind)} and a member of the LUXYN team will personally reach out within <strong style="color:#142337">one business day</strong>.`) +
    subhead("What happens next") +
    steps(nextSteps) +
    divider +
    para("For your records, here's a copy of what you sent us:") +
    detailTable(d.rows) +
    button(BRAND.url, "Explore LUXYN", "gold") +
    para(`Anything change in the meantime? Just reply to this email${callLine}.`) +
    `<p style="margin:22px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-style:italic;color:#142337">With care,<br>The LUXYN Team</p>`;
  const text =
    `Thank you, ${d.firstName} — we've received your ${d.requestKind}.\n\n` +
    `A member of the LUXYN team will personally reach out within one business day.\n\n` +
    `WHAT HAPPENS NEXT\n` +
    nextSteps.map((s, i) => `  ${i + 1}. ${s}`).join("\n") +
    `\n\nFor your records, here's a copy of what you sent us:\n` +
    d.rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nAnything change in the meantime? Just reply to this email${env.BRAND_PHONE ? ` or call us at ${env.BRAND_PHONE}` : ""}.\n\n` +
    `With care,\nThe LUXYN Team\n${BRAND.urlLabel} · ${BRAND.address}`;
  return {
    subject: `We've received your ${d.requestKind} — LUXYN`,
    html: emailShell(`We've received your ${d.requestKind} — we'll be in touch within one business day.`, inner, env),
    text,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = allowedOrigin(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405, origin);
    }
    // Reject requests from origins that aren't allow-listed.
    if (request.headers.get("Origin") && !origin) {
      return jsonResponse({ ok: false, error: "Origin not allowed" }, 403, origin);
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON" }, 400, origin);
    }

    // Honeypot: bots fill the hidden _gotcha field. Pretend success, send nothing.
    if (body._gotcha) return jsonResponse({ ok: true }, 200, origin);

    // Turnstile: verify the token when a secret is configured (skipped otherwise).
    if (env.TURNSTILE_SECRET) {
      const token = String(body.turnstileToken ?? "");
      if (!token) {
        return jsonResponse({ ok: false, error: "Verification required" }, 403, origin);
      }
      const form = new FormData();
      form.append("secret", env.TURNSTILE_SECRET);
      form.append("response", token);
      const ip = request.headers.get("CF-Connecting-IP");
      if (ip) form.append("remoteip", ip);
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: form,
      });
      const result = (await verify.json().catch(() => ({ success: false }))) as { success?: boolean };
      if (!result.success) {
        return jsonResponse({ ok: false, error: "Verification failed" }, 403, origin);
      }
    }

    const variant: Variant = body.variant === "tour" ? "tour" : "lease";
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !phone) {
      return jsonResponse({ ok: false, error: "Missing required fields" }, 422, origin);
    }
    if (!isEmail(email)) {
      return jsonResponse({ ok: false, error: "Invalid email" }, 422, origin);
    }

    const interest = variant === "tour" ? "Book a tour" : "Lease a suite";
    const requestKind = variant === "tour" ? "tour request" : "enquiry";
    const firstName = name.split(" ")[0] || name;

    // Field list shown in both emails — common fields + variant extras.
    const rows: [string, string][] = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Interest", interest],
    ];
    if (variant === "lease") {
      if (body.suiteType) rows.push(["Suite type", String(body.suiteType)]);
      if (body.moveIn) rows.push(["Target move-in", String(body.moveIn)]);
    } else {
      if (body.preferredDate) rows.push(["Preferred date", String(body.preferredDate)]);
      if (body.preferredTime) rows.push(["Preferred time", String(body.preferredTime)]);
    }
    if (message) rows.push(["Message", message]);

    const toList = env.TO_EMAIL.split(",").map(s => s.trim()).filter(Boolean);
    const salesInbox = toList[0];
    const action = variant === "tour" ? "book a tour" : "lease a suite";

    const enquiry: Enquiry = { variant, name, firstName, email, phone, interest, requestKind, action, rows };
    const lead = buildLeadEmail(enquiry, env);
    const confirmation = buildConfirmationEmail(enquiry, env);

    const [leadOk, confOk] = await Promise.all([
      // Lead → sales inbox; reply-to is the submitter so a reply reaches the lead.
      sendEmail(env, { to: toList, replyTo: email, subject: lead.subject, html: lead.html, text: lead.text }),
      // Confirmation → submitter; reply-to is the sales inbox.
      sendEmail(env, { to: [email], replyTo: salesInbox, subject: confirmation.subject, html: confirmation.html, text: confirmation.text }),
    ]);

    // The lead email is the one that must land. The confirmation is best-effort —
    // if it fails we've still captured the lead, so the submission succeeds.
    if (!leadOk) {
      return jsonResponse({ ok: false, error: "Could not send message" }, 502, origin);
    }
    return jsonResponse({ ok: true, confirmation: confOk }, 200, origin);
  },
};
