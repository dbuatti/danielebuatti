"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import VoicePianoBookingPage from './pages/VoicePianoBookingPage';
import HealingBookingPage from './pages/HealingBookingPage';
import AmebAccompanyingPage from './pages/AmebAccompanyingPage'; // New import
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <Toaster />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPageV3 />} />
        <Route path="/live-piano-services" element={<LivePianoServicesPage />} />
        <Route path="/book-voice-piano" element={<VoicePianoBookingPage />} />
        <Route path="/book-healing" element={<HealingBookingPage />} />
        <Route path="/ameb-accompanying" element={<AmebAccompanyingPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;