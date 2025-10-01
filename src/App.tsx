"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import VoicePianoServicesPage from './pages/VoicePianoServicesPage';
import VoicePianoBookingPage from './pages/VoicePianoBookingPage';
import HealingBookingPage from './pages/HealingBookingPage';
import AmebAccompanyingPage from './pages/AmebAccompanyingPage';
import ServicesPage from './pages/ServicesPage';
import QuoteProposalPage from './pages/QuoteProposalPage';
import QuoteConfirmationPage from './pages/QuoteConfirmationPage'; // New import
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPageV3 />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/live-piano-services" element={<LivePianoServicesPage />} />
        <Route path="/voice-piano-services" element={<VoicePianoServicesPage />} />
        <Route path="/book-voice-piano" element={<VoicePianoBookingPage />} />
        <Route path="/book-healing" element={<HealingBookingPage />} />
        <Route path="/ameb-accompanying" element={<AmebAccompanyingPage />} />
        <Route path="/live-piano-services/quote-proposal" element={<QuoteProposalPage />} />
        <Route path="/live-piano-services/quote-confirmation" element={<QuoteConfirmationPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;