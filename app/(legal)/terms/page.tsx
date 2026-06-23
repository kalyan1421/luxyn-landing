import type { Metadata } from "next";
import LegalLayout from "../../_components/LegalLayout";
import { site } from "../../_lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing your use of the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 2026" current="/terms">
      <p>
        These Terms of Service govern your use of the {site.name} website. By using the site, you agree
        to these terms.
      </p>

      <h2>Use of the site</h2>
      <p>
        You may use this site for lawful purposes only. You agree not to misuse the site, interfere with
        its operation, or attempt to access it in any way other than through the interface we provide.
      </p>

      <h2>Enquiries</h2>
      <p>
        Submitting an enquiry does not constitute a lease agreement or a guarantee of availability. Any
        lease is subject to a separate written agreement.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this site — including text, imagery, and branding — is the property of {site.name}
        and may not be reproduced without permission.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest extent
        permitted by law, {site.name} is not liable for any damages arising from your use of the site.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
