import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
const IndexPage = lazy(() => import('./pages/IndexPage'));
const NASPage = lazy(() => import('./pages/NASPage'));
const NetworkPage = lazy(() => import('./pages/NetworkPage'));
const LaunchAgentsPage = lazy(() => import('./pages/LaunchAgentsPage'));
const StremioPage = lazy(() => import('./pages/StremioPage'));
const CrossOverPage = lazy(() => import('./pages/CrossOverPage'));
const JitsiPage = lazy(() => import('./pages/JitsiPage'));
const DevicesPage = lazy(() => import('./pages/DevicesPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="text-amber-400 animate-pulse">Loading...</div></div>}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<IndexPage />} />
            <Route path="nas" element={<NASPage />} />
            <Route path="network" element={<NetworkPage />} />
            <Route path="launch-agents" element={<LaunchAgentsPage />} />
            <Route path="stremio" element={<StremioPage />} />
            <Route path="crossover" element={<CrossOverPage />} />
            <Route path="jitsi" element={<JitsiPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster richColors position="top-right" offset={88} />
    </BrowserRouter>
  );
}

export default App;