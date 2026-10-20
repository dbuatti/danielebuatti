"use client";

import React from "react";
import { LegalPage, LegalSection } from "@/components/legal";
import { useRouteMeta } from "@/hooks/use-page-meta";

const TermsPage: React.FC = () => {
  useRouteMeta("/terms");

  return (
    <LegalPage
      eyebrow="Legal"
      title={
        <>
          Terms of <em className="italic text-brand-primary">Service</em>
        </>
      }
      lede="The terms that apply to this site and to the automated replies sent from the Instagram work enquiry service."
      updated="Last updated: 20 October 2026"
    >
      <p>
        These terms apply to your use of danielebuatti.com and to the automated replies sent through the Instagram
        account @daniele.buatti. By using the site or contacting us, you agree to them.
      </p>

      <LegalSection title="Provided as-is">
        <p>
          The site and its automated Instagram replies are provided as-is, for the purpose of responding to business
          enquiries. They are offered without warranties of any kind, to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="Automated replies are informational">
        <p>
          Automated replies are informational only. They acknowledge your message and direct you to make contact by
          email. An automated reply is not a booking, a confirmation or a commitment of any kind.
        </p>
      </LegalSection>

      <LegalSection title="No guarantee of availability or booking">
        <p>
          Nothing on the site, and nothing in an automated reply, guarantees availability, a date or a booking.
          Schedules change and availability cannot be promised in advance.
        </p>
      </LegalSection>

      <LegalSection title="Engagements confirmed separately by email">
        <p>
          All engagements are agreed and confirmed separately by email, including the details, timing and fees. Only an
          email confirmation from us constitutes a booking.
        </p>
      </LegalSection>

      <LegalSection title="Ownership">
        <p>
          The site content, music, arrangements and services are the property of Daniele Buatti and may not be
          reproduced or used commercially without permission.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For any questions about these terms, contact{" "}
          <a
            href="mailto:info@danielebuatti.com"
            className="text-brand-dark underline decoration-brand-primary/40 underline-offset-4 transition-colors hover:text-brand-primary"
          >
            info@danielebuatti.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
};

export default TermsPage;
