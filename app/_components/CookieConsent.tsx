"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  OPEN_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
} from "../_lib/consent";

const EASE = [0.16, 1, 0.3, 1] as const;

const btnGold =
  "h-[44px] px-6 rounded-full font-ui font-semibold text-[13px] tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(194,160,107,.45)] cursor-pointer";
const btnGhost =
  "h-[44px] px-6 rounded-full font-ui font-semibold text-[13px] tracking-wide transition-colors duration-300 cursor-pointer text-navy-mid hover:bg-navy-mid/[.06]";

/** Pill toggle — accessible switch used in the preferences dialog. */
function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors duration-300 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
      style={{ background: checked ? "rgb(194,160,107)" : "rgb(206,198,180)" }}
    >
      <span
        className="absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-[left] duration-300"
        style={{ left: checked ? 23 : 3 }}
      />
    </button>
  );
}

/**
 * Cookie-consent banner + preferences dialog. Appears on first visit (no stored
 * choice) and can be reopened anywhere via openCookiePreferences() / the footer
 * link. Persists the choice and mirrors it into Google Consent Mode (consent.ts),
 * so Google Analytics only runs once the visitor opts in.
 */
export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Decide visibility after mount (localStorage is client-only).
  useEffect(() => {
    setMounted(true);
    const stored = readConsent();
    if (!stored) setBannerOpen(true);
    else setAnalytics(stored.analytics);
  }, []);

  // Reopen the preferences dialog on request (footer link, etc.).
  useEffect(() => {
    const open = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setPrefsOpen(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  // Escape closes the preferences dialog; focus it when it opens.
  useEffect(() => {
    if (!prefsOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPrefsOpen(false); };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [prefsOpen]);

  const decide = useCallback((allowAnalytics: boolean) => {
    writeConsent(allowAnalytics);
    setAnalytics(allowAnalytics);
    setBannerOpen(false);
    setPrefsOpen(false);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* ── consent banner ───────────────────────────────── */}
      <AnimatePresence>
        {bannerOpen && !prefsOpen && (
          <motion.div
            key="cookie-banner"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.5, ease: EASE }}
            role="region"
            aria-label="Cookie consent"
            className="fixed bottom-4 left-4 right-4 z-[210] sm:left-6 sm:right-auto sm:bottom-6 sm:w-[420px] rounded-[20px] p-6 sm:p-7"
            style={{
              background: "rgb(249,245,238)",
              boxShadow: "0 24px 60px rgba(13,27,46,.28)",
              border: "1px solid rgba(194,160,107,.35)",
            }}
          >
            <div className="font-accent text-[11px] uppercase tracking-[2.5px] text-champagne font-semibold mb-3">
              Your privacy
            </div>
            <p className="font-ui text-[14px] leading-relaxed text-navy-mid/85 m-0">
              We use essential cookies to make LUXYN work, and analytics cookies to
              understand how the site is used. You choose what we may use.{" "}
              <a
                href="/cookies"
                className="text-[rgb(160,128,72)] underline underline-offset-2 hover:text-[rgb(120,94,48)] transition-colors"
              >
                Cookie Policy
              </a>
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => decide(true)}
                className={btnGold}
                style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)" }}
              >
                Accept all
              </button>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className={`${btnGhost} flex-1`}
                  style={{ boxShadow: "inset 0 0 0 1px rgba(20,35,59,.25)" }}
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setPrefsOpen(true)}
                  className={`${btnGhost} flex-1`}
                  style={{ boxShadow: "inset 0 0 0 1px rgba(20,35,59,.25)" }}
                >
                  Preferences
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── preferences dialog ───────────────────────────── */}
      <AnimatePresence>
        {prefsOpen && (
          <motion.div
            key="cookie-prefs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[220] flex items-center justify-center p-4"
            style={{ background: "rgba(5,12,24,.55)" }}
            onClick={e => { if (e.target === e.currentTarget) setPrefsOpen(false); }}
          >
            <motion.div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-prefs-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="w-full max-w-[480px] rounded-[22px] p-7 sm:p-8 outline-none"
              style={{ background: "rgb(251,248,241)", boxShadow: "0 30px 80px rgba(13,27,46,.4)" }}
            >
              <div className="font-accent text-[11px] uppercase tracking-[2.5px] text-champagne font-semibold mb-2">
                Cookie preferences
              </div>
              <h2
                id="cookie-prefs-title"
                className="font-display text-[26px] leading-tight text-navy m-0 mb-2"
              >
                Manage your cookies
              </h2>
              <p className="font-ui text-[14px] leading-relaxed text-navy-mid/80 m-0">
                Choose which cookies LUXYN may use. You can change this anytime from
                the footer.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {/* Essential — always on */}
                <div
                  className="flex items-start justify-between gap-4 rounded-[14px] p-4"
                  style={{ background: "rgba(194,160,107,.08)", border: "1px solid rgba(194,160,107,.2)" }}
                >
                  <div>
                    <div className="font-ui font-semibold text-[14.5px] text-navy-mid">Essential</div>
                    <p className="font-ui text-[13px] leading-relaxed text-navy-mid/70 m-0 mt-1">
                      Required for the site to function. Always active.
                    </p>
                  </div>
                  <Toggle checked disabled label="Essential cookies (always on)" />
                </div>

                {/* Analytics — toggleable */}
                <div
                  className="flex items-start justify-between gap-4 rounded-[14px] p-4"
                  style={{ background: "rgb(249,245,238)", border: "1px solid rgba(20,35,59,.1)" }}
                >
                  <div>
                    <div className="font-ui font-semibold text-[14.5px] text-navy-mid">Analytics</div>
                    <p className="font-ui text-[13px] leading-relaxed text-navy-mid/70 m-0 mt-1">
                      Google Analytics — helps us understand how visitors use the site
                      so we can improve it.
                    </p>
                  </div>
                  <Toggle
                    checked={analytics}
                    onChange={setAnalytics}
                    label="Analytics cookies"
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
                <button
                  type="button"
                  onClick={() => decide(analytics)}
                  className={btnGhost}
                  style={{ boxShadow: "inset 0 0 0 1px rgba(20,35,59,.25)" }}
                >
                  Save preferences
                </button>
                <button
                  type="button"
                  onClick={() => decide(true)}
                  className={btnGold}
                  style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)" }}
                >
                  Accept all
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
