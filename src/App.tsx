"use client";

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from './pages/Index';
import AdminQuoteBuilderPage from './pages/admin/AdminQuoteBuilderPage';
import AdminEditQuotePage from './pages/admin/AdminEditQuotePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/quotes/new" element={<AdminQuoteBuilderPage />} />
          <Route path="/admin/quotes/:slug/edit" element={<AdminEditQuotePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;