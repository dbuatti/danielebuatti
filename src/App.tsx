"use client";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import NotFound from './pages/NotFound'; // Import NotFound page

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageV3 />,
    errorElement: <NotFound />, // Add error element for root route
  },
  {
    path: "/coaching",
    element: <CoachingPage />,
  },
  {
    path: "/projects-resources",
    element: <ProjectsResourcesPage />,
  },
  {
    path: "/live-piano-services",
    element: <LivePianoServicesPage />,
  },
  {
    path: "/voice-piano-services",
    element: <VoicePianoServicesPage />,
  },
  {
    path: "/book-voice-piano",
    element: <VoicePianoBookingPage />,
  },
  {
    path: "/book-embodiment-somatic",
    element: <EmbodimentSomaticBookingPage />,
  },
  {
    path: "/book-presence-communication",
    element: <PresenceCommunicationBookingPage />,
  },
  {
    path: "/ameb-accompanying",
    element: <AmebAccompanyingPage />,
  },
  {
    path: "/live-piano-services/quote-confirmation",
    element: <QuoteConfirmationPage />,
  },
  {
    path: "/archive",
    element: <ArchivePage />,
  },
  {
    path: "/music-director-pianist",
    element: <MusicDirectorPianistPage />,
  },
  {
    path: "/quotes/:slug",
    element: <DynamicQuotePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "quotes", element: <AdminQuotesPage /> },
      { path: "quotes/:id", element: <AdminQuoteDetailsPage /> },
      { path: "ameb-bookings", element: <AdminAmebBookingsPage /> },
      { path: "email-templates", element: <AdminEmailTemplatesPage /> },
    ],
  },
  {
    path: "*", // Catch-all route for 404
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;