"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import LivePianoServicesPage from './pages/LivePianoServicesPage'; // Import the new page
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/live-piano-services" element={<LivePianoServicesPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;