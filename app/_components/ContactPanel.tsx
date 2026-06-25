"use client";

import { useId, useState } from "react";
import ContactForm, { type ContactVariant } from "./ContactForm";
import { site, fullAddress } from "../_lib/site";

const TABS = [
  { key: "lease", label: "Lease a suite" },
  { key: "tour",  label: "Book a tour"   },
] as const;

const CONTACT_ICONS = {
  email: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
  phone: <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />,
  address: <><path d="M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

function ContactLine({ type }: { type: "email" | "phone" | "address" }) {
  const data = {
    email:   { label: "EMAIL", value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
    phone:   { label: "CALL",  value: site.contact.phone, href: `tel:${site.contact.phoneHref}`, external: false },
    address: { label: "VISIT", value: fullAddress,        href: mapsUrl,                         external: true  },
  }[type];

  return (
    <div className="flex items-start gap-3.5">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(198,155,95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
        {CONTACT_ICONS[type]}
      </svg>
      <span className="flex flex-col gap-0.5">
        <span className="font-accent font-semibold text-[rgb(95,99,106)]" style={{ fontSize: 11, letterSpacing: 1.4 }}>{data.label}</span>
        <a
          href={data.href}
          {...(data.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-ui text-[rgb(2,36,72)] text-[15.5px] underline underline-offset-2 decoration-[rgb(214,205,182)] transition-colors duration-300 hover:text-[rgb(150,118,62)] hover:decoration-[rgb(150,118,62)]"
        >
          {data.value}
          {data.external && <span className="sr-only"> (opens Google Maps in a new tab)</span>}
        </a>
      </span>
    </div>
  );
}

/**
 * Contact details + enquiry form for the dedicated /contact page. Mirrors the
 * contact section on the home page (intent switcher + ContactForm) so leads can
 * convert straight from the focused page.
 */
export default function ContactPanel() {
  const [variant, setVariant] = useState<ContactVariant>("lease");
  const uid = useId();
  const tabId = (key: string) => `${uid}-tab-${key}`;
  const panelId = `${uid}-panel`;

  /** Arrow-key roving focus across the tablist (WAI-ARIA tabs pattern). */
  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const idx = TABS.findIndex(t => t.key === variant);
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    const key = TABS[next].key;
    setVariant(key);
    document.getElementById(tabId(key))?.focus();
  };

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      <div
        className="flex flex-col rounded-[20px] p-6 sm:p-8"
        style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
      >
        <h2 className="m-0 font-display font-semibold text-[rgb(2,36,72)] text-[22px] sm:text-[25px]" style={{ lineHeight: 1.2 }}>
          Reach us directly
        </h2>
        <p className="mt-2.5 font-ui text-[rgb(67,71,78)] text-[14.5px]" style={{ lineHeight: 1.6 }}>
          Prefer to talk first? Call or email and a real person will get back to you — we typically respond within one business day.
        </p>

        <div className="mt-7 flex flex-col gap-5">
          <ContactLine type="email" />
          <ContactLine type="phone" />
          <ContactLine type="address" />
        </div>
      </div>

      <div>
        <div
          role="tablist" aria-label="Enquiry type"
          className="mb-5 flex gap-1.5 rounded-full p-1.5"
          style={{ background: "rgba(20,35,59,0.06)" }}
        >
          {TABS.map(({ key, label }) => {
            const active = variant === key;
            return (
              <button
                key={key}
                id={tabId(key)}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                onClick={() => setVariant(key)}
                onKeyDown={onTabKeyDown}
                className="flex-1 h-[42px] rounded-full font-ui font-bold transition-all duration-300"
                style={{
                  fontSize: 13, letterSpacing: 0.3,
                  background: active ? "rgb(20,35,59)" : "transparent",
                  color: active ? "rgb(225,216,194)" : "rgb(53,57,64)",
                  boxShadow: active ? "0 8px 20px rgba(20,35,59,.18)" : "none",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div id={panelId} role="tabpanel" aria-labelledby={tabId(variant)}>
          <ContactForm key={variant} variant={variant} />
        </div>
      </div>
    </div>
  );
}
