"use client";

import React from 'react';
import { useAcuityEmbedScript } from '@/hooks/use-acuity-embed-script';

interface AcuityEmbedProps {
  src: string;
  title: string;
}

const AcuityEmbed: React.FC<AcuityEmbedProps> = ({ src, title }) => {
  useAcuityEmbedScript();

  return (
    <iframe
      src={src}
      width="100%"
      height="800"
      frameBorder="0"
      allow="payment"
      title={title}
      className="rounded-lg"
    ></iframe>
  );
};

export default AcuityEmbed;