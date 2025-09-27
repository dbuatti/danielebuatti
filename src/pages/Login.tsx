"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";

const LoginPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card dark:bg-card rounded-lg shadow-lg border border-brand-secondary">
        <h1 className="text-3xl font-bold text-center text-brand-primary">Welcome Back!</h1>
        <p className="text-center text-brand-dark/80 dark:text-brand-light/80">Sign in or create an account to continue.</p>
        <Auth
          supabaseClient={supabase}
          providers={[]} // You can add 'google', 'github', etc. here if desired
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--brand-primary))',
                  brandAccent: 'hsl(var(--brand-primary))',
                  defaultButtonBackground: 'hsl(var(--brand-primary))',
                  defaultButtonBackgroundHover: 'hsl(var(--brand-primary)/90%)',
                  defaultButtonBorder: 'hsl(var(--brand-primary))',
                  inputBackground: 'hsl(var(--background))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                },
              },
            },
          }}
          theme={theme === "dark" ? "dark" : "light"}
          redirectTo={window.location.origin} // Redirects to the root after auth
        />
      </div>
    </div>
  );
};

export default LoginPage;