"use client";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import VoicePianoServicesPage from './pages/VoicePianoServicesPage';
import VoicePianoBookingPage from './pages/VoicePianoBookingPage';
import EmbodimentSomaticBookingPage from './pages/EmbodimentSomaticBookingPage';
import AmebAccompanyingPage from './pages/AmebAccompanyingPage';
import ServicesPage from './pages/ServicesPage';
import QuoteProposalPage from './pages/QuoteProposalPage';
import QuoteConfirmationPage from './pages/QuoteConfirmationPage';
import ProgramsPage from './pages/ProgramsPage';
import PresenceCommunicationBookingPage from './pages/PresenceCommunicationBookingPage';
import ArchivePage from './pages/ArchivePage';
import MusicDirectorPianistPage from './pages/MusicDirectorPianistPage';
import ErinKennedyQuotePage from './pages/ErinKennedyQuotePage';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import { SessionContextProvider } from './components/SessionContextProvider'; // Import SessionContextProvider
import Login from './pages/Login'; // Import Login page
import AdminLayout from './pages/admin/AdminLayout'; // Import AdminLayout
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // Import AdminDashboardPage
import AdminInvoicesPage from './pages/admin/AdminInvoicesPage'; // Import AdminInvoicesPage
import AdminInvoiceDetailsPage from './pages/admin/AdminInvoiceDetailsPage'; // Import AdminInvoiceDetailsPage

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster />
      <ScrollToTop />
      <SessionContextProvider> {/* Wrap Routes with SessionContextProvider */}
        <Routes>
          <Route path="/" element={<LandingPageV3 />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/live-piano-services" element={<LivePianoServicesPage />} />
          <Route path="/voice-piano-services" element={<VoicePianoServicesPage />} />
          <Route path="/book-voice-piano" element={<VoicePianoBookingPage />} />
          <Route path="/book-embodiment-somatic" element={<EmbodimentSomaticBookingPage />} />
          <Route path="/book-presence-communication" element={<PresenceCommunicationBookingPage />} />
          <Route path="/ameb-accompanying" element={<AmebAccompanyingPage />} />
          <Route path="/live-piano-services/quote-proposal" element={<QuoteProposalPage />} />
          <Route path="/live-piano-services/quote-confirmation" element={<QuoteConfirmationPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/music-director-pianist" element={<MusicDirectorPianistPage />} />
          <Route path="/erin-kennedy-2025-quote" element={<ErinKennedyQuotePage />} />

          {/* New Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="invoices" element={<AdminInvoicesPage />} />
            <Route path="invoices/:id" element={<AdminInvoiceDetailsPage />} />
          </Route>
        </Routes>
      </SessionContextProvider>
    </Router>
  );
}

export default App;