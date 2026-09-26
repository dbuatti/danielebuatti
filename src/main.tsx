import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // App now exports the RouterProvider
// Self-hosted variable fonts (Fraunces display, Inter text).
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter/index.css";
import "./globals.css";
// Removed ThemeProvider import

createRoot(document.getElementById("root")!).render(
  // Removed ThemeProvider wrapper
    <App />
);