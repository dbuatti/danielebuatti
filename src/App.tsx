"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop'; // Import the new ScrollToTop component

function App() {
  return (
    <Router>
      <Toaster />
      <ScrollToTop /> {/* Wrap Routes with ScrollToTop */}
      <Routes>
        <Route path="/" element={<LandingPageV3 />} />
        <Route path="/live-piano-services" element={<LivePianoServicesPage />} />
      </Routes>
    </Router>
  );
}

export default App;