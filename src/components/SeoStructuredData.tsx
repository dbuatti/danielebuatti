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
        "@id": "https://danielebuatti.com/#organisation",
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
              "name": "Performance & Musicianship Coaching",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Vocal Coaching",
                    "description": "Coaching for contemporary, classical, and musical theatre vocal styles."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Piano & Keyboard Performance",
                    "description": "Coaching for piano and keyboard performance."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Music Direction & Conducting",
                    "description": "Coaching in music direction and conducting."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Score Preparation & Technology",
                    "description": "Coaching in score preparation and music technology."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AMEB Accompanying",
                    "description": "Professional and supportive piano accompaniment for AMEB exams."
                  }
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Embodiment & Somatic Work Coaching",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Kinesiology",
                    "description": "Kinesiology sessions for mind-body integration."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Holistic Voice & Somatic Techniques",
                    "description": "Holistic voice and somatic techniques including Breath-Body-Mind, Yoga, and Mindfulness."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Tension Release for Vocal Freedom",
                    "description": "Techniques for tension release to achieve vocal freedom."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mind-Body Connection for Natural Resonance",
                    "description": "Coaching to foster mind-body connection for natural resonance."
                  }
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Presence & Communication Coaching",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Public Speaking & Presentation",
                    "description": "Coaching for public speaking and presentation skills."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Acting & Film Performance",
                    "description": "Coaching for acting and film performance."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "On-Camera & Streaming Presence",
                    "description": "Coaching for on-camera and streaming presence."
                  }
                }
              ]
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": testimonials.length
        },
        "review": testimonials.map(t => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
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