"use client";

import React from 'react';

const AdminQuotesPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Finalized Quotes</h1>
      <p className="text-gray-500">This page will list all finalized quotes (invoices) that have been sent to clients.</p>
    </div>
  );
};

export default AdminQuotesPage;