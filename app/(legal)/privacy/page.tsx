import type { Metadata } from "next";
import LegalLayout from "../../_components/LegalLayout";
import { site } from "../../_lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your personal information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 2026" current="/privacy">
      <p>
        This Privacy Policy explains how {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
        uses, and safeguards your information when you visit our website or enquire about leasing a suite.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Details you provide:</strong> your name, email, phone number, and the contents of any enquiry you submit.</li>
        <li><strong>Usage data:</strong> standard analytics such as pages viewed and approximate location, collected to improve the site.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your enquiry and arrange tours or leasing.</li>
        <li>To operate, maintain, and improve our website.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We share it only with service providers who help us
        operate (for example, our form-delivery provider), and only as needed to provide our services.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information at any time by
        emailing <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach us at{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
