import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // App now exports the RouterProvider
import "./globals.css";
// Removed ThemeProvider import

createRoot(document.getElementById("root")!).render(
  // Removed ThemeProvider wrapper
    <App />
);