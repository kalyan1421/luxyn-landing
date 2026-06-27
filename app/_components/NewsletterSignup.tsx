"use client";

import { useEffect, useId, useRef, useState } from "react";
import { site, isFormConfigured } from "../_lib/site";

/**
 * Email-capture band for the blog — a single email field that POSTs
 * { variant: "newsletter", email } to the same Cloudflare Worker as the contact
 * form (see /worker), so a new subscriber emails the sales inbox and the
 * subscriber gets a branded confirmation. Mirrors ContactForm's honeypot,
 * `isFormConfigured` guard and success handling, kept lightweight for one field.
 */
type Status = "idle" | "submitting" | "success" | "error";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  // Move focus to the confirmation when it succeeds, for screen-reader users.
  const successRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const value = email.trim();
    if (!value || !emailRe.test(value)) {
      setStatus("error");
      setMsg("Please enter a valid email address.");
      return;
    }

    // honeypot — bots fill hidden fields; humans don't
    if ((e.currentTarget.elements.namedItem("_gotcha") as HTMLInputElement)?.value) return;

    if (!isFormConfigured()) {
      setStatus("error");
      setMsg(
        "Sign-up isn't connected to a delivery service yet. Email us at " +
          site.contact.email + " to be added to the list.",
      );
      return;
    }

    setStatus("submitting");
    setMsg("");
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ variant: "newsletter", email: value }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setMsg(
        "Something went wrong. Please try again, or email us at " + site.contact.email + ".",
      );
    }
  };

  return (
    <section
      aria-label="Subscribe to the LUXYN journal"
      className="mt-16 overflow-hidden rounded-[22px] p-8 lg:p-12"
      style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
    >
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-[460px]">
          <p className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 12, letterSpacing: 3 }}>
            THE LUXYN JOURNAL
          </p>
          <h2 className="mt-2 font-display font-bold text-[rgb(2,36,72)] text-[24px] lg:text-[28px]" style={{ lineHeight: 1.2 }}>
            New guides, straight to your inbox
          </h2>
          <p className="mt-2 font-ui font-normal text-[rgb(67,71,78)]" style={{ fontSize: 15, lineHeight: 1.6 }}>
            Practical, no-fluff advice on running an independent suite business. We only send when there&apos;s something genuinely useful — never spam.
          </p>
        </div>

        {status === "success" ? (
          <p
            ref={successRef}
            role="status"
            tabIndex={-1}
            className="flex items-center gap-3 font-ui font-medium text-[rgb(2,36,72)] outline-none lg:max-w-[360px]"
            style={{ fontSize: 15, lineHeight: 1.6 }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgb(194,160,107)" }}
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(20,35,59)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            You&apos;re on the list — check your inbox for a confirmation.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="w-full lg:max-w-[420px]">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <label htmlFor={`${uid}-email`} className="sr-only">Email address</label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                aria-required="true"
                aria-invalid={status === "error"}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                placeholder="you@example.com"
                className="lx-field w-full flex-1 rounded-[12px] bg-white px-4 py-3 font-ui text-[15px] text-[rgb(2,36,72)] outline-none transition-[box-shadow] duration-200 placeholder:text-[rgb(150,150,150)]"
              />
              {/* honeypot — visually hidden, off the tab order */}
              <input
                type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="h-[48px] shrink-0 rounded-full px-7 font-ui font-bold transition-[transform,opacity] duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontSize: 14, letterSpacing: 0.4, background: "rgb(20,35,59)", color: "rgb(255,255,255)" }}
              >
                {status === "submitting" ? "Joining…" : "Subscribe"}
              </button>
            </div>
            {status === "error" && (
              <p role="alert" className="mt-2 font-ui" style={{ color: "rgb(176,58,46)", fontSize: 13.5, lineHeight: 1.5 }}>
                {msg}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
