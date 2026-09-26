import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';

// Layouts
import RootLayout from './layouts/RootLayout';
import { SessionContextProvider } from './components/SessionContextProvider';
import ScrollToTop from './components/ScrollToTop';
import FaviconManager from './components/FaviconManager';
import { CartProvider } from './components/store/CartProvider';
import LandingPageV4 from './pages/LandingPageV4';

// The homepage (imported above) is bundled eagerly so first paint doesn't wait
// on a second request; every other route is code-split and loaded on demand.

// Public Pages
const NotFound = lazy(() => import('./pages/NotFound'));
const LivePianoServicesPage = lazy(() => import('./pages/LivePianoServicesPage'));
const AmebAccompanyingPage = lazy(() => import('./pages/AmebAccompanyingPage'));
const MusicDirectorPianistPage = lazy(() => import('./pages/MusicDirectorPianistPage'));
const ProjectsResourcesPage = lazy(() => import('./pages/ProjectsResourcesPage'));
const ArchivePage = lazy(() => import('./pages/ArchivePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CoachingPage = lazy(() => import('./pages/CoachingPage'));
const VoicePianoServicesPage = lazy(() => import('./pages/VoicePianoServicesPage'));
const VoicePianoBookingPage = lazy(() => import('./pages/VoicePianoBookingPage'));
const DynamicQuotePage = lazy(() => import('./pages/DynamicQuotePage'));
const QuoteConfirmationPage = lazy(() => import('./pages/QuoteConfirmationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GiftCardsPage = lazy(() => import('./pages/GiftCardsPage'));
const StorePage = lazy(() => import('./pages/StorePage'));
const StoreSuccessPage = lazy(() => import('./pages/StoreSuccessPage'));
const ArrangementDetailsPage = lazy(() => import('./pages/ArrangementDetailsPage'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminQuotesPage = lazy(() => import('./pages/admin/AdminQuotesPage'));
const AdminQuoteDetailsPage = lazy(() => import('./pages/admin/AdminQuoteDetailsPage'));
const AdminQuoteBuilderPage = lazy(() => import('./pages/admin/AdminQuoteBuilderPage'));
const AdminEditQuotePage = lazy(() => import('./pages/admin/AdminEditQuotePage'));
const AdminAmebBookingsPage = lazy(() => import('./pages/admin/AdminAmebBookingsPage'));
const AdminAmebBookingDetailsPage = lazy(() => import('./pages/admin/AdminAmebBookingDetailsPage'));
const AdminEmailTemplatesPage = lazy(() => import('./pages/admin/AdminEmailTemplatesPage'));
const AdminGiftCardsPage = lazy(() => import('./pages/admin/AdminGiftCardsPage'));
const AdminStorePage = lazy(() => import('./pages/admin/AdminStorePage'));
const JobDecisionFilterPage = lazy(() => import('./pages/admin/JobDecisionFilterPage'));
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage'));
const AdminLeadDetailsPage = lazy(() => import('./pages/admin/AdminLeadDetailsPage'));


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <FaviconManager />
      <SessionContextProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              {/* Public Routes */}
              <Route index element={<LandingPageV4 />} />
              <Route path="booking" element={<Navigate to="/book-voice-piano" replace />} />
              <Route path="coaching" element={<CoachingPage />} />
              <Route path="projects-resources" element={<ProjectsResourcesPage />} />
              <Route path="live-piano-services" element={<LivePianoServicesPage />} />
              <Route path="ameb-accompanying" element={<AmebAccompanyingPage />} />
              <Route path="music-director-pianist" element={<MusicDirectorPianistPage />} />
              <Route path="archive" element={<ArchivePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="voice-piano-services" element={<VoicePianoServicesPage />} />
              <Route path="book-voice-piano" element={<VoicePianoBookingPage />} />
              <Route path="quotes/:slug" element={<DynamicQuotePage />} />
              <Route path="live-piano-services/quote-confirmation" element={<QuoteConfirmationPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="gift-cards" element={<GiftCardsPage />} />
              {/* Retired page; send old links to the live piano services instead. */}
              <Route path="ceremony-specialist" element={<Navigate to="/live-piano-services" replace />} />
              <Route path="store" element={<StorePage />} />
              <Route path="store/success" element={<StoreSuccessPage />} />
              <Route path="store/arrangements/:slug" element={<ArrangementDetailsPage />} />

              {/* Auth Route */}
              <Route path="login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="leads/:id" element={<AdminLeadDetailsPage />} />
                <Route path="quotes" element={<AdminQuotesPage />} />
                <Route path="quotes/:id" element={<AdminQuoteDetailsPage />} />
                <Route path="quotes/edit/:id" element={<AdminEditQuotePage />} />
                <Route path="create-quote" element={<AdminQuoteBuilderPage />} />
                <Route path="ameb-bookings" element={<AdminAmebBookingsPage />} />
                <Route path="ameb-bookings/:id" element={<AdminAmebBookingDetailsPage />} />
                <Route path="email-templates" element={<AdminEmailTemplatesPage />} />
                <Route path="gift-cards" element={<AdminGiftCardsPage />} />
                <Route path="store" element={<AdminStorePage />} />
                <Route path="job-decision-filter" element={<JobDecisionFilterPage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </SessionContextProvider>
      <Toaster richColors position="top-right" offset={88} />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;