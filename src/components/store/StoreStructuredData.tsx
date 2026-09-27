import React from 'react';

interface Arrangement {
  id: string;
  slug?: string | null;
  title: string;
}

interface StoreStructuredDataProps {
  arrangements: Arrangement[];
}

// Summary-page markup: each ListItem only points at the arrangement's detail
// page, which carries the full Product schema. Marking up full Products here
// would duplicate them in Search Console's Product snippets report.
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
      "name": arr.title,
      "url": `${window.location.origin}/store/arrangements/${arr.slug || arr.id}`
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
