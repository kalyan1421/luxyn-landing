"use client";

import { useState } from "react";

/**
 * Share toolbar for an article — X, LinkedIn, Facebook and email intents plus a
 * copy-link button with a transient "Copied" confirmation. The canonical URL and
 * title are passed from the server so the links are correct in the static export.
 */
export default function ArticleShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" /> },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 17.34V10.4H6.06v6.94h2.28Zm-1.14-7.92a1.32 1.32 0 1 0 0-2.64 1.32 1.32 0 0 0 0 2.64Zm10.14 7.92v-3.8c0-2.03-1.08-2.98-2.53-2.98-1.17 0-1.69.64-1.98 1.09v-.94h-2.28c.03.64 0 6.94 0 6.94h2.28v-3.88c0-.2.01-.41.07-.56.17-.41.54-.84 1.18-.84.83 0 1.16.63 1.16 1.56v3.72h2.28Z" /> },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" /> },
    { label: "Share by email", href: `mailto:?subject=${t}&body=${u}`, icon: <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.01L12 13l8-6.99V6H4Zm16 2.24-8 6.99-8-6.99V18h16V8.24Z" /> },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  const chip =
    "flex h-[42px] w-[42px] items-center justify-center rounded-full transition-[transform,background,color] duration-300 hover:-translate-y-0.5";
  const chipStyle = { background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)", color: "rgb(33,58,92)" } as const;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1 font-ui font-semibold text-[13px] text-[rgb(120,124,131)]">Share</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} className={`${chip} hover:text-[rgb(160,128,72)]`} style={chipStyle}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{l.icon}</svg>
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Copy link" className={`${chip} hover:text-[rgb(160,128,72)]`} style={chipStyle}>
        {copied ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgb(46,125,80)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        )}
      </button>
      {copied && <span className="font-ui text-[13px] text-[rgb(46,125,80)]">Copied</span>}
    </div>
  );
}
