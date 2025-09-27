"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import VoicePianoBookingPage from './pages/VoicePianoBookingPage'; // New import
import HealingBookingPage from './pages/HealingBookingPage'; // New import
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
        <Route path="/book-voice-piano" element={<VoicePianoBookingPage />} /> {/* New route */}
        <Route path="/book-healing" element={<HealingBookingPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;