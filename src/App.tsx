"use client";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import VoicePianoServicesPage from './pages/VoicePianoServicesPage';
import VoicePianoBookingPage from './pages/VoicePianoBookingPage';
import EmbodimentSomaticBookingPage from './pages/EmbodimentSomaticBookingPage';
import AmebAccompanyingPage from './pages/AmebAccompanyingPage';
import ServicesPage from './pages/ServicesPage';
import QuoteConfirmationPage from './pages/QuoteConfirmationPage';
import ProgramsPage from './pages/ProgramsPage';
import PresenceCommunicationBookingPage from './pages/PresenceCommunicationBookingPage';
import ArchivePage from './pages/ArchivePage';
import MusicDirectorPianistPage from './pages/MusicDirectorPianistPage';
import DynamicQuotePage from './pages/DynamicQuotePage';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import { SessionContextProvider } from './components/SessionContextProvider';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminQuotesPage from './pages/admin/AdminQuotesPage';
import AdminQuoteDetailsPage from './pages/admin/AdminQuoteDetailsPage';
import AdminAmebBookingsPage from './pages/admin/AdminAmebBookingsPage';
import AdminEmailTemplatesPage from './pages/admin/AdminEmailTemplatesPage'; // Import new Email Templates page

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster />
      <ScrollToTop />
      <SessionContextProvider>
        <Routes>
          <Route path="/" element={<LandingPageV3 />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/live-piano-services" element={<LivePianoServicesPage />} />
          <Route path="/voice-piano-services" element={<VoicePianoServicesPage />} />
          <Route path="/book-voice-piano" element={<VoicePianoBookingPage />} />
          <Route path="/book-embodiment-somatic" element={<EmbodimentSomaticBookingPage />} />
          <Route path="/book-presence-communication" element={<PresenceCommunicationBookingPage />} />
          <Route path="/services/ameb-accompanying" element={<AmebAccompanyingPage />} />
          <Route path="/live-piano-services/quote-confirmation" element={<QuoteConfirmationPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/music-director-pianist" element={<MusicDirectorPianistPage />} />
          
          {/* New dynamic quote page route using slug */}
          <Route path="/quotes/:slug" element={<DynamicQuotePage />} />

          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="quotes/:id" element={<AdminQuoteDetailsPage />} />
            <Route path="ameb-bookings" element={<AdminAmebBookingsPage />} />
            <Route path="email-templates" element={<AdminEmailTemplatesPage />} /> {/* New route */}
          </Route>
        </Routes>
      </SessionContextProvider>
    </Router>
  );
}

export default App;