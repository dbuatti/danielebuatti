"use client";

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LandingPageV3 from './pages/LandingPageV3';
import LivePianoServicesPage from './pages/LivePianoServicesPage';
import VoicePianoServicesPage from './pages/VoicePianoServicesPage';
import VoicePianoBookingPage from './pages/VoicePianoBookingPage';
import EmbodimentSomaticBookingPage from './pages/EmbodimentSomaticBookingPage';
import AmebAccompanyingPage from './pages/AmebAccompanyingPage';
import CoachingPage from './pages/CoachingPage';
import QuoteConfirmationPage from './pages/QuoteConfirmationPage';
import ProjectsResourcesPage from './pages/ProjectsResourcesPage';
import PresenceCommunicationBookingPage from './pages/PresenceCommunicationBookingPage';
import ArchivePage from './pages/ArchivePage';
import MusicDirectorPianistPage from './pages/MusicDirectorPianistPage';
import DynamicQuotePage from './pages/DynamicQuotePage';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminQuotesPage from './pages/admin/AdminQuotesPage';
import AdminQuoteDetailsPage from './pages/admin/AdminQuoteDetailsPage';
import AdminAmebBookingsPage from './pages/admin/AdminAmebBookingsPage';
import AdminEmailTemplatesPage from './pages/admin/AdminEmailTemplatesPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import RootLayout from './layouts/RootLayout'; // Import the new RootLayout

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Use RootLayout as the top-level element for all main app routes
    errorElement: <NotFound />, // This NotFound will catch errors from RootLayout and its children
    children: [
      { index: true, element: <LandingPageV3 /> },
      { path: "coaching", element: <CoachingPage /> },
      { path: "projects-resources", element: <ProjectsResourcesPage /> },
      { path: "live-piano-services", element: <LivePianoServicesPage /> },
      { path: "voice-piano-services", element: <VoicePianoServicesPage /> },
      { path: "book-voice-piano", element: <VoicePianoBookingPage /> },
      { path: "book-embodiment-somatic", element: <EmbodimentSomaticBookingPage /> },
      { path: "book-presence-communication", element: <PresenceCommunicationBookingPage /> },
      { path: "ameb-accompanying", element: <AmebAccompanyingPage /> },
      { path: "live-piano-services/quote-confirmation", element: <QuoteConfirmationPage /> },
      { path: "archive", element: <ArchivePage /> },
      { path: "music-director-pianist", element: <MusicDirectorPianistPage /> },
      { path: "quotes/:slug", element: <DynamicQuotePage /> },
      { path: "about", element: <AboutPage /> },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "quotes", element: <AdminQuotesPage /> },
          { path: "quotes/:id", element: <AdminQuoteDetailsPage /> },
          { path: "ameb-bookings", element: <AdminAmebBookingsPage /> },
          { path: "email-templates", element: <AdminEmailTemplatesPage /> },
        ],
      },
      { path: "*", element: <NotFound /> }, // Catch-all route for paths under RootLayout
    ],
  },
  {
    path: "/login", // /login is a standalone route, outside the RootLayout
    element: <Login />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;