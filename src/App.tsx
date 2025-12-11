"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminQuotesListPage from '@/pages/admin/AdminQuotesListPage';
import AdminQuoteBuilderPage from '@/pages/admin/AdminQuoteBuilderPage';
import AdminEditQuotePage from '@/pages/admin/AdminEditQuotePage';
import AdminQuoteDetailsPage from '@/pages/admin/AdminQuoteDetailsPage';
import QuotePage from '@/pages/QuotePage';
import AMEBBookingsPage from '@/pages/admin/AMEBBookingsPage';
import EmailTemplatesPage from '@/pages/admin/EmailTemplatesPage';
import ContactPage from '@/pages/ContactPage';
import ResourcesPage from '@/pages/ResourcesPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/App.css';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quotes/:slug" element={<QuotePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            
            {/* Admin routes */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/quotes" element={<AdminQuotesListPage />} />
              <Route path="/admin/quotes/new" element={<AdminQuoteBuilderPage />} />
              <Route path="/admin/quotes/:slug/edit" element={<AdminEditQuotePage />} />
              <Route path="/admin/quotes/:slug" element={<AdminQuoteDetailsPage />} />
              <Route path="/admin/ameb-bookings" element={<AMEBBookingsPage />} />
              <Route path="/admin/email-templates" element={<EmailTemplatesPage />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </SessionContextProvider>
  );
}

export default App;