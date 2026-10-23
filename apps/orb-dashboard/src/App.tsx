import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
const IndexPage = lazy(() => import('./pages/IndexPage'));
const NASPage = lazy(() => import('./pages/NASPage'));
const NetworkPage = lazy(() => import('./pages/NetworkPage'));
const LaunchAgentsPage = lazy(() => import('./pages/LaunchAgentsPage'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="nas" element={<NASPage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="launch-agents" element={<LaunchAgentsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" offset={88} />
    </BrowserRouter>
  );
}

export default App;