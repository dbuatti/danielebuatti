"use client";

import React from "react";
import { LegalList, LegalPage, LegalSection } from "@/components/legal";
import { useRouteMeta } from "@/hooks/use-page-meta";

const processedInfo = [
  "Your Instagram account identifier (a numeric ID supplied by Instagram)",
  "The content of the message you sent, for the purpose of classification",
  "Message metadata (message ID and timestamp) used to prevent duplicate replies and to keep operational logs",
];

const usesOfInfo = [
  "Determine whether an incoming message is a work-related enquiry",
  "Send the automatic reply",
  "Prevent duplicate replies and maintain reliable operation",
  "Produce operational logs for troubleshooting",
];

const PrivacyPage: React.FC = () => {
  useRouteMeta("/privacy");

  return (
    <LegalPage
      eyebrow="Legal"
      title={
        <>
          Privacy <em className="italic text-brand-primary">Policy</em>
        </>
      }
      lede="Instagram Work Enquiry Auto-Reply — how we handle information received through the Instagram Messaging API."
      updated="Last updated: 20 October 2026"
    >
      <p>
        This privacy policy explains how the Instagram Work Enquiry Auto-Reply application (&ldquo;the App&rdquo;),
        operated by Daniele Buatti (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), handles information received
        through the Instagram Messaging API.
      </p>

      <LegalSection title="What the App does">
        <p>
          The App connects to the Instagram account{" "}
          <a
            href="https://instagram.com/daniele.buatti"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-dark underline decoration-brand-primary/40 underline-offset-4 transition-colors hover:text-brand-primary"
          >
            @daniele.buatti
          </a>{" "}
          using Meta&rsquo;s official Instagram Messaging API and webhooks. When someone sends a direct message to that
          account, the App reviews the message to determine whether it is a work-related enquiry (for example, a
          booking, performance, teaching or availability enquiry). If the message is identified as a work enquiry, the
          App sends an automatic reply directing the sender to make contact by email.
        </p>
      </LegalSection>

      <LegalSection title="What information we process">
        <p>When you send a direct message to the connected Instagram account, the App may process:</p>
        <LegalList items={processedInfo} />
        <p>
          We do not collect your name, email address, phone number or contacts, and we do not access your Instagram
          password or login credentials.
        </p>
      </LegalSection>

      <LegalSection title="How we use the information">
        <p>Information is used solely to:</p>
        <LegalList items={usesOfInfo} />
        <p>We do not use the information for advertising, profiling, or marketing.</p>
      </LegalSection>

      <LegalSection title="Legal basis">
        <p>
          We process this information on the basis of legitimate interests: to respond to business enquiries
          efficiently and to operate the account responsibly.
        </p>
      </LegalSection>

      <LegalSection title="Sharing">
        <p>
          We do not sell, rent or share your information with third parties. Information is sent to and received from
          Meta Platforms using their official APIs, and is subject to Meta&rsquo;s own terms and privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          Operational logs are retained for a limited period and rotated automatically. Message content is not stored
          beyond what is necessary for operation and troubleshooting.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can stop receiving automated replies by not sending direct messages to the connected account, or by
          contacting us by email.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          Access credentials are stored securely in environment variables on a private server and are not shared
          publicly. The App uses only Meta&rsquo;s official, supported APIs. It does not use scraping, browser
          automation or password-based access.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>For any questions about this policy or your information:</p>
        <p className="text-brand-dark">
          Daniele Buatti
          <br />
          Email:{" "}
          <a
            href="mailto:info@danielebuatti.com"
            className="underline decoration-brand-primary/40 underline-offset-4 transition-colors hover:text-brand-primary"
          >
            info@danielebuatti.com
          </a>
          <br />
          Website:{" "}
          <a
            href="https://danielebuatti.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-brand-primary/40 underline-offset-4 transition-colors hover:text-brand-primary"
          >
            https://danielebuatti.com
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>We may update this policy from time to time. The latest version will always be available at this address.</p>
      </LegalSection>
    </LegalPage>
  );
};

export default PrivacyPage;
