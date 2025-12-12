import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import RootLayout from './layouts/RootLayout';
import AdminLayout from './pages/admin/AdminLayout';
import { SessionContextProvider } from './components/SessionContextProvider';
import ScrollToTop from './components/ScrollToTop';
import FaviconManager from './components/FaviconManager'; // Import FaviconManager

// Public Pages
import LandingPageV3 from './pages/LandingPageV3';
import NotFound from './pages/NotFound';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import AmebAccompanyingPage from './pages/AmebAccompanyingPage';
import MusicDirectorPianistPage from './pages/MusicDirectorPianistPage';
import ProjectsResourcesPage from './pages/ProjectsResourcesPage';
import ArchivePage from './pages/ArchivePage';
import AboutPage from './pages/AboutPage';
import CoachingPage from './pages/CoachingPage';
import VoicePianoServicesPage from './pages/VoicePianoServicesPage';
import VoicePianoBookingPage from './pages/VoicePianoBookingPage';
import EmbodimentSomaticBookingPage from './pages/EmbodimentSomaticBookingPage';
import PresenceCommunicationBookingPage from './pages/PresenceCommunicationBookingPage';
import DynamicQuotePage from './pages/DynamicQuotePage';
import QuoteConfirmationPage from './pages/QuoteConfirmationPage';

// Admin Pages
import Login from './pages/Login';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminQuotesPage from './pages/admin/AdminQuotesPage';
import AdminQuoteDetailsPage from './pages/admin/AdminQuoteDetailsPage';
import AdminQuoteBuilderPage from './pages/admin/AdminQuoteBuilderPage';
import AdminEditQuotePage from './pages/admin/AdminEditQuotePage';
import AdminAmebBookingsPage from './pages/admin/AdminAmebBookingsPage';
import AdminAmebBookingDetailsPage from './pages/admin/AdminAmebBookingDetailsPage';
import AdminEmailTemplatesPage from './pages/admin/AdminEmailTemplatesPage';


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <FaviconManager />
      <SessionContextProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Public Routes */}
            <Route index element={<LandingPageV3 />} />
            <Route path="coaching" element={<CoachingPage />} />
            <Route path="projects-resources" element={<ProjectsResourcesPage />} />
            <Route path="live-piano-services" element={<LivePianoServicesPage />} />
            <Route path="ameb-accompanying" element={<AmebAccompanyingPage />} />
            <Route path="music-director-pianist" element={<MusicDirectorPianistPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="voice-piano-services" element={<VoicePianoServicesPage />} />
            <Route path="book-voice-piano" element={<VoicePianoBookingPage />} />
            <Route path="book-embodiment-somatic" element={<EmbodimentSomaticBookingPage />} />
            <Route path="book-presence-communication" element={<PresenceCommunicationBookingPage />} />
            <Route path="quotes/:slug" element={<DynamicQuotePage />} />
            <Route path="live-piano-services/quote-confirmation" element={<QuoteConfirmationPage />} />

            {/* Auth Route */}
            <Route path="login" element={<Login />} />

            {/* Admin Routes (Protected by SessionContextProvider) */}
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="quotes" element={<AdminQuotesPage />} />
              <Route path="quotes/:id" element={<AdminQuoteDetailsPage />} />
              <Route path="quotes/edit/:id" element={<AdminEditQuotePage />} />
              <Route path="create-quote" element={<AdminQuoteBuilderPage />} />
              <Route path="ameb-bookings" element={<AdminAmebBookingsPage />} />
              <Route path="ameb-bookings/:id" element={<AdminAmebBookingDetailsPage />} />
              <Route path="email-templates" element={<AdminEmailTemplatesPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SessionContextProvider>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;