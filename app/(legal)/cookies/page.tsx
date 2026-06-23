import type { Metadata } from "next";
import LegalLayout from "../../_components/LegalLayout";
import { site } from "../../_lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${site.name} uses cookies and similar technologies.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="June 2026" current="/cookies">
      <p>
        This Cookie Policy explains how {site.name} uses cookies and similar technologies when you visit
        our website.
      </p>

      <h2>What cookies are</h2>
      <p>
        Cookies are small text files stored on your device that help websites function and remember your
        preferences.
      </p>

      <h2>How we use cookies</h2>
      <ul>
        <li><strong>Essential:</strong> required for the site to function correctly.</li>
        <li><strong>Analytics:</strong> help us understand how visitors use the site so we can improve it.</li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings. Disabling some cookies may affect
        how the site works.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about our use of cookies? Email{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
