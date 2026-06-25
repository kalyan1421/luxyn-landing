/**
 * Cookie-consent state — the single source of truth for what the visitor has
 * agreed to. Two categories only, matching the Cookie Policy (/cookies):
 *   • Essential — always on, can't be switched off (the site needs them).
 *   • Analytics — Google Analytics; off until the visitor opts in.
 *
 * The choice is stored in localStorage and mirrored into Google Consent Mode so
 * GA respects it. The consent *default* (denied) is set in app/layout.tsx before
 * GA loads; this module flips analytics_storage to "granted" once allowed.
 */

export const CONSENT_KEY = "luxyn_consent";
/** Bump when the categories change — an older stored version re-prompts. */
export const CONSENT_VERSION = 1;

/** Window event that asks the banner to reopen the preferences dialog. */
export const OPEN_PREFERENCES_EVENT = "luxyn:open-cookie-preferences";

export interface ConsentValue {
  /** Schema version of the stored choice. */
  v: number;
  /** Analytics cookies (Google Analytics) allowed. */
  analytics: boolean;
  /** Unix ms when the choice was made — handy for audit / re-consent windows. */
  ts: number;
}

/** Read the stored choice, or null if none/stale/corrupt (→ show the banner). */
export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentValue;
    if (parsed?.v !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist the choice and push it to Google Consent Mode. */
export function writeConsent(analytics: boolean): ConsentValue {
  const value: ConsentValue = { v: CONSENT_VERSION, analytics, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked (private mode / quota) — consent mode still updates below */
  }
  applyConsent(analytics);
  return value;
}

/** Mirror the choice into Google Consent Mode (independent of GA load order). */
export function applyConsent(analytics: boolean): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  const update = { analytics_storage: analytics ? "granted" : "denied" };
  // The global gtag() shim is defined by the inline scripts in layout.tsx, so it
  // exists once the page has parsed — the normal case when the banner is clicked.
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", update);
    return;
  }
  // Fallback before the shim exists — queue the command on the dataLayer.
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(["consent", "update", update]);
}

/** Ask the consent banner to reopen its preferences dialog (e.g. from a link). */
export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
