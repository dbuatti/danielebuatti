"use client";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index';
import AdminQuoteBuilderPage from './pages/admin/AdminQuoteBuilderPage';
import AdminEditQuotePage from './pages/admin/AdminEditQuotePage';
import AdminDraftsPage from './pages/admin/AdminDraftsPage';
import { SessionContextProvider } from '@/components/auth/SessionContextProvider';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import QuotePublicPage from './pages/QuotePublicPage';
import AdminQuotesPage from './pages/admin/AdminQuotesPage';
import AdminLayout from '@/components/layout/AdminLayout';

function App() {
  return (
    <SessionContextProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/quotes/:slug" element={<QuotePublicPage />} />

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} />}>
            <Route index element={<AdminQuotesPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="quotes/:slug" element={<AdminEditQuotePage />} />
            <Route path="quote-builder" element={<AdminQuoteBuilderPage />} />
            <Route path="drafts" element={<AdminDraftsPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </SessionContextProvider>
  );
}

export default App;