import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // App now exports the RouterProvider
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx"; // Import ThemeProvider

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
    <App />
  </ThemeProvider>
);