"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3'; // Changed from Index to LandingPageV3
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import { Toaster } from 'sonner'; // Changed from react-hot-toast to sonner

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPageV3 />} /> {/* Updated to LandingPageV3 */}
        <Route path="/live-piano-services" element={<LivePianoServicesPage />} />
      </Routes>
    </Router>
  );
}

export default App;