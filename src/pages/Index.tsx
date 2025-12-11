"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Admin Portal</h1>
      <p className="mb-4">Use the links below to manage quotes and drafts.</p>
      <div className="space-y-2">
        <Link to="/admin/quote-builder" className="text-blue-500 hover:underline block">
          Go to Quote Builder
        </Link>
        <Link to="/admin/drafts" className="text-blue-500 hover:underline block">
          View Saved Drafts
        </Link>
        <Link to="/admin/quotes" className="text-blue-500 hover:underline block">
          View Finalized Quotes
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;