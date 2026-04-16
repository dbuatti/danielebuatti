import React from 'react';

interface Arrangement {
  id: string;
  title: string;
  composer: string | null;
  price: number | null;
  instrumentation: string | null;
  difficulty: string | null;
  preview_image_path: string | null;
}

interface StoreStructuredDataProps {
  arrangements: Arrangement[];
}

const StoreStructuredData: React.FC<StoreStructuredDataProps> = ({ arrangements }) => {
  if (!arrangements || arrangements.length === 0) return null;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Music Arrangements by Daniele Buatti",
    "description": "A collection of professional musical arrangements and scores for piano, vocals, and more.",
    "url": `${window.location.origin}/store`,
    "numberOfItems": arrangements.length,
    "itemListElement": arrangements.map((arr, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": arr.title,
        "description": `${arr.instrumentation || 'Musical arrangement'} by ${arr.composer || 'Daniele Buatti'}. Difficulty: ${arr.difficulty || 'N/A'}.`,
        "brand": {
          "@type": "Brand",
          "name": "Daniele Buatti"
        },
        "offers": {
          "@type": "Offer",
          "price": arr.price || 0,
          "priceCurrency": "AUD",
          "availability": "https://schema.org/InStock",
          "url": `${window.location.origin}/store`
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
    />
  );
};

export default StoreStructuredData;