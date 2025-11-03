import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // App now exports the RouterProvider
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx"; // Import ThemeProvider
// Removed SessionContextProvider import

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
    {/* SessionContextProvider is now handled within App.tsx routes */}
    <App />
  </ThemeProvider>
);