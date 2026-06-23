"use client";

import { useEffect, useId, useRef, useState } from "react";
import { site, isFormConfigured } from "../_lib/site";

/** Cloudflare Turnstile (spam protection) — loaded only when a site key is set
 *  in site.ts. Explicit-render mode so the widget survives the form remounting
 *  when the user switches between the lease/tour tabs. */
const TURNSTILE_API = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error";
export type ContactVariant = "lease" | "tour";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Permissive phone check — any common formatting, but must carry ≥7 digits. */
const isPhone = (v: string) => /^[+]?[\d\s().-]{7,}$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7;

const SUITE_TYPES = ["Hair", "Skin & esthetics", "Nails", "Brows & lashes", "Massage & wellness", "Other"] as const;
const TOUR_TIMES = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–7pm)"] as const;

type Fields = {
  name: string;
  email: string;
  phone: string;
  message: string;
  // lease-only
  suiteType: string;
  moveIn: string;
  // tour-only
  preferredDate: string;
  preferredTime: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

const emptyFields: Fields = {
  name: "", email: "", phone: "", message: "",
  suiteType: SUITE_TYPES[0], moveIn: "",
  preferredDate: "", preferredTime: TOUR_TIMES[0],
};

const FIELD_BASE =
  "lx-field w-full rounded-[12px] bg-white px-4 py-3 font-ui text-[15px] text-[rgb(2,36,72)] outline-none transition-[box-shadow] duration-200 placeholder:text-[rgb(150,150,150)]";

const fieldCls = (invalid: boolean) => `${FIELD_BASE}${invalid ? " lx-field--invalid" : ""}`;

const COPY: Record<ContactVariant, {
  interest: string;
  submit: string;
  messageLabel: string;
  messagePlaceholder: string;
}> = {
  lease: {
    interest: "Lease a suite",
    submit: "Request leasing details",
    messageLabel: "About your craft",
    messagePlaceholder: "Tell us about your craft, your business, and the space you envision.",
  },
  tour: {
    interest: "Book a tour",
    submit: "Request a tour",
    messageLabel: "Anything we should know? (optional)",
    messagePlaceholder: "Let us know what you'd like to see, or any questions.",
  },
};

/** Brand-styled, accessible enquiry form. Renders one of two intent-based field
 *  sets — `lease` (leasing a suite) or `tour` (booking a visit). Both require a
 *  phone number for follow-up. POSTs to the variant's endpoint in site.ts (a static
 *  export can't run a server, so this targets a third-party form service like Formspree). */
export default function ContactForm({ variant = "lease" }: { variant?: ContactVariant }) {
  const uid = useId();
  const copy = COPY[variant];
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");

  // Turnstile — only active when a site key is configured in site.ts.
  const turnstileKey = site.turnstileSiteKey;
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!turnstileKey) return;
    let cancelled = false;
    let pollId: ReturnType<typeof setInterval> | undefined;

    const renderWidget = () => {
      if (cancelled || !widgetRef.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: turnstileKey,
        theme: "light",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    const base = TURNSTILE_API.split("?")[0];
    if (window.turnstile) {
      renderWidget();
    } else if (document.querySelector(`script[src^="${base}"]`)) {
      pollId = setInterval(() => {
        if (window.turnstile) { if (pollId) clearInterval(pollId); renderWidget(); }
      }, 120);
    } else {
      const s = document.createElement("script");
      s.src = TURNSTILE_API; s.async = true; s.defer = true;
      s.onload = renderWidget;
      document.head.appendChild(s);
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current); } catch {}
      }
      widgetId.current = null;
    };
  }, [turnstileKey]);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!fields.name.trim()) next.name = "Please enter your name.";

    if (!fields.email.trim()) next.email = "Please enter your email.";
    else if (!emailRe.test(fields.email.trim())) next.email = "Please enter a valid email.";

    // Phone is mandatory for every enquiry — we need a number to follow up.
    if (!fields.phone.trim()) next.phone = "Please enter your phone number.";
    else if (!isPhone(fields.phone.trim())) next.phone = "Please enter a valid phone number.";

    if (variant === "tour") {
      if (!fields.preferredDate.trim()) next.preferredDate = "Please choose a preferred date.";
    } else {
      if (!fields.message.trim()) next.message = "Tell us a little about what you need.";
      else if (fields.message.trim().length < 10) next.message = "A few more words, please.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;

    // honeypot — bots fill hidden fields; humans don't
    if ((e.currentTarget.elements.namedItem("_gotcha") as HTMLInputElement)?.value) return;

    // Turnstile — require a verification token before sending.
    if (turnstileKey && !token) {
      setStatus("error");
      setServerMsg("Please complete the verification challenge, then submit again.");
      return;
    }

    if (!isFormConfigured()) {
      setStatus("error");
      setServerMsg(
        "The contact form isn't connected to a delivery service yet. Reach us directly at " +
          site.contact.email + " and we'll respond right away.",
      );
      return;
    }

    setStatus("submitting");
    setServerMsg("");
    try {
      // Send the enquiry type + only the fields relevant to it. The Worker
      // (see /worker) reads `variant` to format the email and hand it to Resend.
      const payload: Record<string, string> = {
        variant,
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        message: fields.message.trim(),
      };
      if (variant === "lease") {
        payload.suiteType = fields.suiteType;
        payload.moveIn = fields.moveIn.trim();
      } else {
        payload.preferredDate = fields.preferredDate.trim();
        payload.preferredTime = fields.preferredTime;
      }
      if (token) payload.turnstileToken = token;

      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
      setFields(emptyFields);
      setToken("");
      if (turnstileKey && widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    } catch {
      setStatus("error");
      setServerMsg(
        "Something went wrong sending your message. Please try again, or email us at " +
          site.contact.email + ".",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-white px-8 py-14 text-center"
        style={{ boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
      >
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "rgb(194,160,107)" }}
          aria-hidden="true"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgb(20,35,59)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h3 className="m-0 font-display font-semibold" style={{ color: "rgb(2,36,72)", fontSize: 26 }}>
          Thank you — we&apos;ll be in touch.
        </h3>
        <p className="m-0 font-ui" style={{ color: "rgb(67,71,78)", fontSize: 15, maxWidth: 360, lineHeight: 1.6 }}>
          Your {variant === "tour" ? "tour request" : "enquiry"} is on its way to our team. We typically respond within one business day.
        </p>
        <p className="m-0 font-ui" style={{ color: "rgb(120,124,131)", fontSize: 13, maxWidth: 360, lineHeight: 1.6 }}>
          We&apos;ve also emailed you a confirmation — if it&apos;s not in your inbox, check your spam folder, or reach us at{" "}
          <a href={`mailto:${site.contact.email}`} style={{ color: "rgb(160,128,72)", textDecoration: "underline" }}>
            {site.contact.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 font-accent font-semibold transition-colors duration-300 hover:opacity-70"
          style={{ color: "rgb(194,160,107)", fontSize: 13, letterSpacing: 1 }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-[20px] bg-white p-6 sm:p-8"
      style={{ boxShadow: "inset 0 0 0 1px rgb(225,216,194), 0 24px 50px rgba(20,35,59,.10)" }}
    >
      <Field id={`${uid}-name`} label="Name" error={errors.name}>
        <input
          id={`${uid}-name`} name="name" type="text" autoComplete="name"
          value={fields.name} onChange={set("name")}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          className={fieldCls(!!errors.name)} placeholder="Your full name"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id={`${uid}-email`} label="Email" error={errors.email}>
          <input
            id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email"
            value={fields.email} onChange={set("email")}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            className={fieldCls(!!errors.email)} placeholder="you@example.com"
          />
        </Field>
        <Field id={`${uid}-phone`} label="Phone" error={errors.phone}>
          <input
            id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel"
            value={fields.phone} onChange={set("phone")}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
            className={fieldCls(!!errors.phone)} placeholder="(512) 555-0199"
          />
        </Field>
      </div>

      {variant === "lease" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id={`${uid}-suite`} label="Suite type">
            <select
              id={`${uid}-suite`} name="suiteType" value={fields.suiteType} onChange={set("suiteType")}
              className={`${fieldCls(false)} lx-select cursor-pointer appearance-none`}
            >
              {SUITE_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field id={`${uid}-movein`} label="Target move-in" optional>
            <input
              id={`${uid}-movein`} name="moveIn" type="month"
              value={fields.moveIn} onChange={set("moveIn")}
              className={fieldCls(false)}
            />
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id={`${uid}-date`} label="Preferred date" error={errors.preferredDate}>
            <input
              id={`${uid}-date`} name="preferredDate" type="date"
              value={fields.preferredDate} onChange={set("preferredDate")}
              aria-invalid={!!errors.preferredDate} aria-describedby={errors.preferredDate ? `${uid}-date-err` : undefined}
              className={fieldCls(!!errors.preferredDate)}
            />
          </Field>
          <Field id={`${uid}-time`} label="Preferred time">
            <select
              id={`${uid}-time`} name="preferredTime" value={fields.preferredTime} onChange={set("preferredTime")}
              className={`${fieldCls(false)} lx-select cursor-pointer appearance-none`}
            >
              {TOUR_TIMES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      )}

      <Field id={`${uid}-message`} label={copy.messageLabel} error={errors.message}>
        <textarea
          id={`${uid}-message`} name="message" rows={4}
          value={fields.message} onChange={set("message")}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? `${uid}-message-err` : undefined}
          className={`${fieldCls(!!errors.message)} resize-y`}
          placeholder={copy.messagePlaceholder}
        />
      </Field>

      {/* honeypot — visually hidden, off the tab order */}
      <input
        type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {/* Cloudflare Turnstile — renders here only when a site key is configured */}
      {turnstileKey && <div ref={widgetRef} className="mt-1 flex justify-center" />}

      {status === "error" && (
        <p role="alert" className="m-0 font-ui" style={{ color: "rgb(176,58,46)", fontSize: 14, lineHeight: 1.5 }}>
          {serverMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 h-[50px] rounded-full font-ui font-bold text-white transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ fontSize: 14, letterSpacing: 0.4, background: "rgb(20,35,59)" }}
      >
        {status === "submitting" ? "Sending…" : copy.submit}
      </button>
      <p className="m-0 text-center font-ui" style={{ color: "rgb(120,124,131)", fontSize: 12, lineHeight: 1.5 }}>
        We&apos;ll only use your details to respond to this enquiry.
      </p>
    </form>
  );
}

function Field({
  id, label, error, optional, children,
}: {
  id: string; label: string; error?: string; optional?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-accent font-semibold" style={{ color: "rgb(33,58,92)", fontSize: 12, letterSpacing: 1 }}>
        {label}{optional && <span style={{ color: "rgb(150,150,150)", fontWeight: 400 }}> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="m-0 font-ui" style={{ color: "rgb(176,58,46)", fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
}
