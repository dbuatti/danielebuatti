"use client";

import React from 'react';
import { useParams } from 'react-router-dom';

const QuotePublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Public Quote View</h1>
      <p className="text-lg">Viewing quote with slug: <span className="font-mono text-brand-primary">{slug}</span></p>
      <p className="mt-4 text-gray-500">This page will eventually display the client-facing quote details.</p>
    </div>
  );
};

export default QuotePublicPage;