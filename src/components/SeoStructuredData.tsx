import React from 'react';
import { testimonials } from '@/components/pages/landing-page-v3/TestimonialsSection'; // Import testimonials

const SeoStructuredData: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://danielebuatti.com/#person",
        "name": "Daniele Buatti",
        "url": "https://danielebuatti.com/",
        "image": "https://danielebuatti.com/headshot.jpeg",
        "sameAs": [
          "https://instagram.com/daniele.buatti",
          "http://youtube.com/danielebuatti",
          "https://twitch.tv/danielebuatti",
          "https://substack.com/@danielebuatti",
          "http://www.facebook.com/danielebuatti",
          "http://patreon.com/danielebuatti",
          "https://discord.gg/pfW8B3Fy",
          "https://rxresu.me/daniele.buatti/daniele-buatti-md"
        ],
        "jobTitle": "Embodied Coaching for Performers & Communicators",
        "alumniOf": "Australian Institute of Music"
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://danielebuatti.com/#organization",
        "name": "Daniele Buatti Coaching",
        "url": "https://danielebuatti.com/",
        "logo": "https://danielebuatti.com/logo-pinkwhite.png",
        "image": "https://danielebuatti.com/headshot.jpeg",
        "description": "Daniele Buatti offers embodied coaching for performers and communicators, blending musical training with body awareness and mindset techniques for confident, authentic expression.",
        "telephone": "+61424174067",
        "email": "info@danielebuatti.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "685 Toorak Road",
          "addressLocality": "Toorak",
          "addressRegion": "VIC",
          "postalCode": "3142",
          "addressCountry": "AU"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Coaching Services",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "1:1 Coaching",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Voice & Piano Sessions",
                    "description": "Personalised 1:1 coaching for vocal mastery, breath work, body integration, repertoire, audition prep, and supportive piano lessons."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Healing & Body-Voice Integration Sessions",
                    "description": "Integrated body-voice work sessions focusing on holistic somatic practices."
                  }
                }
              ]
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Workshops & Group Classes",
                "description": "Group sessions for public speaking, on-camera presence, and 'Body Voice Sound Workshop'."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Remote/Zoom Sessions",
                "description": "World-class coaching available online for on-camera performance, virtual presentations, audition cuts, and Kinesiology."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AMEB Accompanying Services",
                "description": "Professional and supportive piano accompaniment for AMEB exams and rehearsals."
              }
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": testimonials.length // Dynamically use the number of testimonials
        },
        "review": testimonials.map(t => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5" // Assuming all testimonials are 5-star
          },
          "author": {
            "@type": "Person",
            "name": t.author
          },
          "reviewBody": t.quote
        }))
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SeoStructuredData;