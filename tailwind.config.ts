import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // One editorial type system: Fraunces for display, Inter for everything
      // else. The legacy family names (display, montserrat, libre-baskerville)
      // are kept as aliases so existing markup falls into the same system.
      fontFamily: {
        sans: ["Inter Variable", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Fraunces Variable", "Fraunces", "ui-serif", "Georgia", "serif"],
        display: ["Fraunces Variable", "Fraunces", "ui-serif", "Georgia", "serif"],
        montserrat: ["Inter Variable", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        "libre-baskerville": ["Fraunces Variable", "Fraunces", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        // Warm-to-ink neutral scale replacing Tailwind's cool greys, so every
        // text-gray-* / bg-gray-* on the site sits in the ivory + navy palette.
        gray: {
          50: "#FAF7F2",
          100: "#F3EEE6",
          200: "#E7E0D5",
          300: "#D3CBBE",
          400: "#A39E97",
          500: "#76767C",
          600: "#585C6B",
          700: "#40455A",
          800: "#2A3048",
          900: "#1A2039",
          950: "#10142A",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom Brand Colors
        brand: {
          primary: "hsl(var(--brand-primary))",
          dark: "hsl(var(--brand-dark))",
          light: "hsl(var(--brand-light))",
          secondary: "hsl(var(--brand-secondary))",
          blue: "hsl(var(--brand-blue))",
          magenta: "hsl(var(--brand-magenta))",
          yellow: "hsl(var(--brand-yellow))",
          "dark-alt": "hsl(var(--brand-dark-alt))",
        },
        // New color palette specifically for Live Piano Services page
        livePiano: {
          background: "hsl(var(--live-piano-background))",
          primary: "hsl(var(--live-piano-primary))",
          light: "hsl(var(--live-piano-light))",
          border: "hsl(var(--live-piano-border))",
          darker: "hsl(var(--live-piano-darker))",
        },
      },
      borderRadius: {
        "2xl": "calc(var(--radius) + 8px)",
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      boxShadow: {
        // Soft, ink-tinted elevation used for cards and floating UI.
        soft: "0 1px 2px hsl(229 44% 14% / 0.04), 0 8px 24px -12px hsl(229 44% 14% / 0.12)",
        lifted: "0 2px 4px hsl(229 44% 14% / 0.05), 0 24px 48px -20px hsl(229 44% 14% / 0.25)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-sm': {
          'text-shadow': '1px 1px 2px rgba(0, 0, 0, 0.6)',
        },
        '.text-shadow': {
          'text-shadow': '2px 2px 4px rgba(0, 0, 0, 0.7)',
        },
        '.text-shadow-lg': {
          'text-shadow': '3px 3px 6px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-none': {
          'text-shadow': 'none',
        },
      }, ['responsive', 'hover']);
    },
  ],
} satisfies Config;